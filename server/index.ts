import * as Sentry from '@sentry/tanstackstart-react'
import { join, normalize } from 'node:path'
import postgres from 'postgres'

import { SENTRY_DSN } from '../src/lib/sentry'
import { databaseUrl } from '../src/server/db/connection'

const revision = process.env.BIG_DAY_PLANNER_REVISION || 'development'

Sentry.init({
  dsn: SENTRY_DSN,
  release: revision,
  tracesSampleRate: 1,
  enabled: process.env.NODE_ENV === 'production'
})

const clientDirectory = join(import.meta.dir, '../dist/client')
const serverEntry = '../dist/server/server.js'
const { default: app } = (await import(serverEntry)) as {
  default: { fetch: (request: Request) => Response | Promise<Response> }
}

// Fail before accepting traffic if the database or migrations are unavailable.
const sql = postgres(databaseUrl(), { max: 1 })
await sql`SELECT id FROM guest LIMIT 0`
await sql.end()

async function staticFile(pathname: string) {
  const path = normalize(join(clientDirectory, decodeURIComponent(pathname)))
  if (!path.startsWith(clientDirectory + '/')) return null
  const file = Bun.file(path)
  if (!(await file.exists())) return null
  // Vite fingerprints everything under /assets/, so those can be cached forever.
  return new Response(file, {
    headers: {
      'Cache-Control': pathname.startsWith('/assets/')
        ? 'public, max-age=31536000, immutable'
        : 'public, max-age=3600'
    }
  })
}

const server = Bun.serve({
  port: Number(process.env.PORT || 3000),
  async fetch(request) {
    const { pathname } = new URL(request.url)
    const response =
      (request.method === 'GET' &&
        pathname !== '/' &&
        (await staticFile(pathname))) ||
      (await app.fetch(request))
    response.headers.set('X-Big-Day-Planner-Revision', revision)
    return response
  }
})

console.log(`Big Day Planner ${revision} listening on ${server.port}`)
