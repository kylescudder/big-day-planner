'use server'

import { Detail } from '@/server/db/schema'
import {
  getDetailRecord,
  getGuestAndLinkedGuestRecord,
  getImagesRecord,
  getMainRecords,
  getPuddingRecords,
  getStarterRecords,
  getTimingRecords,
  getTaxiRecords,
  getHotelRecords,
  getColourRecords
} from '@/server/service'
import { redirect } from 'next/navigation'
import { ClientGuestPage } from '@/app/guest/[id]/_components/client-guest'

export default async function Guest(props: {
  params: Promise<{ id: string }>
}) {
  const params = await props.params
  const guestData = await getGuestAndLinkedGuestRecord(params.id)
  const starters = await getStarterRecords()
  const mains = await getMainRecords()
  const puddings = await getPuddingRecords()
  const timings = (await getTimingRecords()) || []
  const details: Detail | null = await getDetailRecord()
  const images = (await getImagesRecord()) || []
  const taxis = (await getTaxiRecords()) || []
  const hotels = (await getHotelRecords()) || []
  const colours = (await getColourRecords()) || []

  if (!details) {
    redirect('/')
  }

  if (guestData.length === 0) {
    redirect('/')
  }

  return (
    <ClientGuestPage
      initialGuestData={guestData}
      details={details}
      starters={starters}
      mains={mains}
      puddings={puddings}
      timings={timings}
      images={images}
      taxis={taxis}
      hotels={hotels}
      colours={colours}
    />
  )
}
