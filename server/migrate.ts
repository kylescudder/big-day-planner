import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import { databaseUrl } from '../src/server/db/connection'

// Runs with the owner role only; the app runtime role cannot create tables.
// The journal lives in its own schema, where the runtime role has no access.
const sql = postgres(databaseUrl(), { max: 1, onnotice: () => {} })
try {
  // Earlier releases kept the journal in public, where the runtime role's
  // default grants reach it. Move it once, keeping its history; recreating it
  // would rerun the baseline against existing tables.
  await sql`CREATE SCHEMA IF NOT EXISTS drizzle`
  await sql`DO $$ BEGIN
    IF to_regclass('public.__drizzle_migrations') IS NOT NULL
      AND to_regclass('drizzle.__drizzle_migrations') IS NULL THEN
      ALTER TABLE public.__drizzle_migrations SET SCHEMA drizzle;
    END IF;
  END $$`
  // Redeploying an older release recreates an empty journal in public before
  // its migration fails; drop that leftover so the runtime role can't see it.
  // The table check is nested: PL/pgSQL plans a whole IF condition at once,
  // and the SELECT can't be planned when the table doesn't exist.
  await sql`DO $$ BEGIN
    IF to_regclass('public.__drizzle_migrations') IS NOT NULL THEN
      IF NOT EXISTS (SELECT 1 FROM public.__drizzle_migrations) THEN
        DROP TABLE public.__drizzle_migrations;
      END IF;
    END IF;
  END $$`
  await migrate(drizzle(sql), {
    migrationsFolder: new URL('../drizzle', import.meta.url).pathname,
    migrationsSchema: 'drizzle',
    migrationsTable: '__drizzle_migrations'
  })
  console.log('Big Day Planner schema is ready')
} finally {
  await sql.end()
}
