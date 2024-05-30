'use client'

import { Section } from '@/components/section'
import { type Guest } from '@/server/db/schema'
import { useState } from 'react'
import { Timings } from './timings'
import { SongRequest } from './song-requst'
import { Details } from './details'
import { Menu } from './menu'

export function GuestResponse(props: {
  guestData: Guest[]
  starters: string[]
  mains: string[]
  puddings: string[]
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
          <Section id='menu' className='bg-background h-52'>
            <Menu
              guestData={props.guestData}
              starters={props.starters}
              mains={props.mains}
              puddings={props.puddings}
            />
          </Section>
          <Section id='song-request' className='bg-secondary pb-10'>
            <SongRequest guestData={props.guestData} />
          </Section>
          <Section id='timings' className='bg-background'>
            <Timings />
          </Section>
          <Section id='details' className='bg-primary pb-10'>
            <Details />
          </Section>
        </>
      )}
    </>
  )
}
