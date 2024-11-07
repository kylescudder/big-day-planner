'use server'

import React from 'react'
import Guests from '@/app/guests/guests'
import {
  getDetailRecord,
  getEspousedRecord,
  getGuestRecords
} from '@/server/service'
import { Detail } from '@/server/db/schema'

export default async function GuestsPage() {
  const data = await getGuestRecords()
  const details: Detail = await getDetailRecord()
  const espoused = await getEspousedRecord()

  return (
    <div>
      <Guests details={details} espoused={espoused} data={data} />
    </div>
  )
}
