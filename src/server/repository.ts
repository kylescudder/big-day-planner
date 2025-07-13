import 'server-only'
import { db } from '@/server/db'
import {
  Colour,
  colours,
  type Detail,
  details,
  Espoused,
  espoused,
  type Guest,
  guests,
  Hotel,
  hotels,
  images,
  Images,
  type Main,
  mains,
  type Pudding,
  puddings,
  type Starter,
  starters,
  Taxi,
  taxis,
  type Timing,
  timings
} from './db/schema'
import { asc, eq } from 'drizzle-orm'
import { env } from '@/env'
import { type AddressData, type Suggestions } from '@/types/address'

export async function getGuests(): Promise<Guest[]> {
  return await db.query.guests.findMany({})
}

export async function getGuestAndLinkedGuest(id: string) {
  return await db.query.guests.findMany({
    where(fields, operators) {
      return operators.or(eq(fields.id, id), eq(fields.parentId, id))
    },
    orderBy: [asc(guests.createdAt)]
  })
}

export async function getGuest(id: string) {
  return await db.query.guests.findFirst({
    where(fields, operators) {
      return operators.and(eq(fields.id, id))
    }
  })
}

export async function updateGuestRSVP(guest: Guest) {
  await db
    .update(guests)
    .set({ rsvp: guest.rsvp, rsvpAnswer: guest.rsvpAnswer })
    .where(eq(guests.id, guest.id))
}

export async function createGuest(guest: Guest) {
  return await db.insert(guests).values(guest).execute()
}

export async function updateGuest(guest: Guest) {
  await db
    .update(guests)
    .set({
      forename: guest.forename,
      surname: guest.surname,
      email: guest.email,
      phone: guest.phone,
      address1: guest.address1,
      address2: guest.address2,
      address3: guest.address3,
      town: guest.town,
      county: guest.county,
      postcode: guest.postcode,
      song: guest.song,
      artist: guest.artist,
      starterId: guest.starterId,
      mainId: guest.mainId,
      puddingId: guest.puddingId,
      dietaryRequirements: guest.dietaryRequirements,
      guestKey: guest.guestKey
    })
    .where(eq(guests.id, guest.id))
}

export async function updateGuestSong(guest: Guest) {
  await db
    .update(guests)
    .set({ song: guest.song, artist: guest.artist })
    .where(eq(guests.id, guest.id))
}

export async function updateGuestMenu(guest: Guest) {
  await db
    .update(guests)
    .set({
      starterId: guest.starterId,
      mainId: guest.mainId,
      puddingId: guest.puddingId,
      dietaryRequirements: guest.dietaryRequirements
    })
    .where(eq(guests.id, guest.id))
}

export async function deleteGuest(id: string) {
  await db.delete(guests).where(eq(guests.id, id))
}

export const getAddressList = async (
  postcode: string
): Promise<Suggestions> => {
  const response = await fetch(
    `${env.GETADDRESS_URL}/autocomplete/${postcode}?api-key=${env.GETADDRESS_API_KEY}`
  )
  return (await response.json()) as Suggestions
}

export const getAddress = async (addressUrl: string) => {
  const response = await fetch(
    `${env.GETADDRESS_URL}/${addressUrl}?api-key=${env.GETADDRESS_API_KEY}`
  )
  return (await response.json()) as AddressData
}

export const getStarters = async (): Promise<Starter[]> => {
  return await db.query.starters.findMany({})
}

export async function updateStarters(starterArray: Starter[]) {
  const updates = starterArray.map((starter) => ({
    id: starter.id,
    text: starter.text
  }))

  await db.delete(starters)

  await Promise.all(
    updates.map((update) =>
      db
        .insert(starters)
        .values(update)
        .onConflictDoUpdate({
          target: [starters.id],
          set: {
            text: update.text
          }
        })
    )
  )
}

export const getMains = async (): Promise<Main[]> => {
  return await db.query.mains.findMany({})
}

export async function updateMains(mainArray: Main[]) {
  const updates = mainArray.map((main) => ({
    id: main.id,
    text: main.text
  }))

  await db.delete(mains)

  await Promise.all(
    updates.map((update) =>
      db
        .insert(mains)
        .values(update)
        .onConflictDoUpdate({
          target: [mains.id],
          set: {
            text: update.text
          }
        })
    )
  )
}

export const getPuddings = async (): Promise<Pudding[]> => {
  return await db.query.puddings.findMany({})
}

export async function updatePuddings(puddingArray: Pudding[]) {
  const updates = puddingArray.map((pudding) => ({
    id: pudding.id,
    text: pudding.text
  }))

  await db.delete(puddings)

  await Promise.all(
    updates.map((update) =>
      db
        .insert(puddings)
        .values(update)
        .onConflictDoUpdate({
          target: [puddings.id],
          set: {
            text: update.text
          }
        })
    )
  )
}

export const getDetails = async (): Promise<Detail | null> => {
  const result = await db.query.details.findFirst({})
  if (result === undefined) {
    return null
  } else {
    return result
  }
}

export async function updateDetails(detail: Detail) {
  await db
    .insert(details)
    .values(detail)
    .onConflictDoUpdate({
      target: [details.id],
      set: {
        address1: detail.address1,
        address2: detail.address2,
        address3: detail.address3,
        town: detail.town,
        county: detail.county,
        postcode: detail.postcode,
        detailsTextSubheader: detail.detailsTextSubheader,
        detailsText: detail.detailsText,
        adultsOnlyText: detail.adultsOnlyText,
        dresscode: detail.dresscode,
        registryMessage: detail.registryMessage,
        startDateTime: detail.startDateTime,
        endDateTime: detail.endDateTime
      }
    })
}

export const getEspoused = async (): Promise<Espoused | null> => {
  const result = await db.query.espoused.findFirst({})
  if (result === undefined) {
    return null
  }
  return result
}

export async function updateEspoused(espousedData: Espoused) {
  await db
    .insert(espoused)
    .values(espousedData)
    .onConflictDoUpdate({
      target: [espoused.id],
      set: {
        groom: espousedData.groom,
        bride: espousedData.bride,
        groomEmail: espousedData.groomEmail,
        brideEmail: espousedData.brideEmail
      }
    })
}

export const getImages = async (): Promise<Images[] | null> => {
  const result = await db.query.images.findMany({})
  if (result === undefined) {
    return null
  }
  return result
}

export async function updateImage(imageData: Images) {
  try {
    await db
      .insert(images)
      .values(imageData)
      .onConflictDoUpdate({
        target: [images.type],
        set: {
          type: imageData.type,
          key: imageData.key
        }
      })
  } catch (e) {
    console.error(e)
  }
}

export async function deleteImages(image: Images) {
  await db.delete(images).where(eq(images.id, image.id))
}

export const getTimings = async (): Promise<Timing[] | null> => {
  const result = await db.query.timings.findMany({})
  if (result === undefined) {
    return null
  }
  return result
}

export async function updateTimings(timingData: Timing) {
  await db
    .insert(timings)
    .values(timingData)
    .onConflictDoUpdate({
      target: [timings.id],
      set: {
        time: timingData.time,
        event: timingData.event
      }
    })
}

export async function deleteTimings(timing: Timing) {
  await db.delete(timings).where(eq(timings.id, timing.id))
}

export const getTaxis = async (): Promise<Taxi[] | null> => {
  const result = await db.query.taxis.findMany({})
  if (result === undefined) {
    return null
  }
  return result
}

export async function updateTaxis(taxiData: Taxi) {
  await db
    .insert(taxis)
    .values(taxiData)
    .onConflictDoUpdate({
      target: [taxis.id],
      set: {
        name: taxiData.name,
        phone: taxiData.phone
      }
    })
}

export async function deleteTaxis(taxi: Taxi) {
  await db.delete(taxis).where(eq(taxis.id, taxi.id))
}

export const getHotels = async (): Promise<Hotel[] | null> => {
  const result = await db.query.hotels.findMany({})
  if (result === undefined) {
    return null
  }
  return result
}

export async function updateHotels(hotelData: Hotel) {
  await db
    .insert(hotels)
    .values(hotelData)
    .onConflictDoUpdate({
      target: [hotels.id],
      set: {
        name: hotelData.name,
        url: hotelData.url
      }
    })
}

export async function deleteHotels(hotel: Hotel) {
  await db.delete(hotels).where(eq(hotels.id, hotel.id))
}

export const getColours = async (): Promise<Colour[] | null> => {
  const result = await db.query.colours.findMany({})
  if (result === undefined) {
    return null
  }
  return result
}

export async function updateColours(colourData: Colour) {
  await db
    .insert(colours)
    .values(colourData)
    .onConflictDoUpdate({
      target: [colours.id],
      set: {
        hex: colourData.hex
      }
    })
}

export async function deleteColours(colour: Colour) {
  await db.delete(colours).where(eq(colours.id, colour.id))
}

export const getGuestByKey = async (
  guestKey: string
): Promise<Guest[] | null> => {
  const result = await db.query.guests.findMany({
    where(fields, operators) {
      return operators.eq(fields.guestKey, guestKey)
    }
  })
  if (result.length == 0) {
    return null
  }
  return result
}
