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

export function GuestResponse(props: {
  details: Detail
  guestData: Guest[]
  starters: Starter[]
  mains: Main[]
  puddings: Pudding[]
}) {
  const [rsvp, setRSVP] = useState(false)
  if (
    !rsvp &&
    props.guestData[0]?.rsvp === true &&
    props.guestData[0]?.rsvpAnswer === true
  ) {
    setRSVP(true)
  }

  return (
    <>
      {rsvp && (
        <>
          <Section id='menu' className='bg-background'>
            <Menu
              guestData={props.guestData}
              starters={props.starters}
              mains={props.mains}
              puddings={props.puddings}
            />
          </Section>
          <Section id='song-request' className='bg-secondary'>
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
          <Section id='details' className='bg-primary'>
            <Details details={props.details} />
          </Section>
        </>
      )}
    </>
  )
}
