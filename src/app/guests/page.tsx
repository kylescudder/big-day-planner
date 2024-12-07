'use server'

import React from 'react'
import Guests from '@/app/guests/guests'
import {
  getDetailRecord,
  getEspousedRecord,
  getGuestRecords,
  getImagesRecord
} from '@/server/service'
import { Detail, Espoused } from '@/server/db/schema'

export default async function GuestsPage() {
  const data = await getGuestRecords()
  const details: Detail | null = await getDetailRecord()
  if (details === null) {
    throw new Error('Details not found')
  }
  const espoused: Espoused | null = await getEspousedRecord()
  if (espoused === null) {
    throw new Error('Espoused not found')
  }
  const images = await getImagesRecord()

  return (
    <div>
      <Guests
        details={details}
        espoused={espoused}
        data={data}
        images={images}
      />
    </div>
  )
}
