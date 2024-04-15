'use server'

import React from 'react'
import { getGuests } from '@/server/db/queries'
import Guests from '@/app/guests/guests'

export default async function GuestsPage() {
  const data = await getGuests()

  return <Guests data={data} />
}
