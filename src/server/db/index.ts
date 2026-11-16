import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { databaseUrl } from './connection'
import * as schema from './schema'

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined
}

// postgres.js v4 retries a connection refused for too many connections (53300)
// until connect_timeout passes, so keep it short: pages fail in about 3 s
// instead of spinning while requests pile up.
const conn =
  globalForDb.conn ??
  postgres(databaseUrl(), { max: 4, idle_timeout: 20, connect_timeout: 2 })
if (process.env.NODE_ENV !== 'production') globalForDb.conn = conn

export const db = drizzle(conn, { schema })
