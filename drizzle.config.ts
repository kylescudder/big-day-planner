import { defineConfig } from 'drizzle-kit'
import { databaseUrl } from './src/server/db/connection'

export default defineConfig({
  out: './drizzle',
  dialect: 'postgresql',
  schema: './src/server/db/schema.ts',
  migrations: {
    schema: 'drizzle',
    table: '__drizzle_migrations'
  },
  dbCredentials: {
    url: databaseUrl()
  }
})
