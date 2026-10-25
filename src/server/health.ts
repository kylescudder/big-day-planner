import { sql } from 'drizzle-orm'

import { db } from '@/server/db'

const revision = process.env.BIG_DAY_PLANNER_REVISION || 'development'
let healthProbe: Promise<unknown> | undefined

export async function healthResponse() {
  const headers = { 'Cache-Control': 'no-store' }
  healthProbe ??= db
    .transaction(async (probe) => {
      await probe.execute(sql`SET LOCAL statement_timeout = '3s'`)
      await probe.execute(sql`SELECT id FROM guest LIMIT 0`)
    })
    .finally(() => {
      healthProbe = undefined
    })
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    // Fail before the server's idle timeout drops the request.
    await Promise.race([
      healthProbe,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error('timeout')), 3000)
      })
    ])
    return Response.json({ ok: true, revision }, { headers })
  } catch {
    return Response.json({ ok: false }, { status: 503, headers })
  } finally {
    clearTimeout(timer)
  }
}
