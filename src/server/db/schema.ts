import { uuidv4 } from '@/lib/utils'
import { sql } from 'drizzle-orm'
import {
  pgTableCreator,
  timestamp,
  varchar,
  boolean,
  uuid
} from 'drizzle-orm/pg-core'

export const createTable = pgTableCreator((name) => `${name}`)

export const guests = createTable('guest', {
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
  song: varchar('song').notNull(),
  artist: varchar('artist').notNull(),
  rsvp: boolean('rsvp'),
  rsvpAnswer: boolean('rsvp_answer'),
  parentId: uuid('parentId'),
  dietaryRequirements: varchar('dietaryRequirements', { length: 256 }),
  guestKey: varchar('guestKey', { length: 20 }).notNull(),
  createdAt: timestamp('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updated_at')
})
export type Guest = typeof guests.$inferSelect

export const details = createTable('detail', {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  startDateTime: timestamp('start_date_time'),
  endDateTime: timestamp('end_date_time'),
  address1: varchar('address1', { length: 256 }).notNull(),
  address2: varchar('address2', { length: 256 }),
  address3: varchar('address3', { length: 256 }),
  town: varchar('town').notNull(),
  county: varchar('county').notNull(),
  postcode: varchar('postcode').notNull(),
  detailsTextSubheader: varchar('details_text_subheader', { length: 256 }),
  detailsText: varchar('details_text', { length: 1024 }),
  adultsOnlyText: varchar('adults_only_text', { length: 256 }),
  dresscode: varchar('dresscode', { length: 256 }),
  registryMessage: varchar('registryMessage', { length: 500 }),
  songRequest: boolean('song_request'),
  rsvpDeadlineDateTime: timestamp('rsvp_deadline_date_time'),
  menuDeadlineDateTime: timestamp('menu_deadline_date_time')
})
export type Detail = typeof details.$inferSelect

export const espoused = createTable('espoused', {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  groom: varchar('groom', { length: 256 }).notNull(),
  bride: varchar('bride', { length: 256 }).notNull(),
  groomEmail: varchar('groom_email', { length: 256 }).notNull(),
  brideEmail: varchar('bride_email', { length: 256 }).notNull()
})
export type Espoused = typeof espoused.$inferSelect

export const images = createTable('image', {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  type: varchar('type', { length: 256 }).notNull(),
  key: varchar('key', { length: 256 }).notNull()
})
export type Images = typeof images.$inferSelect

export const starters = createTable('starter', {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  text: varchar('text', { length: 256 })
})

export type Starter = typeof starters.$inferSelect

export const mains = createTable('main', {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  text: varchar('text', { length: 256 })
})

export type Main = typeof mains.$inferSelect

export const puddings = createTable('pudding', {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  text: varchar('text', { length: 256 })
})

export type Pudding = typeof puddings.$inferSelect

export const timings = createTable('timing', {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  time: timestamp('time').notNull(),
  event: varchar('event', { length: 256 }),
  altText: varchar('alt_text', { length: 256 }),
  imageUrl: varchar('image_url', { length: 256 })
})

export type Timing = typeof timings.$inferSelect

export const taxis = createTable('taxi', {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  name: varchar('name').notNull(),
  description: varchar('description', { length: 256 }),
  phone: varchar('phone').notNull()
})

export type Taxi = typeof taxis.$inferSelect

export const hotels = createTable('hotels', {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  name: varchar('name').notNull(),
  url: varchar('url').notNull()
})

export type Hotel = typeof hotels.$inferSelect

export const colours = createTable('colours', {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  hex: varchar('hex').notNull()
})

export type Colour = typeof colours.$inferSelect
