import 'server-only'
import { db } from '@/server/db/index'
import { type Guest, guests } from './db/schema'
import { eq } from 'drizzle-orm'
import { env } from '@/env'
import { type AddressData, type Suggestions } from '@/types/address'

export async function getGuests() {
  return await db.query.guests.findMany({})
}

export async function createGuest(guest: Guest): Promise<Guest[]> {
  return await db.insert(guests).values(guest).execute()
}

export async function deleteGuest(id: string): Promise<void> {
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

export const getAddress = async (addressUrl: string): Promise<AddressData> => {
  const response = await fetch(
    `${env.GETADDRESS_URL}/${addressUrl}?api-key=${env.GETADDRESS_API_KEY}`
  )
  const data = (await response.json()) as AddressData
  return data
}

export async function getRsvp(id: string): Promise<string> {
  return await db.query.guests.findFirst({
    with: {
      id: id
    },
    columns: {
      rsvp: true
    }
  })
}
