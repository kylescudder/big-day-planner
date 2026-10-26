import '@tanstack/react-start/server-only'
import { initTRPC, TRPCError } from '@trpc/server'
import { createSchemaFactory } from 'drizzle-zod'
import superjson from 'superjson'
import { z } from 'zod'

import {
  createGuest,
  deleteColours,
  deleteGuest,
  deleteHotels,
  deleteImages,
  deleteTaxis,
  deleteTimings,
  getAddress,
  getAddressList,
  isAddressLookupEnabled,
  getColours,
  getDetails,
  getEspoused,
  getGuest,
  getGuestAndLinkedGuest,
  getGuestByKey,
  getGuests,
  getHotels,
  getImages,
  getMains,
  getPuddings,
  getStarters,
  getTaxis,
  getTimings,
  updateColours,
  updateDetails,
  updateEspoused,
  updateGuest,
  updateGuestMenu,
  updateGuestRSVP,
  updateGuestSong,
  updateHotels,
  updateImage,
  updateMains,
  updatePuddings,
  updateStarters,
  updateTaxis,
  updateTimings
} from '@/server/repository'
import {
  sendMenuChoiceEmail,
  sendRsvpEmails,
  sendSongChoiceEmail
} from '@/server/email'
import {
  colours,
  details,
  espoused as espousedTable,
  guests,
  hotels,
  images,
  mains,
  puddings,
  starters,
  taxis,
  timings,
  type Colour,
  type Detail,
  type Espoused,
  type Guest,
  type Hotel,
  type Images,
  type Main,
  type Pudding,
  type Starter,
  type Taxi,
  type Timing
} from './db/schema'

// userId comes only from Clerk's verified session, never from request input.
export type Context = { userId: string | null }

const t = initTRPC.context<Context>().create({ transformer: superjson })

const publicProcedure = t.procedure
// Admin. Every procedure below requires a signed-in Clerk user.
const adminProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.userId) throw new TRPCError({ code: 'UNAUTHORIZED' })
  return next()
})

// Admin input is checked against the table it is written to. Fields the
// database fills in or allows to be null may be omitted, as before; dates
// arriving as strings are coerced.
const { createInsertSchema } = createSchemaFactory({ coerce: { date: true } })
const row = <T>(schema: z.ZodType) => schema as z.ZodType<T>
const guestInput = row<Guest>(createInsertSchema(guests))
const detailInput = row<Detail>(createInsertSchema(details))
const espousedInput = row<Espoused>(createInsertSchema(espousedTable))
const imageInput = row<Images>(createInsertSchema(images))
const starterInput = row<Starter>(createInsertSchema(starters))
const mainInput = row<Main>(createInsertSchema(mains))
const puddingInput = row<Pudding>(createInsertSchema(puddings))
const timingInput = row<Timing>(createInsertSchema(timings))
const taxiInput = row<Taxi>(createInsertSchema(taxis))
const hotelInput = row<Hotel>(createInsertSchema(hotels))
const colourInput = row<Colour>(createInsertSchema(colours))

async function loadSharedRecords() {
  const [
    details,
    espoused,
    images,
    starters,
    mains,
    puddings,
    timings,
    taxis,
    hotels,
    colours
  ] = await Promise.all([
    getDetails(),
    getEspoused(),
    getImages(),
    getStarters(),
    getMains(),
    getPuddings(),
    getTimings(),
    getTaxis(),
    getHotels(),
    getColours()
  ])
  return {
    details,
    espoused,
    images: images ?? [],
    starters,
    mains,
    puddings,
    timings: timings ?? [],
    taxis: taxis ?? [],
    hotels: hotels ?? [],
    colours: colours ?? []
  }
}

// Guest responses. The guest page is reached by its unguessable ID; these
// update only the response fields and email the couple from stored records.
async function respondingGuest(id: string) {
  const [guest, espoused] = await Promise.all([getGuest(id), getEspoused()])
  if (!guest || !espoused) throw new Error('Guest not found')
  return { guest, espoused }
}

export const appRouter = t.router({
  session: publicProcedure.query(({ ctx }) => ({ userId: ctx.userId })),

  // Public pages
  home: publicProcedure.query(async () => ({
    images: (await getImages()) ?? []
  })),
  guestPage: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => ({
      guestData: await getGuestAndLinkedGuest(input.id),
      ...(await loadSharedRecords())
    })),
  /** Resolves a guest's invitation code to the guest page they can open. */
  guestByKey: publicProcedure
    .input(z.object({ guestKey: z.string().trim().toLowerCase().max(20) }))
    .mutation(async ({ input }) => {
      const guests = await getGuestByKey(input.guestKey)
      return guests?.[0] ? { id: guests[0].id } : null
    }),
  rsvp: publicProcedure
    .input(
      z.object({ id: z.string().uuid(), rsvpAnswer: z.boolean().nullable() })
    )
    .mutation(async ({ input }) => {
      await updateGuestRSVP({ ...input, rsvp: true })
      const { guest, espoused } = await respondingGuest(input.id)
      sendRsvpEmails(espoused, guest)
    }),
  songChoice: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        song: z.string().max(256),
        artist: z.string().max(256)
      })
    )
    .mutation(async ({ input }) => {
      await updateGuestSong(input)
      const { guest, espoused } = await respondingGuest(input.id)
      sendSongChoiceEmail(espoused, guest)
    }),
  menuChoice: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        starterId: z.string().uuid().nullable(),
        mainId: z.string().uuid().nullable(),
        puddingId: z.string().uuid().nullable(),
        dietaryRequirements: z.string().max(256).nullable()
      })
    )
    .mutation(async ({ input }) => {
      await updateGuestMenu(input)
      const [{ guest, espoused }, starters, mains, puddings] =
        await Promise.all([
          respondingGuest(input.id),
          getStarters(),
          getMains(),
          getPuddings()
        ])
      sendMenuChoiceEmail(espoused, guest, {
        starter:
          starters.find(({ id }) => id === guest.starterId)?.text ?? null,
        main: mains.find(({ id }) => id === guest.mainId)?.text ?? null,
        pudding: puddings.find(({ id }) => id === guest.puddingId)?.text ?? null
      })
    }),

  // Admin
  guestsPage: adminProcedure.query(async () => ({
    data: await getGuests(),
    ...(await loadSharedRecords())
  })),
  guest: t.router({
    get: adminProcedure
      .input(z.string().uuid())
      .query(async ({ input }) => (await getGuest(input)) ?? null),
    create: adminProcedure.input(guestInput).mutation(async ({ input }) => {
      await createGuest(input)
    }),
    update: adminProcedure.input(guestInput).mutation(async ({ input }) => {
      await updateGuest(input)
    }),
    delete: adminProcedure
      .input(z.string().uuid())
      .mutation(async ({ input }) => {
        await deleteGuest(input)
      })
  }),
  address: t.router({
    lookupEnabled: adminProcedure.query(() => isAddressLookupEnabled()),
    list: adminProcedure
      .input(z.string().max(16))
      .mutation(({ input }) => getAddressList(input)),
    get: adminProcedure
      .input(z.string().max(256))
      .mutation(({ input }) => getAddress(input))
  }),
  starters: adminProcedure
    .input(z.array(starterInput))
    .mutation(async ({ input }) => {
      await updateStarters(input)
    }),
  mains: adminProcedure
    .input(z.array(mainInput))
    .mutation(async ({ input }) => {
      await updateMains(input)
    }),
  puddings: adminProcedure
    .input(z.array(puddingInput))
    .mutation(async ({ input }) => {
      await updatePuddings(input)
    }),
  details: adminProcedure.input(detailInput).mutation(async ({ input }) => {
    await updateDetails(input)
  }),
  espoused: adminProcedure.input(espousedInput).mutation(async ({ input }) => {
    await updateEspoused(input)
  }),
  image: t.router({
    update: adminProcedure.input(imageInput).mutation(async ({ input }) => {
      await updateImage(input)
    }),
    delete: adminProcedure.input(imageInput).mutation(async ({ input }) => {
      await deleteImages(input)
    })
  }),
  timing: t.router({
    update: adminProcedure.input(timingInput).mutation(async ({ input }) => {
      await updateTimings(input)
    }),
    delete: adminProcedure.input(timingInput).mutation(async ({ input }) => {
      await deleteTimings(input)
    })
  }),
  taxi: t.router({
    update: adminProcedure.input(taxiInput).mutation(async ({ input }) => {
      await updateTaxis(input)
    }),
    delete: adminProcedure.input(taxiInput).mutation(async ({ input }) => {
      await deleteTaxis(input)
    })
  }),
  hotel: t.router({
    update: adminProcedure.input(hotelInput).mutation(async ({ input }) => {
      await updateHotels(input)
    }),
    delete: adminProcedure.input(hotelInput).mutation(async ({ input }) => {
      await deleteHotels(input)
    })
  }),
  colour: t.router({
    update: adminProcedure.input(colourInput).mutation(async ({ input }) => {
      await updateColours(input)
    }),
    delete: adminProcedure.input(colourInput).mutation(async ({ input }) => {
      await deleteColours(input)
    })
  })
})

export type AppRouter = typeof appRouter
