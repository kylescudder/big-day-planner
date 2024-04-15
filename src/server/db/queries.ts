import 'server-only'
import { db } from '@/server/db/index'
import { auth } from '@clerk/nextjs/server'

export async function getGuests() {
  const user = auth()

  if (!user.userId) throw new Error('Unauthorized')

  const guests = await db.query.guests.findMany({})

  return guests
}
