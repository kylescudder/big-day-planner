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
      <Section
        id='rsvp'
        className={`bg-pink pb-20 ${props.guestData[0]?.rsvpAnswer ? '' : 'h-screen'}`}
      >
        <section className='z-10 relative'>
          <RSVP
            guestData={props.guestData}
            onRsvpAnswer={onRsvpAnswer}
            details={props.details}
          />
        </section>
        <Image
          alt='Venue illustration'
          src='/assets-venue.svg'
          width={300}
          height={200}
          className='float-end w-full relative h-auto'
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
          <Image
            alt='Divider illustration'
            src='/assest-timing-top-dividers.svg'
            width='0'
            height='0'
            sizes='100vw'
            className='float-end w-full relative h-auto'
          />
          <Section id='timings' className='bg-pink'>
            <Timings timings={props.timings} />
          </Section>
          <Image
            alt='Divider illustration'
            src='/assest-timing-bottom-dividers.svg'
            width='0'
            height='0'
            sizes='100vw'
            className='float-end w-full relative h-auto'
          />
          <Section id='details' className='pb-12'>
            <Details details={props.details} />
          </Section>
        </>
      )}
    </>
  )
}
