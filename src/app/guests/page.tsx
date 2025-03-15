'use server'

import React from 'react'
import Guests from '@/app/guests/guests'
import {
  getColourRecords,
  getDetailRecord,
  getEspousedRecord,
  getGuestRecords,
  getHotelRecords,
  getImagesRecord,
  getMainRecords,
  getPuddingRecords,
  getStarterRecords,
  getTaxiRecords,
  getTimingRecords
} from '@/server/service'
import {
  Colour,
  Detail,
  Espoused,
  Hotel,
  Images,
  Main,
  Pudding,
  Starter,
  Taxi,
  Timing
} from '@/server/db/schema'

export default async function GuestsPage() {
  const data = await getGuestRecords()
  const details: Detail | null = await getDetailRecord()
  if (details === null) {
    throw new Error('Details not found')
  }
  const espoused: Espoused | null = await getEspousedRecord()

  const images: Images[] | null = await getImagesRecord()
  if (!images) return null

  const starters: Starter[] | null = await getStarterRecords()
  if (!starters) return null
  const mains: Main[] | null = await getMainRecords()
  if (!mains) return null
  const puddings: Pudding[] | null = await getPuddingRecords()
  if (!puddings) return null

  const timings: Timing[] | null = await getTimingRecords()
  if (!timings) return null

  const taxis: Taxi[] | null = await getTaxiRecords()
  if (!taxis) return null

  const hotels: Hotel[] | null = await getHotelRecords()
  if (!hotels) return null

  const colours: Colour[] | null = await getColourRecords()
  if (!colours) return null

  return (
    <div>
      <Guests
        details={details}
        starters={starters}
        mains={mains}
        puddings={puddings}
        espoused={espoused}
        data={data}
        images={images}
        timings={timings}
        taxis={taxis}
        hotels={hotels}
        colours={colours}
      />
    </div>
  )
}
