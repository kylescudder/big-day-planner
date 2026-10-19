import { createFileRoute } from '@tanstack/react-router'
import { sql } from 'drizzle-orm'

import { db } from '@/server/db'

export const Route = createFileRoute('/api/health')({
  server: {
    handlers: {
      GET: async () => {
        await db.execute(sql`SELECT id FROM guest LIMIT 0`)
        return Response.json(
          { ok: true },
          {
            headers: {
              'Cache-Control': 'no-store',
              'X-Big-Day-Planner-Revision':
                process.env.BIG_DAY_PLANNER_REVISION || 'development'
            }
          }
        )
      }
    }
  }
})
