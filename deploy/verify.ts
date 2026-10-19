// Post-deploy acceptance checks, run inside the candidate container with the
// restricted runtime credential. Fixtures use a unique key and are removed.
import postgres from 'postgres'

import { databaseUrl } from '../src/server/db/connection'

const origin = process.env.VERIFY_ORIGIN || 'http://127.0.0.1:3000'
const sql = postgres(databaseUrl(), { max: 1 })
const guestId = crypto.randomUUID()
const forename = `deployment-check-${guestId.slice(0, 8)}`

async function request(path: string, status = 200, init?: RequestInit) {
  const response = await fetch(origin + path, {
    redirect: 'manual',
    ...init,
    signal: AbortSignal.timeout(5000)
  })
  if (response.status !== status)
    throw new Error(`${path}: expected ${status}, received ${response.status}`)
  return response
}

try {
  const [permissions] = await sql`
    SELECT current_user AS role,
      has_schema_privilege(current_user, 'public', 'CREATE') AS can_create,
      rolsuper, rolcreatedb, rolcreaterole
    FROM pg_roles WHERE rolname = current_user
  `
  const expectedRole = new URL(process.env.DATABASE_URL!).username
  if (
    permissions?.role !== expectedRole ||
    !expectedRole.endsWith('_runtime') ||
    permissions.can_create ||
    permissions.rolsuper ||
    permissions.rolcreatedb ||
    permissions.rolcreaterole
  )
    throw new Error('Runtime database role is not restricted')

  const page = await (await request('/')).text()
  if (!page.includes('<title>Big Day Planner</title>'))
    throw new Error('Home page is missing')
  const assets = [
    ...page.matchAll(/(?:src|href)="(\/assets\/[^"]+\.(?:js|css))"/g)
  ]
  if (
    !assets.some(([, a]) => a!.endsWith('.css')) ||
    !assets.some(([, a]) => a!.endsWith('.js'))
  )
    throw new Error('Built assets are missing')
  for (const [, asset] of assets) {
    const response = await request(asset!)
    if (
      !response.headers
        .get('Content-Type')
        ?.includes(asset!.endsWith('.css') ? 'text/css' : 'javascript')
    )
      throw new Error('Built asset has an unexpected content type')
  }

  const health = await request('/api/health')
  if (
    health.headers.get('X-Big-Day-Planner-Revision') !==
      process.env.BIG_DAY_PLANNER_REVISION ||
    health.headers.get('Cache-Control') !== 'no-store'
  )
    throw new Error('Health revision/cache headers are incorrect')

  // Admin pages and uploads require Clerk sign-in.
  const guests = await request('/guests', 307)
  if (!guests.headers.get('Location')?.endsWith('/sign-in'))
    throw new Error('Signed-out admin request was not sent to sign-in')
  await request('/api/uploadthing?actionType=upload&slug=logoUploader', 403, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-uploadthing-package': '@uploadthing/react',
      'x-uploadthing-version': '7.7.4'
    },
    body: JSON.stringify({
      files: [{ name: 'a.png', size: 1, type: 'image/png', lastModified: 0 }],
      input: null
    })
  })
  // The old unauthenticated email relays must stay gone.
  await request('/api/rsvp-choice', 404, { method: 'POST', body: '{}' })

  // A guest page renders stored data through the runtime role.
  await sql`
    INSERT INTO guest (id, forename, surname, email, phone, address1, song, artist, "guestKey")
    VALUES (${guestId}, ${forename}, 'check', 'check@example.invalid', '0', 'check', '', '', ${guestId.slice(0, 20)})
  `
  const espoused = await sql`SELECT 1 FROM espoused LIMIT 1`
  const details = await sql`SELECT 1 FROM detail LIMIT 1`
  if (espoused.length && details.length) {
    const guestPage = await (await request(`/guest/${guestId}`)).text()
    if (!guestPage.includes(forename))
      throw new Error('Guest page did not render the stored guest')
  }
  await request('/guest/not-a-guest', 307)

  console.log(
    'Pages/assets, revision, admin and upload boundaries, guest rendering and runtime permissions passed'
  )
} finally {
  try {
    await sql`DELETE FROM guest WHERE id = ${guestId}`
  } finally {
    await sql.end()
  }
}
