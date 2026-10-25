import { sql } from 'drizzle-orm'

import { db } from '@/server/db'

const revision = process.env.BIG_DAY_PLANNER_REVISION || 'development'

export async function healthResponse() {
  const headers = { 'Cache-Control': 'no-store' }
  try {
    // Fail before the server's idle timeout drops the request.
    await Promise.race([
      db.execute(sql`SELECT id FROM guest LIMIT 0`),
      Bun.sleep(3000).then(() => Promise.reject(new Error('timeout')))
    ])
    return Response.json({ ok: true, revision }, { headers })
  } catch {
    return Response.json({ ok: false }, { status: 503, headers })
  }
}
