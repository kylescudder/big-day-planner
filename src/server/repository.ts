import 'server-only'
import { db } from '@/server/db/index'
import {
  type Guest,
  guests,
  type Starter,
  type Main,
  type Pudding,
  type Detail,
  details,
  Espoused,
  espoused
} from './db/schema'
import { asc, eq } from 'drizzle-orm'
import { env } from '@/env'
import { type AddressData, type Suggestions } from '@/types/address'
import { type Image } from '@/types/image'

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
      puddingId: guest.puddingId
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
  const data = (await response.json()) as Suggestions
  return data
}

export const getAddress = async (addressUrl: string) => {
  const response = await fetch(
    `${env.GETADDRESS_URL}/${addressUrl}?api-key=${env.GETADDRESS_API_KEY}`
  )
  const data = (await response.json()) as AddressData
  return data
}

export const getStarters = async (): Promise<Starter[]> => {
  return await db.query.starters.findMany({})
}

export const getMains = async (): Promise<Main[]> => {
  return await db.query.mains.findMany({})
}

export const getPuddings = async (): Promise<Pudding[]> => {
  return await db.query.puddings.findMany({})
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
        adultsOnly: detail.adultsOnly,
        adultsOnlyText: detail.adultsOnlyText,
        dresscode: detail.dresscode
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

export async function getImages() {
  const images: Image = {
    logo: 'https://ufts.io/a/big-day-planner/szhMDBp4V1z7JDW9rmgRCUEKneH65FxYBOzG2gZQ9PaVlWwb'
  }

  return images
}
