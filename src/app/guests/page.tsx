'use server'

import React from 'react'
import Guests from '@/app/guests/guests'
import { getDetailRecord, getGuestRecords } from '@/server/service'
import { Detail } from '@/server/db/schema'

export default async function GuestsPage() {
  const data = await getGuestRecords()
  const details: Detail = await getDetailRecord()

  return (
    <div>
      <Guests details={details} data={data} />
    </div>
  )
}
