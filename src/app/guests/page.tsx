'use server'

import React from 'react'
import Guests from '@/app/guests/guests'
import { getGuestRecords } from '@/server/service'

export default async function GuestsPage() {
  const data = await getGuestRecords()

  return (
    <div>
      <Guests data={data} />
    </div>
  )
}
