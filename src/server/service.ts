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
  updateGuestRSVP,
  getDetails,
  updateDetails,
  updateEspoused,
  getEspoused,
  getImages,
  updateImage,
  getTimings,
  updateTimings,
  deleteTimings,
  deleteImages,
  updateStarters,
  updateMains,
  updatePuddings
} from '@/server/repository'
import { auth } from '@clerk/nextjs/server'
import {
  Detail,
  Espoused,
  Images,
  Main,
  Pudding,
  Starter,
  Timing,
  type Guest
} from './db/schema'

export async function getGuestRecords() {
  const user = await auth()

  if (!user.userId) throw new Error('Unauthorized')

  return await getGuests()
}

export async function getGuestAndLinkedGuestRecord(id: string) {
  return await getGuestAndLinkedGuest(id)
}

export async function getGuestRecord(id: string) {
  const user = await auth()

  if (!user.userId) throw new Error('Unauthorized')

  return await getGuest(id)
}

export async function createGuestRecord(guest: Guest) {
  const user = await auth()

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
  return await updateGuestMenu(guest)
}

export async function deleteGuestRecord(id: string) {
  const user = await auth()

  if (!user.userId) throw new Error('Unauthorized')

  await deleteGuest(id)
}

export async function getAddressListRecords(postcode: string) {
  const user = await auth()

  if (!user.userId) throw new Error('Unauthorized')

  return await getAddressList(postcode)
}

export async function getAddressRecords(addressUrl: string) {
  const user = await auth()

  if (!user.userId) throw new Error('Unauthorized')

  return await getAddress(addressUrl)
}

export async function getStarterRecords() {
  return await getStarters()
}

export async function updateStarterRecords(starters: Starter[]) {
  const user = await auth()

  if (!user.userId) throw new Error('Unauthorized')

  return await updateStarters(starters)
}

export async function getMainRecords() {
  return await getMains()
}

export async function updateMainRecords(mains: Main[]) {
  const user = await auth()

  if (!user.userId) throw new Error('Unauthorized')

  return await updateMains(mains)
}

export async function getPuddingRecords() {
  return await getPuddings()
}

export async function updatePuddingRecords(puddings: Pudding[]) {
  const user = await auth()

  if (!user.userId) throw new Error('Unauthorized')

  return await updatePuddings(puddings)
}

export async function getDetailRecord() {
  return await getDetails()
}

export async function updateDetailRecord(details: Detail) {
  const user = await auth()

  if (!user.userId) throw new Error('Unauthorized')

  return await updateDetails(details)
}

export async function getEspousedRecord() {
  return await getEspoused()
}

export async function updateEspousedRecord(espoused: Espoused) {
  const user = await auth()

  if (!user.userId) throw new Error('Unauthorized')

  return await updateEspoused(espoused)
}

export async function getImagesRecord() {
  return await getImages()
}

export async function updateImageRecord(image: Images) {
  return await updateImage(image)
}

export async function deleteImageRecord(image: Images) {
  return await deleteImages(image)
}

export async function getTimingRecords() {
  return await getTimings()
}

export async function updateTimingRecord(timing: Timing) {
  return await updateTimings(timing)
}

export async function deleteTimingRecord(timing: Timing) {
  return await deleteTimings(timing)
}
