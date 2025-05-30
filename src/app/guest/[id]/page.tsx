'use server'

import { Detail, type Guest } from '@/server/db/schema'
import { Section } from '@/components/section'
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
import { GuestResponse } from './_components/guest-response'
import { redirect } from 'next/navigation'
import { Fab } from './_components/fab'

export default async function Guest(props: {
  params: Promise<{ id: string }>
}) {
  const params = await props.params
  const guestData = await getGuestAndLinkedGuestRecord(params.id)
  const starters = await getStarterRecords()
  const mains = await getMainRecords()
  const puddings = await getPuddingRecords()
  const timings = await getTimingRecords()
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
    <div className='flex min-h-screen flex-col items-center overflow-x-hidden pt-10'>
      <Section
        id='home'
        className={`bg-pink pt-7 h-64 ${!guestData[0]?.rsvpAnswer && guestData[0]?.rsvp ? 'hidden' : ''}`}
      >
        <div className='text-5xl'>
          <div className='whitespace-pre-line z-10 relative'>
            we&apos;re getting <br />
            married!
          </div>
        </div>
        <p className='text-3xl text-primary pt-10 relative z-10'>
          {guestData.map((guest, index) =>
            index === 0
              ? `hello ${guest.forename.toLowerCase()}`
              : `\n& ${guest.forename.toLowerCase()}`
          )}
        </p>
      </Section>
      <GuestResponse
        details={details}
        guestData={guestData}
        starters={starters}
        mains={mains}
        puddings={puddings}
        timings={timings}
        images={images}
        taxis={taxis}
        hotels={hotels}
        colours={colours}
      />
      <Fab />
    </div>
  )
}
