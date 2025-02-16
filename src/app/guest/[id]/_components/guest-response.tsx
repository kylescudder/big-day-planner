'use client'

import Image from 'next/image'
import { Section } from '@/components/section'
import {
  type Pudding,
  type Main,
  type Starter,
  type Guest,
  type Timing,
  Detail
} from '@/server/db/schema'
import { useState } from 'react'
import { Timings } from './timings'
import { SongRequest } from './song-requst'
import { Details } from './details'
import { Menu } from './menu'
import { RSVP } from './rsvp'

export function GuestResponse(props: {
  details: Detail
  guestData: Guest[]
  starters: Starter[]
  mains: Main[]
  puddings: Pudding[]
  timings: Timing[]
}) {
  const [rsvp, setRSVP] = useState(false)
  const [rsvpAnswer, setRsvpAnswer] = useState(
    props.guestData.every((guest) => guest.rsvpAnswer)
  )
  if (
    !rsvp &&
    props.guestData[0]?.rsvp === true &&
    props.guestData[0]?.rsvpAnswer === true
  ) {
    setRSVP(true)
  }

  function onRsvpAnswer(rsvp: boolean, rsvpAnswer: boolean) {
    setRSVP(true)
    setRsvpAnswer(rsvpAnswer)
  }

  return (
    <>
      <Section id='rsvp' className='bg-primary text-background pb-20'>
        <p className='text-3xl pt-14'>rsvp</p>
        <section className='pt-10 z-10 relative'>
          <RSVP
            guestData={props.guestData}
            onRsvpAnswer={onRsvpAnswer}
            details={props.details}
          />
        </section>
        <Image
          alt='Venue illustration'
          src='/asset-rsvp-venue.png'
          width={300}
          height={200}
          className='float-end w-full relative h-auto -mr-12'
        />
      </Section>
      {rsvp && rsvpAnswer && (
        <>
          <Section id='menu' className='bg-background'>
            <Menu
              guestData={props.guestData}
              starters={props.starters}
              mains={props.mains}
              puddings={props.puddings}
            />
          </Section>
          <Section
            id='song-request'
            className={`${props.details.songRequest ? '' : 'hidden'} justify-center h-screen`}
          >
            <SongRequest guestData={props.guestData} />
          </Section>
          <Section id='timings' className='bg-pink'>
            <Timings timings={props.timings} />
          </Section>
          <Section id='details' className='pb-12 bg-primary'>
            <Details details={props.details} />
          </Section>
        </>
      )}
    </>
  )
}
