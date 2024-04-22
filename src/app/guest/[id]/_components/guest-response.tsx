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
          <Section id="details" className="bg-primary pb-10 text-background">
            <p className="text-3xl pt-14">details</p>
            <div className="text-lg">
              <p className="pt-10">
                here are some of the finer details of the day
              </p>
              <p className="pt-10">
                we would like our special day to be an adult only occasion.
              </p>
              <p>
                we hope you can join us in celerbrating our marriage! Please
                know that all we really want for our wedding day is for you to
                be there to celebrate with us, but if you would like to give us
                something, a contribution towards *blank* would be really
                appreciated.
              </p>
              <p className="pt-10">dress code: Formal (Black Tie optional)</p>
            </div>
          </Section>
        </>
      )}
    </div>
  )
}
