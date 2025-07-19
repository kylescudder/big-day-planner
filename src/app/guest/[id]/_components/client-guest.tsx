'use client'

import { useState } from 'react'
import {
  Colour,
  Detail,
  Hotel,
  Images,
  Main,
  Pudding,
  Starter,
  Taxi,
  Timing,
  type Guest
} from '@/server/db/schema'
import { Section } from '@/components/section'
import TopBar from '@/app/guest/[id]/_components/top-bar'
import { GuestResponse } from '@/app/guest/[id]/_components/guest-response'
import { Fab } from '@/app/guest/[id]/_components/fab'

interface ClientGuestPageProps {
  initialGuestData: Guest[]
  details: Detail
  starters: Starter[]
  mains: Main[]
  puddings: Pudding[]
  timings: Timing[]
  images: Images[]
  taxis: Taxi[]
  hotels: Hotel[]
  colours: Colour[]
}

export function ClientGuestPage(props: ClientGuestPageProps) {
  const [guestData, setGuestData] = useState(props.initialGuestData)

  const handleGuestDataUpdate = (updatedGuests: Guest[]) => {
    console.log('Updating guest data:', updatedGuests)
    const newGuestData = updatedGuests.map((guest) => ({
      ...guest
    }))
    setGuestData(newGuestData)
  }

  return (
    <div>
      <TopBar guestData={guestData} details={props.details} />
      <div className='flex min-h-screen flex-col items-center overflow-x-hidden pt-10'>
        <Section
          id='home'
          className={`bg-pink pt-7 h-64 ${
            !guestData.some((guest) => guest.rsvpAnswer) &&
            guestData.some((guest) => guest.rsvp)
              ? 'hidden'
              : ''
          }`}
        >
          <div className='text-5xl'>
            <div className='whitespace-pre-line z-10 relative'>
              we&apos;re getting <br />
              married!
            </div>
          </div>
          <p className='text-3xl text-primary pt-10 relative z-10'>
            {guestData
              .filter(
                (guest) => guest.rsvp === true && guest.rsvpAnswer === true
              )
              .map((guest, index) =>
                index === 0
                  ? `hello ${guest.forename.toLowerCase()}`
                  : `\n& ${guest.forename.toLowerCase()}`
              )}
          </p>
        </Section>
        <GuestResponse
          details={props.details}
          guestData={guestData}
          starters={props.starters}
          mains={props.mains}
          puddings={props.puddings}
          timings={props.timings}
          images={props.images}
          taxis={props.taxis}
          hotels={props.hotels}
          colours={props.colours}
          onGuestDataUpdate={handleGuestDataUpdate}
        />
        <Fab />
      </div>
    </div>
  )
}
