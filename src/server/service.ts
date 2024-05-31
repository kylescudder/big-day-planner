'use server'

import {
  deleteGuest,
  getGuests,
  getAddressList,
  getAddress,
  createGuest,
  getGuest,
  getGuestAndLinkedGuest,
  updateGuestSong,
  getStarters,
  getMains,
  getPuddings,
  updateGuestMenu,
  updateGuestRSVP
} from '@/server/repository'
import { auth } from '@clerk/nextjs/server'
import { type Guest } from './db/schema'

export async function getGuestRecords() {
  const user = auth()

  if (!user.userId) throw new Error('Unauthorized')

  return await getGuests()
}

export async function getGuestAndLinkedGuestRecord(id: string) {
  return await getGuestAndLinkedGuest(id)
}

export async function getGuestRecord(id: string) {
  const user = auth()

  if (!user.userId) throw new Error('Unauthorized')

  return await getGuest(id)
}

export async function createGuestRecord(guest: Guest) {
  const user = auth()

  if (!user.userId) throw new Error('Unauthorized')

  return await createGuest(guest)
}

export async function updateRSVP(guest: Guest) {
  return await updateGuestRSVP(guest)
}

export async function updateSongChoice(guest: Guest) {
  return await updateGuestSong(guest)
}

export async function updateMenuChoice(guest: Guest) {
  console.log('updateMenuChoice', guest)
  return await updateGuestMenu(guest)
}

export async function deleteGuestRecord(id: string) {
  const user = auth()

  if (!user.userId) throw new Error('Unauthorized')

  await deleteGuest(id)

  // analyticsServerClient.capture({
  //   distinctId: user.userId,
  //   event: "delete image",
  //   properties: {
  //     imageId: id,
  //   },
  // });
}

export async function getAddressListRecords(postcode: string) {
  const user = auth()

  if (!user.userId) throw new Error('Unauthorized')

  return await getAddressList(postcode)
}

export async function getAddressRecords(addressUrl: string) {
  const user = auth()

  if (!user.userId) throw new Error('Unauthorized')

  return await getAddress(addressUrl)
}

export async function getStarterRecords() {
  return await getStarters()
}

export async function getMainRecords() {
  return await getMains()
}

export async function getPuddingRecords() {
  return await getPuddings()
}
