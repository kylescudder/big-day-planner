import { afterAll, beforeAll, describe, expect, test } from 'bun:test'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import postgres from 'postgres'
import sharp from 'sharp'
import { sql as query } from 'drizzle-orm'

import { databaseUrl } from '../src/server/db/connection'
import { stallHealthQueries } from './postgres-proxy'

const testUrl = process.env.TEST_DATABASE_URL
if (!testUrl) throw new Error('TEST_DATABASE_URL is required')

// The repository reads its connection from the environment on import.
const healthProxy = await stallHealthQueries(
  testUrl,
  /^SELECT id FROM guest LIMIT 0$/i
)
healthProxy.allowNewConnections()
process.env.DATABASE_URL = healthProxy.url
process.env.SKIP_ENV_VALIDATION = '1'

const sql = postgres(testUrl, { max: 1, onnotice: () => {} })
const guestId = '77777777-7777-4777-8777-777777777777'
const partnerId = '88888888-8888-4888-8888-888888888888'

async function migrate() {
  const child = Bun.spawn(['bun', 'server/migrate.ts'], {
    env: { ...process.env, DATABASE_URL: testUrl },
    stdout: 'pipe',
    stderr: 'pipe'
  })
  expect(await child.exited).toBe(0)
}

beforeAll(async () => {
  await sql`DROP SCHEMA IF EXISTS drizzle CASCADE`
  await sql`DROP SCHEMA public CASCADE`
  await sql`CREATE SCHEMA public`
  await migrate()
})

afterAll(async () => {
  await sql.end()
  await healthProxy.close()
})

describe('migrations', () => {
  test('create the schema and are safe to re-run', async () => {
    await migrate()
    const tables = await sql`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' ORDER BY table_name
    `
    expect(tables.map(({ table_name }) => table_name)).toEqual([
      'auth_account',
      'auth_email_limit',
      'auth_passkey',
      'auth_rate_limit',
      'auth_session',
      'auth_user',
      'auth_verification',
      'colours',
      'detail',
      'espoused',
      'guest',
      'hotels',
      'image',
      'main',
      'pudding',
      'starter',
      'taxi',
      'timing',
      'user_profile'
    ])
    const [journal] =
      await sql`SELECT count(*)::int AS applied FROM drizzle.__drizzle_migrations`
    expect(journal!.applied).toBe(3)
  })

  test('move a journal left in public by earlier releases, keeping its history', async () => {
    await sql`ALTER TABLE drizzle.__drizzle_migrations SET SCHEMA public`
    const before =
      await sql`SELECT hash FROM public.__drizzle_migrations ORDER BY id`
    // The baseline isn't idempotent, so rerunning it here would fail.
    await migrate()
    expect(
      (await sql`SELECT to_regclass('public.__drizzle_migrations') AS name`)[0]!
        .name
    ).toBeNull()
    const after =
      await sql`SELECT hash FROM drizzle.__drizzle_migrations ORDER BY id`
    expect(after.map(({ hash }) => hash)).toEqual(
      before.map(({ hash }) => hash)
    )
  })

  test('drop the empty journal an older release leaves in public', async () => {
    await sql`CREATE TABLE public.__drizzle_migrations (id serial PRIMARY KEY, hash text NOT NULL, created_at bigint)`
    await migrate()
    expect(
      (await sql`SELECT to_regclass('public.__drizzle_migrations') AS name`)[0]!
        .name
    ).toBeNull()
    const [journal] =
      await sql`SELECT count(*)::int AS applied FROM drizzle.__drizzle_migrations`
    expect(journal!.applied).toBe(3)
  })
})

describe('Better Auth migration', () => {
  test('adds only auth and profile tables and keeps existing wedding data unchanged', async () => {
    // Recreate a database that has only the baseline, as production does now.
    const baseline = await Bun.file(
      new URL('../drizzle/0000_baseline.sql', import.meta.url)
    ).text()
    const journal = await Bun.file(
      new URL('../drizzle/meta/_journal.json', import.meta.url)
    ).json()
    await sql`DROP SCHEMA IF EXISTS drizzle CASCADE`
    await sql`DROP SCHEMA public CASCADE`
    await sql`CREATE SCHEMA public`
    // The platform gives the runtime role access to new tables through the
    // owner's default privileges; mirror that so new tables are covered.
    await sql`DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'bdp_test_runtime') THEN
        CREATE ROLE bdp_test_runtime NOLOGIN;
      END IF;
    END $$`
    await sql`GRANT USAGE ON SCHEMA public TO bdp_test_runtime`
    await sql`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO bdp_test_runtime`
    await sql`CREATE SCHEMA drizzle`
    await sql`CREATE TABLE drizzle.__drizzle_migrations (id serial PRIMARY KEY, hash text NOT NULL, created_at bigint)`
    await sql.unsafe(baseline.replaceAll('--> statement-breakpoint', ''))
    await sql`INSERT INTO drizzle.__drizzle_migrations (hash, created_at) VALUES (${new Bun.CryptoHasher('sha256').update(baseline).digest('hex')}, ${journal.entries[0].when})`
    await sql`
      INSERT INTO guest (id, forename, surname, email, phone, address1, song, artist, "guestKey", rsvp, rsvp_answer)
      VALUES ('55555555-5555-4555-8555-555555555555', 'Existing', 'Guest', 'existing@example.com', '0', '1 Lane', 'Song', 'Artist', 'existing', true, true)
    `
    await sql`INSERT INTO espoused (id, groom, bride, groom_email, bride_email) VALUES ('33333333-3333-4333-8333-333333333333', 'Groom', 'Bride', 'groom@example.com', 'bride@example.com')`
    const snapshot = () =>
      sql`SELECT (SELECT row_to_json(g) FROM guest g) AS guest, (SELECT row_to_json(e) FROM espoused e) AS espoused`
    const [before] = await snapshot()
    await migrate()
    const [after] = await snapshot()
    expect(after).toEqual(before)
    const [auth] = await sql`
      SELECT count(*)::int AS tables FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name LIKE 'auth\_%'`
    expect(auth!.tables).toBe(7)
    // The runtime role can manage profile photos, which go with their user.
    await sql.begin(async (tx) => {
      await tx`SET LOCAL ROLE bdp_test_runtime`
      await tx`INSERT INTO auth_user (id, name, email) VALUES ('runtime-user', 'Runtime', 'runtime@example.com')`
      await tx`INSERT INTO user_profile (user_id, avatar, avatar_version) VALUES ('runtime-user', '\\xffd8ff', 'v1')`
      await tx`DELETE FROM auth_user WHERE id = 'runtime-user'`
      expect(
        (await tx`SELECT count(*)::int AS rows FROM user_profile`)[0]!.rows
      ).toBe(0)
    })
    await sql`DELETE FROM guest`
    await sql`DELETE FROM espoused`
  })
})

describe('database URL', () => {
  test('reads and encodes the password file', () => {
    const file = join(mkdtempSync(join(tmpdir(), 'bdp-')), 'password')
    writeFileSync(file, 'p@ss/word\n')
    const url = new URL(databaseUrl('postgres://runtime@db:5432/app', file))
    expect(decodeURIComponent(url.password)).toBe('p@ss/word')
    expect(url.username).toBe('runtime')
  })
})

describe('guest responses', () => {
  test('update only their own fields and keep linked guests together', async () => {
    const repository = await import('../src/server/repository')
    await sql`INSERT INTO starter (id, text) VALUES ('44444444-4444-4444-8444-444444444444', 'Soup')`
    await sql`
      INSERT INTO guest (id, forename, surname, email, phone, address1, song, artist, "guestKey")
      VALUES (${guestId}, 'Test', 'Guest', 'guest@example.com', '0', '1 Road', '', '', 'testkey'),
             (${partnerId}, 'Plus', 'One', 'plus@example.com', '0', '1 Road', '', '', 'pluskey')
    `
    await sql`UPDATE guest SET "parentId" = ${guestId} WHERE id = ${partnerId}`

    await repository.updateGuestRSVP({
      id: guestId,
      rsvp: true,
      rsvpAnswer: true
    })
    await repository.updateGuestSong({
      id: guestId,
      song: 'Song',
      artist: 'Artist'
    })
    await repository.updateGuestMenu({
      id: guestId,
      starterId: '44444444-4444-4444-8444-444444444444',
      mainId: null,
      puddingId: null,
      dietaryRequirements: 'none'
    })

    const guest = await repository.getGuest(guestId)
    expect(guest).toMatchObject({
      rsvp: true,
      rsvpAnswer: true,
      song: 'Song',
      artist: 'Artist',
      starterId: '44444444-4444-4444-8444-444444444444',
      dietaryRequirements: 'none',
      email: 'guest@example.com'
    })

    const party = await repository.getGuestAndLinkedGuest(partnerId)
    expect(party.map(({ id }) => id).sort()).toEqual([guestId, partnerId])
    expect((await repository.getGuestByKey('testkey'))?.[0]?.id).toBe(guestId)
    expect(await repository.getGuestByKey('missing')).toBeNull()
  })
})

describe('address lookup', () => {
  test('is off and returns empty results when getAddress.io is unconfigured', async () => {
    const repository = await import('../src/server/repository')
    const originalFetch = globalThis.fetch
    globalThis.fetch = (() => {
      throw new Error('getAddress.io must not be called')
    }) as unknown as typeof fetch
    try {
      expect(repository.isAddressLookupEnabled()).toBe(false)
      expect(await repository.getAddressList('AB1 2CD')).toEqual({
        suggestions: []
      })
      expect(await repository.getAddress('some/address')).toBeNull()
    } finally {
      globalThis.fetch = originalFetch
    }
  })
})

test('timed-out health probes stop SQL and preserve shared pool availability', async () => {
  const { db } = await import('../src/server/db')
  const { healthResponse } = await import('../src/server/health')
  expect((await healthResponse()).status).toBe(200)
  await sql`BEGIN`
  try {
    await sql`LOCK TABLE guest IN ACCESS EXCLUSIVE MODE`
    const responses = await Promise.all(
      Array.from({ length: 8 }, () => healthResponse())
    )
    for (const response of responses) {
      expect(response.status).toBe(503)
      expect(response.headers.get('Cache-Control')).toBe('no-store')
      expect(await response.json()).toEqual({ ok: false })
    }
    let timer: ReturnType<typeof setTimeout> | undefined
    try {
      const rows = await Promise.race([
        db.execute(query`SELECT 42 AS answer`),
        new Promise<never>((_, reject) => {
          timer = setTimeout(
            () => reject(new Error('Health probes exhausted the shared pool')),
            1500
          )
        })
      ])
      expect(rows[0]?.answer).toBe(42)
      const deadline = Date.now() + 1500
      for (;;) {
        const [row] =
          await sql`SELECT count(*)::int AS active FROM pg_stat_activity
          WHERE datname = current_database() AND pid <> pg_backend_pid()
          AND state = 'active' AND query ILIKE '%SELECT id FROM guest LIMIT 0%'`
        if (row?.active === 0) break
        if (Date.now() > deadline)
          throw new Error('Health SQL outlived its deadline')
        await Bun.sleep(25)
      }
    } finally {
      clearTimeout(timer)
    }
  } finally {
    await sql`ROLLBACK`
  }
  expect((await healthResponse()).status).toBe(200)
}, 15000)

test('health recovers on a new connection while the old socket stays stalled', async () => {
  const { healthResponse } = await import('../src/server/health')
  const proxy = healthProxy
  proxy.stall()
  try {
    const responses = await Promise.all(
      Array.from({ length: 8 }, () => healthResponse())
    )
    for (const response of responses) {
      expect(response.status).toBe(503)
      expect(await response.json()).toEqual({ ok: false })
    }
    proxy.allowNewConnections()
    expect((await healthResponse()).status).toBe(200)
    const deadline = Date.now() + 1000
    while (proxy.stalledConnections && Date.now() < deadline)
      await Bun.sleep(10)
    expect(proxy.stalledConnections).toBe(0)
  } finally {
    proxy.allowNewConnections()
  }
}, 10000)

describe('API procedures', () => {
  test('public pages load, admin procedures need a session, and admin input is validated', async () => {
    const { appRouter } = await import('../src/server/trpc')
    const anonymous = appRouter.createCaller({ userId: null })
    const admin = appRouter.createCaller({ userId: 'user_admin' })

    expect((await anonymous.session()).userId).toBeNull()
    expect(Array.isArray((await anonymous.home()).images)).toBe(true)
    const page = await anonymous.guestPage({ id: guestId })
    expect(page.guestData.map(({ id }) => id).sort()).toEqual(
      [guestId, partnerId].sort()
    )
    expect(await anonymous.guestByKey({ guestKey: ' TestKey ' })).toEqual({
      id: guestId
    })
    await expect(
      anonymous.guestPage({ id: 'not-a-uuid' })
    ).rejects.toMatchObject({
      code: 'BAD_REQUEST'
    })

    for (const call of [
      () => anonymous.guestsPage(),
      () => anonymous.guest.get(guestId),
      () => anonymous.guest.delete(guestId),
      () => anonymous.address.lookupEnabled()
    ])
      await expect(call()).rejects.toMatchObject({ code: 'UNAUTHORIZED' })

    const id = '99999999-9999-4999-8999-999999999999'
    const created = new Date('2027-01-02T03:04:05.000Z')
    const newGuest = {
      id,
      forename: 'New',
      surname: 'Guest',
      email: 'new@example.com',
      phone: '0',
      address1: '2 Road',
      address2: null,
      address3: null,
      town: null,
      county: null,
      postcode: null,
      starterId: null,
      mainId: null,
      puddingId: null,
      song: '',
      artist: '',
      rsvp: false,
      rsvpAnswer: false,
      parentId: null,
      dietaryRequirements: '',
      guestKey: 'newkey',
      createdAt: created,
      updatedAt: created
    }
    await expect(anonymous.guest.create(newGuest)).rejects.toMatchObject({
      code: 'UNAUTHORIZED'
    })
    await admin.guest.create(newGuest)
    expect(await admin.guest.get(id)).toMatchObject({
      forename: 'New',
      createdAt: created
    })
    await admin.guest.update({ ...newGuest, forename: 'Renamed' })
    expect((await admin.guest.get(id))?.forename).toBe('Renamed')
    // Input that the old unchecked validator let through is now rejected.
    for (const invalid of [
      { ...newGuest, id: 'not-a-uuid' },
      { ...newGuest, rsvp: 'yes' },
      { ...newGuest, address2: 'x'.repeat(300) }
    ])
      await expect(
        admin.guest.update(invalid as unknown as typeof newGuest)
      ).rejects.toMatchObject({ code: 'BAD_REQUEST' })
    // Dates sent as strings are coerced, as JSON would carry them.
    const timing = {
      id: '66666666-6666-4666-8666-666666666666',
      time: '2027-06-12T13:00:00.000Z' as unknown as Date,
      event: 'Ceremony',
      altText: null,
      imageUrl: null
    }
    await admin.timing.update(timing)
    const [stored] = await sql`SELECT time FROM timing WHERE id = ${timing.id}`
    expect(stored!.time).toBeInstanceOf(Date)
    await admin.timing.delete(timing)
    await admin.guest.delete(id)
    expect(await admin.guest.get(id)).toBeNull()
    expect(
      (await admin.guestsPage()).data.some((guest) => guest.id === id)
    ).toBe(false)
  })
})

describe('Better Auth', () => {
  const authOrigin = 'https://rsvp.auth.test'
  const allowedEmails = ['groom@example.com', 'bride@example.com']
  const authEnv = {
    BETTER_AUTH_URL: authOrigin,
    BETTER_AUTH_SECRET: crypto.randomUUID() + crypto.randomUUID(),
    BREVO_API_KEY: 'fixture-never-used-to-send',
    AUTH_EMAIL_FROM: 'rsvp@example.com',
    AUTH_ALLOWED_EMAILS: allowedEmails.join(',')
  }
  const originalEnv = Object.fromEntries(
    Object.keys(authEnv).map((key) => [key, process.env[key]])
  )
  const originalFetch = globalThis.fetch
  let fixtureNumber = 0

  beforeAll(() => {
    Object.assign(process.env, authEnv)
    // No test may reach the real mail provider.
    globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
      if (
        String(input instanceof Request ? input.url : input).includes('brevo')
      )
        throw new Error('Tests must not send email')
      return originalFetch(input, init)
    }) as typeof fetch
  })

  afterAll(() => {
    globalThis.fetch = originalFetch
    for (const [key, value] of Object.entries(originalEnv)) {
      if (value === undefined) delete process.env[key]
      else process.env[key] = value
    }
  })

  async function authFixture(dailyEmailLimit = 40) {
    await sql`DELETE FROM auth_user`
    await sql`DELETE FROM auth_verification`
    await sql`DELETE FROM auth_rate_limit`
    await sql`DELETE FROM auth_email_limit`
    const { db } = await import('../src/server/db')
    const { createBigDayPlannerAuth } =
      await import('../src/server/auth-factory')
    const sent = new Map<string, string>()
    const links: { email: string; kind: string; url: string }[] = []
    const auth = createBigDayPlannerAuth(
      db,
      {
        baseURL: authOrigin,
        secret: authEnv.BETTER_AUTH_SECRET,
        allowedEmails,
        dailyEmailLimit
      },
      async (email, otp) => {
        sent.set(email, otp)
      },
      async (email, kind, url) => {
        links.push({ email, kind, url })
      }
    )
    const ip = `203.0.113.${++fixtureNumber}`
    function request(
      path: string,
      body?: unknown,
      cookie = '',
      extra: Record<string, string> = {}
    ) {
      return auth.handler(
        new Request(authOrigin + '/api/auth' + path, {
          method: body === undefined ? 'GET' : 'POST',
          headers: {
            Origin: authOrigin,
            'Content-Type': 'application/json',
            'CF-Connecting-IP': ip,
            Cookie: cookie,
            ...extra
          },
          body: body === undefined ? undefined : JSON.stringify(body)
        })
      )
    }
    return { auth, request, sent, links }
  }

  function mergeCookies(response: Response) {
    return response.headers
      .getSetCookie()
      .map((value) => value.split(';')[0])
      .join('; ')
  }

  async function signIn(
    fixture: Awaited<ReturnType<typeof authFixture>>,
    email = 'groom@example.com'
  ) {
    const sent = await fixture.request('/email-otp/send-verification-otp', {
      email,
      type: 'sign-in'
    })
    expect(sent.status).toBe(200)
    const response = await fixture.request('/sign-in/email-otp', {
      email,
      otp: fixture.sent.get(email)
    })
    expect(response.status).toBe(200)
    return {
      cookie: mergeCookies(response),
      user: (await response.clone().json()).user as {
        id: string
        email: string
      }
    }
  }

  test('email codes go only to allowlisted emails, are hashed and single-use', async () => {
    const fixture = await authFixture()
    const outsider = await fixture.request('/email-otp/send-verification-otp', {
      email: 'guest@example.com',
      type: 'sign-in'
    })
    expect(outsider.status).toBe(200)
    expect(await outsider.json()).toEqual({ success: true })
    expect(fixture.sent.size).toBe(0)
    expect((await sql`SELECT id FROM auth_verification`).length).toBe(0)

    const sent = await fixture.request('/email-otp/send-verification-otp', {
      email: ' GROOM@example.com',
      type: 'sign-in'
    })
    expect(sent.status).toBe(200)
    const otp = fixture.sent.get('groom@example.com')!
    expect(otp).toMatch(/^\d{6}$/)
    const [stored] = await sql`SELECT identifier, value FROM auth_verification`
    expect(stored!.identifier).toBe('sign-in-otp-groom@example.com')
    expect(stored!.value).toMatch(/^[a-f0-9]{64}:0$/)
    expect(stored!.value).toBe(
      new Bun.CryptoHasher('sha256', authEnv.BETTER_AUTH_SECRET)
        .update('big-day-planner-email-otp:' + otp)
        .digest('hex') + ':0'
    )

    // One email a minute per recipient keeps the code already sent usable, and
    // the refusal looks exactly like the answer for an address with no mail.
    const tooSoon = await fixture.request('/email-otp/send-verification-otp', {
      email: 'groom@example.com',
      type: 'sign-in'
    })
    expect(tooSoon.status).toBe(200)
    expect(await tooSoon.json()).toEqual({ success: true })
    expect(fixture.sent.size).toBe(1)

    const wrong = otp === '000000' ? '111111' : '000000'
    expect(
      (
        await fixture.request('/sign-in/email-otp', {
          email: 'groom@example.com',
          otp: wrong
        })
      ).status
    ).toBe(400)
    const signedIn = await fixture.request('/sign-in/email-otp', {
      email: 'groom@example.com',
      otp
    })
    expect(signedIn.status).toBe(200)
    expect((await signedIn.clone().json()).user.emailVerified).toBe(true)
    const cookies = signedIn.headers.getSetCookie().join(';')
    expect(cookies).toMatch(/__Secure-big-day-planner-auth\.session_token/)
    expect(cookies).toMatch(/HttpOnly/i)
    expect(cookies).toMatch(/SameSite=Lax/i)
    expect(cookies).not.toMatch(/Domain=/i)
    expect(
      (
        await fixture.request('/sign-in/email-otp', {
          email: 'groom@example.com',
          otp
        })
      ).status
    ).toBe(400)
    // Guests and other addresses never get an account.
    expect(
      (await sql`SELECT email FROM auth_user`).map(({ email }) => email)
    ).toEqual(['groom@example.com'])
  })

  test('a throttled allowlisted address gets the same answer as an unlisted one', async () => {
    const fixture = await authFixture()
    const endpoints: [string, object][] = [
      ['/email-otp/send-verification-otp', { type: 'sign-in' }],
      ['/sign-in/magic-link', { callbackURL: '/admin' }],
      ['/request-password-reset', { redirectTo: '/auth/reset-password' }]
    ]
    const answer = async (path: string, extra: object, email: string) => {
      const response = await fixture.request(path, { email, ...extra })
      return { status: response.status, body: await response.text() }
    }
    expect(
      (await answer(endpoints[0]![0], endpoints[0]![1], 'groom@example.com'))
        .status
    ).toBe(200)
    const code = fixture.sent.get('groom@example.com')
    for (const [path, extra] of endpoints) {
      const throttled = await answer(path, extra, 'groom@example.com')
      const unlisted = await answer(path, extra, 'stranger@example.com')
      expect(throttled, path).toEqual(unlisted)
      expect(throttled.status, path).toBe(200)
    }
    // Nothing more was sent or charged, and the first code still works.
    expect(fixture.links.length).toBe(0)
    expect(fixture.sent.get('groom@example.com')).toBe(code)
    const [global] =
      await sql`SELECT count FROM auth_email_limit WHERE key = 'global:day'`
    expect(global!.count).toBe(1)
    expect(
      (
        await fixture.request('/sign-in/email-otp', {
          email: 'groom@example.com',
          otp: code
        })
      ).status
    ).toBe(200)
  })

  test('the app email budget is shared and cross-site requests are refused', async () => {
    const fixture = await authFixture(1)
    const crossSite = await fixture.request(
      '/email-otp/send-verification-otp',
      { email: 'groom@example.com', type: 'sign-in' },
      '',
      { Origin: 'https://evil.example', 'Sec-Fetch-Site': 'cross-site' }
    )
    expect(crossSite.status).toBe(403)
    expect((await sql`SELECT key FROM auth_email_limit`).length).toBe(0)
    const responses = await Promise.all(
      Array.from({ length: 3 }, () =>
        fixture.request('/email-otp/send-verification-otp', {
          email: 'groom@example.com',
          type: 'sign-in'
        })
      )
    )
    expect(responses.map(({ status }) => status).sort()).toEqual([
      200, 429, 429
    ])
    expect(
      (
        await fixture.request('/email-otp/send-verification-otp', {
          email: 'bride@example.com',
          type: 'sign-in'
        })
      ).status
    ).toBe(429)
    expect(fixture.sent.size).toBe(1)
  })

  test('sign-up stays closed; reset links set a password once; password sign-in works', async () => {
    const fixture = await authFixture()
    const password = 'confetti and champagne'
    const signUp = await fixture.request('/sign-up/email', {
      email: 'groom@example.com',
      password,
      name: 'Groom'
    })
    expect(signUp.status).toBe(400)
    const { user } = await signIn(fixture)
    expect(
      (
        await fixture.request('/sign-in/email', {
          email: 'groom@example.com',
          password
        })
      ).status
    ).toBe(401)
    await sql`DELETE FROM auth_email_limit`

    for (const email of ['guest@example.com', 'GROOM@example.com '])
      expect(
        (
          await fixture.request('/request-password-reset', {
            email,
            redirectTo: '/auth/reset-password'
          })
        ).status
      ).toBe(200)
    expect(fixture.links.map(({ email, kind }) => [email, kind])).toEqual([
      ['groom@example.com', 'reset-password']
    ])
    const resetUrl = new URL(fixture.links[0]!.url)
    expect(resetUrl.origin).toBe(authOrigin)
    const token = resetUrl.pathname.split('/').at(-1)!
    expect(
      (
        await sql`SELECT id FROM auth_verification WHERE identifier = ${'reset-password:' + token}`
      ).length
    ).toBe(1)
    expect(
      (
        await fixture.request('/reset-password', {
          newPassword: 'short',
          token
        })
      ).status
    ).toBe(400)
    expect(
      (
        await fixture.request('/reset-password', {
          newPassword: password,
          token
        })
      ).status
    ).toBe(200)
    expect(
      (
        await fixture.request('/reset-password', {
          newPassword: password + '!',
          token
        })
      ).status
    ).toBe(400)
    const [credential] = await sql`
      SELECT password FROM auth_account
      WHERE user_id = ${user.id} AND provider_id = 'credential'`
    expect(credential!.password).not.toContain(password)
    expect(
      (
        await fixture.request('/sign-in/email', {
          email: 'groom@example.com',
          password: 'not the right password'
        })
      ).status
    ).toBe(401)
    const signedIn = await fixture.request('/sign-in/email', {
      email: 'groom@example.com',
      password
    })
    expect(signedIn.status).toBe(200)
    const session = await fixture.request(
      '/get-session',
      undefined,
      mergeCookies(signedIn)
    )
    expect((await session.json()).user.id).toBe(user.id)

    await sql`DELETE FROM auth_rate_limit`
    await sql`DELETE FROM auth_email_limit`
    expect(
      (
        await fixture.request('/request-password-reset', {
          email: 'groom@example.com',
          redirectTo: 'https://attacker.example/reset'
        })
      ).status
    ).toBe(403)
    expect(fixture.links.length).toBe(1)
  })

  test('magic links are allowlisted, same-site only and single-use', async () => {
    const fixture = await authFixture()
    expect(
      (
        await fixture.request('/sign-in/magic-link', {
          email: 'guest@example.com',
          callbackURL: '/guests'
        })
      ).status
    ).toBe(200)
    expect(fixture.links.length).toBe(0)
    for (const callbackURL of [
      'https://attacker.example/',
      '//attacker.example/',
      '/.//attacker.example/',
      '/\t/attacker.example/',
      '/\\attacker.example/'
    ]) {
      await sql`DELETE FROM auth_rate_limit`
      expect(
        (
          await fixture.request('/sign-in/magic-link', {
            email: 'bride@example.com',
            callbackURL
          })
        ).status
      ).toBe(403)
    }
    await sql`DELETE FROM auth_rate_limit`
    const requested = await fixture.request('/sign-in/magic-link', {
      email: 'bride@example.com',
      callbackURL: authOrigin + '/guests'
    })
    expect(requested.status).toBe(200)
    expect(fixture.links.map(({ email, kind }) => [email, kind])).toEqual([
      ['bride@example.com', 'magic-link']
    ])
    const magic = new URL(fixture.links[0]!.url)
    expect(magic.origin).toBe(authOrigin)
    const verify = () =>
      fixture.auth.handler(
        new Request(magic, {
          headers: { 'CF-Connecting-IP': '203.0.113.250' },
          redirect: 'manual'
        })
      )
    const verified = await verify()
    expect(verified.status).toBe(302)
    expect(verified.headers.get('location')).toBe(authOrigin + '/guests')
    const session = await fixture.request(
      '/get-session',
      undefined,
      mergeCookies(verified)
    )
    const user = (await session.json()).user
    expect(user.email).toBe('bride@example.com')
    expect(user.emailVerified).toBe(true)
    expect(mergeCookies(await verify())).not.toContain('session_token')
    expect(
      (await sql`SELECT id FROM auth_user WHERE email = 'guest@example.com'`)
        .length
    ).toBe(0)
  })

  test('the app route forwards only the endpoints the sign-in screens use', async () => {
    const { authRouteHandler } = await import('../src/server/auth-route')
    const call = (path: string, method = 'POST') =>
      authRouteHandler(
        new Request(authOrigin + '/api/auth' + path, {
          method,
          headers: { Origin: authOrigin, 'Content-Type': 'application/json' },
          body: method === 'GET' ? undefined : '{}'
        })
      )
    for (const path of [
      '/sign-up/email',
      '/email-otp/get-verification-otp',
      '/change-email',
      '/delete-user',
      '/list-sessions'
    ])
      expect((await call(path)).status).toBe(404)
    for (const [path, method] of [
      ['/get-session', 'GET'],
      ['/sign-in/email', 'POST'],
      ['/sign-in/magic-link', 'POST'],
      ['/request-password-reset', 'POST'],
      ['/reset-password', 'POST'],
      ['/list-accounts', 'GET'],
      ['/passkey/generate-authenticate-options', 'GET']
    ] as const)
      expect((await call(path, method)).status).not.toBe(404)
  })

  test('admin data, uploads and passkeys need a verified allowlisted session; guest pages stay public', async () => {
    const fixture = await authFixture()
    const { cookie, user } = await signIn(fixture)
    const { trpcHandler } = await import('../src/server/trpc-handler')
    const { requireUploader } = await import('../src/server/uploadthing')
    const trpc = (path: string, init: RequestInit = {}) =>
      trpcHandler(new Request(authOrigin + '/api/trpc/' + path, init))

    expect((await trpc('guestsPage')).status).toBe(401)
    expect((await trpc('home')).status).toBe(200)
    const signedIn = await trpc('guestsPage', { headers: { Cookie: cookie } })
    expect(signedIn.status).toBe(200)
    const session = await trpc('session', { headers: { Cookie: cookie } })
    expect((await session.json()).result.data.json.userId).toBe(user.id)
    expect(
      await requireUploader({
        req: new Request(authOrigin, { headers: { Cookie: cookie } })
      })
    ).toEqual({ userId: user.id })
    await expect(
      requireUploader({ req: new Request(authOrigin) })
    ).rejects.toMatchObject({ code: 'FORBIDDEN' })

    // Guest responses work without a session; cross-site writes are refused.
    const guestByKey = (origin: string) =>
      trpc('guestByKey', {
        method: 'POST',
        headers: { Origin: origin, 'Content-Type': 'application/json' },
        body: JSON.stringify({ json: { guestKey: 'nobody' } })
      })
    expect((await guestByKey(authOrigin)).status).toBe(200)
    expect((await guestByKey('https://evil.example')).status).toBe(403)

    // Unverified or removed emails lose access straight away.
    await sql`UPDATE auth_user SET email_verified = false WHERE id = ${user.id}`
    expect(
      (await trpc('guestsPage', { headers: { Cookie: cookie } })).status
    ).toBe(401)
    expect(
      (
        await fixture.request(
          '/passkey/generate-register-options',
          undefined,
          cookie
        )
      ).status
    ).toBe(401)
    await sql`UPDATE auth_user SET email_verified = true, email = 'former@example.com' WHERE id = ${user.id}`
    expect(
      (await trpc('guestsPage', { headers: { Cookie: cookie } })).status
    ).toBe(401)
    await expect(
      requireUploader({
        req: new Request(authOrigin, { headers: { Cookie: cookie } })
      })
    ).rejects.toMatchObject({ code: 'FORBIDDEN' })
    expect(
      (
        await fixture.request(
          '/passkey/generate-register-options',
          undefined,
          cookie
        )
      ).status
    ).toBe(401)
  })

  test('profile photos are bounded, re-encoded, private to their owner and removable', async () => {
    const fixture = await authFixture()
    const { cookie, user } = await signIn(fixture)
    const other = await signIn(fixture, 'bride@example.com')
    const { db } = await import('../src/server/db')
    const { createProfileHandler } =
      await import('../src/server/profile-handler')
    const handler = createProfileHandler(db, {
      origin: authOrigin,
      allowedEmails,
      getSession: (headers) => fixture.auth.api.getSession({ headers })
    })
    const image = await sharp({
      create: { width: 64, height: 32, channels: 3, background: '#8844ff' }
    })
      .png()
      .withMetadata({ exif: { IFD0: { Artist: 'Test metadata to strip' } } })
      .toBuffer()
    expect((await sharp(image).metadata()).exif).toBeDefined()
    const request = (
      method = 'GET',
      body?: BodyInit,
      type = 'image/png',
      session = cookie,
      extra: Record<string, string> = {}
    ) =>
      handler(
        new Request(authOrigin + '/api/profile/avatar', {
          method,
          body,
          headers: {
            Origin: authOrigin,
            Cookie: session,
            'Content-Type': type,
            ...extra
          }
        })
      )

    // Signed out, cross-site, wrong type, not an image, too large.
    expect(
      (await request('PUT', new Uint8Array(image), 'image/png', '')).status
    ).toBe(401)
    expect((await request('GET', undefined, 'image/png', '')).status).toBe(401)
    expect(
      (
        await request('PUT', new Uint8Array(image), 'image/png', cookie, {
          Origin: 'https://evil.example'
        })
      ).status
    ).toBe(403)
    expect(
      (await request('PUT', '<svg onload="alert(1)"/>', 'image/svg+xml')).status
    ).toBe(415)
    expect(
      (await request('PUT', '<svg onload="alert(1)"/>', 'image/png')).status
    ).toBe(400)
    expect(
      (await request('PUT', 'GIF89a not really', 'image/jpeg')).status
    ).toBe(400)
    expect(
      (await request('PUT', new Uint8Array(2 * 1024 * 1024 + 1))).status
    ).toBe(413)
    expect((await request()).status).toBe(404)

    // Upload.
    const first = await request('PUT', new Uint8Array(image))
    expect(first.status).toBe(200)
    const initial = (await first.json()) as { image: string }
    expect(initial.image).toMatch(/^\/api\/profile\/avatar\?v=[\w-]+$/)
    const [stored] =
      await sql`SELECT image FROM auth_user WHERE id = ${user.id}`
    expect(stored!.image).toBe(initial.image)

    // update-user only confirms the photo stored for that user.
    expect(
      (await fixture.request('/update-user', { image: initial.image }, cookie))
        .status
    ).toBe(200)
    expect(
      (
        await fixture.request(
          '/update-user',
          { image: initial.image },
          other.cookie
        )
      ).status
    ).toBe(400)
    expect(
      (
        await fixture.request(
          '/update-user',
          { image: 'https://evil.example/a.jpg' },
          cookie
        )
      ).status
    ).toBe(400)
    expect(
      (await fixture.request('/update-user', { image: null }, cookie)).status
    ).toBe(400)

    // Served privately as a 256 px JPEG with no metadata.
    const picture = await request()
    expect(picture.status).toBe(200)
    expect(picture.headers.get('Content-Type')).toBe('image/jpeg')
    expect(picture.headers.get('Cache-Control')).toBe('no-store')
    expect(picture.headers.get('X-Content-Type-Options')).toBe('nosniff')
    expect(picture.headers.get('Cross-Origin-Resource-Policy')).toBe(
      'same-origin'
    )
    const metadata = await sharp(
      Buffer.from(await picture.arrayBuffer())
    ).metadata()
    expect(metadata.format).toBe('jpeg')
    expect(metadata.width).toBe(256)
    expect(metadata.height).toBe(256)
    expect(metadata.exif).toBeUndefined()

    // Another planner never gets this photo; they only see their own.
    expect(
      (await request('GET', undefined, 'image/png', other.cookie)).status
    ).toBe(404)

    // Replace: a new version every time.
    const replaced = await request(
      'PUT',
      new Uint8Array(
        await sharp({
          create: { width: 40, height: 40, channels: 3, background: '#ff0000' }
        })
          .webp()
          .toBuffer()
      ),
      'image/webp'
    )
    expect(replaced.status).toBe(200)
    const next = (await replaced.json()) as { image: string }
    expect(next.image).not.toBe(initial.image)
    const [rows] =
      await sql`SELECT count(*)::int AS rows FROM user_profile WHERE user_id = ${user.id}`
    expect(rows!.rows).toBe(1)

    // Access is lost straight away when the email is unverified or removed.
    await sql`UPDATE auth_user SET email_verified = false WHERE id = ${user.id}`
    expect((await request()).status).toBe(403)
    await sql`UPDATE auth_user SET email_verified = true, email = 'former@example.com' WHERE id = ${user.id}`
    expect((await request()).status).toBe(403)
    expect((await request('DELETE')).status).toBe(403)
    await sql`UPDATE auth_user SET email = 'groom@example.com' WHERE id = ${user.id}`

    // Delete.
    const removed = await request('DELETE')
    expect(removed.status).toBe(200)
    expect(await removed.json()).toEqual({ image: null })
    expect((await request()).status).toBe(404)
    const [cleared] =
      await sql`SELECT image FROM auth_user WHERE id = ${user.id}`
    expect(cleared!.image).toBeNull()
    expect(
      (await fixture.request('/update-user', { image: null }, cookie)).status
    ).toBe(200)

    // The app route: signed out is 401.
    const { handleProfileRequest } = await import('../src/server/profile')
    const routed = await handleProfileRequest(
      new Request(authOrigin + '/api/profile/avatar', {
        method: 'PUT',
        headers: {
          Origin: authOrigin,
          Cookie: cookie,
          'Content-Type': 'image/png'
        },
        body: new Uint8Array(image)
      })
    )
    expect(routed.status).toBe(200)
    expect(
      (
        await handleProfileRequest(
          new Request(authOrigin + '/api/profile/avatar')
        )
      ).status
    ).toBe(401)
  })
})
