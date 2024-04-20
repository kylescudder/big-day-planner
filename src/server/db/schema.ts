import { uuidv4 } from '@/lib/utils'
import { sql } from 'drizzle-orm'
import {
  index,
  pgTableCreator,
  timestamp,
  varchar,
  boolean,
  serial,
  uuid
} from 'drizzle-orm/pg-core'

export const createTable = pgTableCreator((name) => `${name}`)

export const guests = createTable(
  'guest',
  {
    id: uuid('id')
      .primaryKey()
      .$defaultFn(() => uuidv4()),
    forename: varchar('forename').notNull(),
    surname: varchar('surname').notNull(),
    email: varchar('email').notNull(),
    phone: varchar('phone').notNull(),
    address1: varchar('address1').notNull(),
    address2: varchar('address2', { length: 256 }),
    address3: varchar('address3', { length: 256 }),
    town: varchar('town'),
    county: varchar('county'),
    postcode: varchar('postcode'),
    starterId: uuid('starterId').references(() => starters.id),
    mainId: uuid('mainId').references(() => mains.id),
    puddingId: uuid('puddingId').references(() => puddings.id),
    songChoice: varchar('song_choice').notNull(),
    rsvp: boolean('rsvp'),
    rsvpAnswer: boolean('rsvp_answer'),
    partnerId: serial('partnerId'),
    createdAt: timestamp('created_at')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at')
  },
  (example) => ({
    idIndex: index('guest_id_idx').on(example.id),
    forenameIndex: index('guest_forename_idx').on(example.forename),
    emailIndex: index('guest_email_idx').on(example.email)
  })
)
export type Guest = typeof guests.$inferSelect

export const starters = createTable(
  'starter',
  {
    id: uuid('id')
      .primaryKey()
      .$defaultFn(() => uuidv4()),
    text: varchar('text', { length: 256 })
  },
  (example) => ({
    idIndex: index('starter_id_idx').on(example.id),
    textIndex: index('starter_text_idx').on(example.text)
  })
)

export type Starter = typeof starters.$inferSelect

export const mains = createTable(
  'main',
  {
    id: uuid('id')
      .primaryKey()
      .$defaultFn(() => uuidv4()),
    text: varchar('text', { length: 256 })
  },
  (example) => ({
    idIndex: index('main_id_idx').on(example.id),
    textIndex: index('main_text_idx').on(example.text)
  })
)

export type Main = typeof mains.$inferSelect

export const puddings = createTable(
  'pudding',
  {
    id: uuid('id')
      .primaryKey()
      .$defaultFn(() => uuidv4()),
    text: varchar('text', { length: 256 })
  },
  (example) => ({
    idIndex: index('pudding_id_idx').on(example.id),
    textIndex: index('pudding_text_idx').on(example.text)
  })
)

export type Pudding = typeof puddings.$inferSelect
