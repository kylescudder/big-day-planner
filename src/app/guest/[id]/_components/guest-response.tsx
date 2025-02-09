'use client'

import Image from 'next/image'
import { Section } from '@/components/section'
import {
  type Pudding,
  type Main,
  type Starter,
  type Guest,
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
        <Image
          alt='Pink Splatter 2'
          src='/assets-shape-rsvp.svg'
          height={100}
          width={100}
          className='float-start h-auto absolute block left-0 top-200 z-0'
        />
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
          src='/assets-rsvp.svg'
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
            <Image
              alt='Pink Splatter 4'
              src='/assets-shape-song.svg'
              width={100}
              height={100}
              className='float-start h-auto absolute block left-0 top-700 z-0'
            />
            <SongRequest guestData={props.guestData} />
          </Section>
          <Section id='timings' className='bg-background'>
            <Image
              alt='Pink Splatter 5'
              src='/assets-shape-timings.svg'
              width={100}
              height={100}
              className='float-start h-auto absolute block right-0 top-750 z-0'
            />
            <Timings />
          </Section>
          <Section id='details' className='pb-12 bg-primary'>
            <Details details={props.details} />
          </Section>
        </>
      )}
    </>
  )
}
