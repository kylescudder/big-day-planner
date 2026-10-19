import { auth } from '@clerk/tanstack-react-start/server'
import { createServerFn } from '@tanstack/react-start'
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
import type {
  Colour,
  Detail,
  Espoused,
  Guest,
  Hotel,
  Images,
  Main,
  Pudding,
  Starter,
  Taxi,
  Timing
} from './db/schema'

async function requireUser() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  return userId
}

/** Validates the shape of admin input; callers are already authenticated. */
const input =
  <T>() =>
  (data: T) =>
    data

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

// Public pages

export const getHomePageData = createServerFn({ method: 'GET' }).handler(
  async () => ({ images: (await getImages()) ?? [] })
)

export const getGuestPageData = createServerFn({ method: 'GET' })
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => ({
    guestData: await getGuestAndLinkedGuest(data.id),
    ...(await loadSharedRecords())
  }))

/** Resolves a guest's invitation code to the guest page they can open. */
export const getGuestByKeyRecord = createServerFn({ method: 'POST' })
  .validator(z.object({ guestKey: z.string().trim().toLowerCase().max(20) }))
  .handler(async ({ data }) => {
    const guests = await getGuestByKey(data.guestKey)
    return guests?.[0] ? { id: guests[0].id } : null
  })

// Guest responses. The guest page is reached by its unguessable ID; these
// update only the response fields and email the couple from stored records.

async function respondingGuest(id: string) {
  const [guest, espoused] = await Promise.all([getGuest(id), getEspoused()])
  if (!guest || !espoused) throw new Error('Guest not found')
  return { guest, espoused }
}

export const updateRSVP = createServerFn({ method: 'POST' })
  .validator(
    z.object({ id: z.string().uuid(), rsvpAnswer: z.boolean().nullable() })
  )
  .handler(async ({ data }) => {
    await updateGuestRSVP({ ...data, rsvp: true })
    const { guest, espoused } = await respondingGuest(data.id)
    sendRsvpEmails(espoused, guest)
  })

export const updateSongChoice = createServerFn({ method: 'POST' })
  .validator(
    z.object({
      id: z.string().uuid(),
      song: z.string().max(256),
      artist: z.string().max(256)
    })
  )
  .handler(async ({ data }) => {
    await updateGuestSong(data)
    const { guest, espoused } = await respondingGuest(data.id)
    sendSongChoiceEmail(espoused, guest)
  })

export const updateMenuChoice = createServerFn({ method: 'POST' })
  .validator(
    z.object({
      id: z.string().uuid(),
      starterId: z.string().uuid().nullable(),
      mainId: z.string().uuid().nullable(),
      puddingId: z.string().uuid().nullable(),
      dietaryRequirements: z.string().max(256).nullable()
    })
  )
  .handler(async ({ data }) => {
    await updateGuestMenu(data)
    const [{ guest, espoused }, starters, mains, puddings] = await Promise.all([
      respondingGuest(data.id),
      getStarters(),
      getMains(),
      getPuddings()
    ])
    sendMenuChoiceEmail(espoused, guest, {
      starter: starters.find(({ id }) => id === guest.starterId)?.text ?? null,
      main: mains.find(({ id }) => id === guest.mainId)?.text ?? null,
      pudding: puddings.find(({ id }) => id === guest.puddingId)?.text ?? null
    })
  })

// Admin. Every function below requires a signed-in Clerk user.

export const getGuestsPageData = createServerFn({ method: 'GET' }).handler(
  async () => {
    await requireUser()
    return { data: await getGuests(), ...(await loadSharedRecords()) }
  }
)

export const getGuestRecord = createServerFn({ method: 'GET' })
  .validator(z.string().uuid())
  .handler(async ({ data }) => {
    await requireUser()
    return (await getGuest(data)) ?? null
  })

export const createGuestRecord = createServerFn({ method: 'POST' })
  .validator(input<Guest>())
  .handler(async ({ data }) => {
    await requireUser()
    await createGuest(data)
  })

export const updateGuestRecord = createServerFn({ method: 'POST' })
  .validator(input<Guest>())
  .handler(async ({ data }) => {
    await requireUser()
    await updateGuest(data)
  })

export const deleteGuestRecord = createServerFn({ method: 'POST' })
  .validator(z.string().uuid())
  .handler(async ({ data }) => {
    await requireUser()
    await deleteGuest(data)
  })

export const getAddressListRecords = createServerFn({ method: 'POST' })
  .validator(z.string().max(16))
  .handler(async ({ data }) => {
    await requireUser()
    return await getAddressList(data)
  })

export const getAddressRecords = createServerFn({ method: 'POST' })
  .validator(z.string().max(256))
  .handler(async ({ data }) => {
    await requireUser()
    return await getAddress(data)
  })

export const updateStarterRecords = createServerFn({ method: 'POST' })
  .validator(input<Starter[]>())
  .handler(async ({ data }) => {
    await requireUser()
    await updateStarters(data)
  })

export const updateMainRecords = createServerFn({ method: 'POST' })
  .validator(input<Main[]>())
  .handler(async ({ data }) => {
    await requireUser()
    await updateMains(data)
  })

export const updatePuddingRecords = createServerFn({ method: 'POST' })
  .validator(input<Pudding[]>())
  .handler(async ({ data }) => {
    await requireUser()
    await updatePuddings(data)
  })

export const updateDetailRecord = createServerFn({ method: 'POST' })
  .validator(input<Detail>())
  .handler(async ({ data }) => {
    await requireUser()
    await updateDetails(data)
  })

export const updateEspousedRecord = createServerFn({ method: 'POST' })
  .validator(input<Espoused>())
  .handler(async ({ data }) => {
    await requireUser()
    await updateEspoused(data)
  })

export const updateImageRecord = createServerFn({ method: 'POST' })
  .validator(input<Images>())
  .handler(async ({ data }) => {
    await requireUser()
    await updateImage(data)
  })

export const deleteImageRecord = createServerFn({ method: 'POST' })
  .validator(input<Images>())
  .handler(async ({ data }) => {
    await requireUser()
    await deleteImages(data)
  })

export const updateTimingRecord = createServerFn({ method: 'POST' })
  .validator(input<Timing>())
  .handler(async ({ data }) => {
    await requireUser()
    await updateTimings(data)
  })

export const deleteTimingRecord = createServerFn({ method: 'POST' })
  .validator(input<Timing>())
  .handler(async ({ data }) => {
    await requireUser()
    await deleteTimings(data)
  })

export const updateTaxiRecord = createServerFn({ method: 'POST' })
  .validator(input<Taxi>())
  .handler(async ({ data }) => {
    await requireUser()
    await updateTaxis(data)
  })

export const deleteTaxiRecord = createServerFn({ method: 'POST' })
  .validator(input<Taxi>())
  .handler(async ({ data }) => {
    await requireUser()
    await deleteTaxis(data)
  })

export const updateHotelRecord = createServerFn({ method: 'POST' })
  .validator(input<Hotel>())
  .handler(async ({ data }) => {
    await requireUser()
    await updateHotels(data)
  })

export const deleteHotelRecord = createServerFn({ method: 'POST' })
  .validator(input<Hotel>())
  .handler(async ({ data }) => {
    await requireUser()
    await deleteHotels(data)
  })

export const updateColourRecord = createServerFn({ method: 'POST' })
  .validator(input<Colour>())
  .handler(async ({ data }) => {
    await requireUser()
    await updateColours(data)
  })

export const deleteColourRecord = createServerFn({ method: 'POST' })
  .validator(input<Colour>())
  .handler(async ({ data }) => {
    await requireUser()
    await deleteColours(data)
  })
