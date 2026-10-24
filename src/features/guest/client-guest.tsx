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
  type Guest,
  Espoused
} from '@/server/db/schema'
import { Section } from '@/components/section'
import TopBar from '@/features/guest/top-bar'
import { GuestResponse } from '@/features/guest/guest-response'
import { Fab } from '@/features/guest/fab'

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
  espoused: Espoused
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
          className={`bg-pink h-64 pt-7 ${
            !guestData.some((guest) => guest.rsvpAnswer) &&
            guestData.some((guest) => guest.rsvp)
              ? 'hidden'
              : ''
          }`}
        >
          <div className='text-5xl'>
            <div className='relative z-10 whitespace-pre-line'>
              we&apos;re getting <br />
              married!
            </div>
          </div>
          <p className='text-primary relative z-10 pt-10 text-3xl'>
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
          espoused={props.espoused}
          onGuestDataUpdate={handleGuestDataUpdate}
        />
        <Fab />
      </div>
    </div>
  )
}
