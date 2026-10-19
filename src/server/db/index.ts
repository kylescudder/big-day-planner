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

const conn =
  globalForDb.conn ??
  postgres(databaseUrl(), { max: 4, idle_timeout: 20, connect_timeout: 10 })
if (process.env.NODE_ENV !== 'production') globalForDb.conn = conn

export const db = drizzle(conn, { schema })
