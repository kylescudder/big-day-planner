'use client'

import { Section } from '@/components/section'
import {
  type Pudding,
  type Main,
  type Starter,
  type Guest
} from '@/server/db/schema'
import { useState } from 'react'
import { Timings } from './timings'
import { SongRequest } from './song-requst'
import { Details } from './details'
import { Menu } from './menu'

export function GuestResponse(props: {
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
            <SongRequest guestData={props.guestData} />
          </Section>
          <Section id='timings' className='bg-background'>
            <Timings />
          </Section>
          <Section id='details' className='bg-primary'>
            <Details />
          </Section>
        </>
      )}
    </>
  )
}
