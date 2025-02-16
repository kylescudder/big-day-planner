'use server'

import React from 'react'
import Guests from '@/app/guests/guests'
import {
  getDetailRecord,
  getEspousedRecord,
  getGuestRecords,
  getImagesRecord,
  getTimingRecords
} from '@/server/service'
import { Detail, Espoused, Image } from '@/server/db/schema'

export default async function GuestsPage() {
  const data = await getGuestRecords()
  const details: Detail | null = await getDetailRecord()
  if (details === null) {
    throw new Error('Details not found')
  }
  const espoused: Espoused | null = await getEspousedRecord()

  const images: Image[] | null = await getImagesRecord()
  if (!images) return null

  const timings: Timing[] | null = await getTimingRecords()
  if (!timings) return null

  return (
    <div>
      <Guests
        details={details}
        espoused={espoused}
        data={data}
        images={images}
        timings={timings}
      />
    </div>
  )
}
