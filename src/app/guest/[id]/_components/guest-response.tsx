'use client'

import { Section } from '@/components/section'
import { type Guest } from '@/server/db/schema'
import { useState } from 'react'
import { Timings } from './timings'
import { SongRequest } from './song-requst'

export function GuestResponse(props: { guestData: Guest[] }) {
  const [rsvp, setRSVP] = useState(false)
  if (
    !rsvp &&
    props.guestData[0]?.rsvp === true &&
    props.guestData[0]?.rsvpAnswer === true
  ) {
    setRSVP(true)
  }

  return (
    <div className="w-full">
      {rsvp && (
        <>
          <Section id="menu" className="bg-background h-52">
            <p className="text-3xl pt-14">menu</p>
          </Section>
          <Section id="song-request" className="bg-secondary">
            <SongRequest guestData={props.guestData} />
          </Section>
          <Section id="timings" className="bg-background">
            <Timings />
          </Section>
          <Section id="details" className="bg-primary pb-10">
            <Details />
          </Section>
        </>
      )}
    </div>
  )
}
