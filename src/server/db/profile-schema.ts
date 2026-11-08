import { customType, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { authUser } from './auth-schema'

const binary = customType<{ data: Buffer }>({ dataType: () => 'bytea' })

// The planner's profile photo, kept as a small processed JPEG in the app's own
// database (covered by its encrypted backups). UploadThing is for wedding
// images only; profile photos never leave the server.
export const userProfile = pgTable('user_profile', {
  userId: text('user_id')
    .primaryKey()
    .references(() => authUser.id, { onDelete: 'cascade' }),
  avatar: binary('avatar'),
  avatarVersion: text('avatar_version'),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
})
