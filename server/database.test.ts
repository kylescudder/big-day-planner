import { afterAll, beforeAll, describe, expect, test } from 'bun:test'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import postgres from 'postgres'
import { sql as query } from 'drizzle-orm'

import { databaseUrl } from '../src/server/db/connection'

const testUrl = process.env.TEST_DATABASE_URL
if (!testUrl) throw new Error('TEST_DATABASE_URL is required')

// The repository reads its connection from the environment on import.
process.env.DATABASE_URL = testUrl
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
  await sql`DROP SCHEMA public CASCADE`
  await sql`CREATE SCHEMA public`
  await migrate()
})

afterAll(async () => {
  await sql.end()
})

describe('migrations', () => {
  test('create the schema and are safe to re-run', async () => {
    await migrate()
    const tables = await sql`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' ORDER BY table_name
    `
    expect(tables.map(({ table_name }) => table_name)).toEqual([
      '__drizzle_migrations',
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
      'timing'
    ])
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
