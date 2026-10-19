import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import { databaseUrl } from '../src/server/db/connection'

// Runs with the owner role only; the app runtime role cannot create tables.
const sql = postgres(databaseUrl(), { max: 1, onnotice: () => {} })
try {
  await migrate(drizzle(sql), {
    migrationsFolder: new URL('../drizzle', import.meta.url).pathname,
    migrationsSchema: 'public',
    migrationsTable: '__drizzle_migrations'
  })
  console.log('Big Day Planner schema is ready')
} finally {
  await sql.end()
}
