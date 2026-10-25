import { sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { databaseUrl } from '@/server/db/connection'

const revision = process.env.BIG_DAY_PLANNER_REVISION || 'development'
let healthProbe: Promise<void> | undefined

async function probeDatabase() {
  // Own the connection so a stalled probe can be retired without touching app SQL.
  const client = postgres(databaseUrl(), {
    max: 1,
    connect_timeout: 3,
    connection: { statement_timeout: 3000 }
  })
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    await Promise.race([
      drizzle(client).execute(sql`SELECT id FROM guest LIMIT 0`),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error('timeout')), 3000)
      })
    ])
  } finally {
    clearTimeout(timer)
    await client.end({ timeout: 0 })
  }
}

export async function healthResponse() {
  const headers = { 'Cache-Control': 'no-store' }
  healthProbe ??= probeDatabase().finally(() => {
    healthProbe = undefined
  })
  try {
    await healthProbe
    return Response.json({ ok: true, revision }, { headers })
  } catch {
    return Response.json({ ok: false }, { status: 503, headers })
  }
}
