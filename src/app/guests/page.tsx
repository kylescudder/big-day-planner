'use server'

import React from 'react'
import Guests from '@/app/guests/guests'
import {
  getDetailRecord,
  getEspousedRecord,
  getGuestRecords,
  getImagesRecord,
  getMainRecords,
  getPuddingRecords,
  getStarterRecords,
  getTimingRecords
} from '@/server/service'
import {
  Detail,
  Espoused,
  Images,
  Main,
  Pudding,
  Starter,
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
      />
    </div>
  )
}
