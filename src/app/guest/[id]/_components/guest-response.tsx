'use client'

import Image from 'next/image'
import { Section } from '@/components/section'
import {
  type Pudding,
  type Main,
  type Starter,
  type Guest,
  type Timing,
  type Images,
  Detail
} from '@/server/db/schema'
import { useState } from 'react'
import { Timings } from './timings'
import { SongRequest } from './song-requst'
import { Details } from './details'
import { Menu } from './menu'
import { RSVP } from './rsvp'
import { ImageType } from '@/consts/image-types'
import { env } from '@/env'

export function GuestResponse(props: {
  details: Detail
  guestData: Guest[]
  starters: Starter[]
  mains: Main[]
  puddings: Pudding[]
  timings: Timing[] | null
  images: Images[]
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
        className={`bg-pink pb-10 ${!props.guestData[0]?.rsvpAnswer || !props.guestData[0]?.rsvp ? 'h-screen' : ''}`}
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
          className='float-end w-full relative h-auto pt-10'
        />
      </Section>
      <img
        alt='Venue illustration'
        src={`https://${env.NEXT_PUBLIC_UT_APP_ID}.ufs.sh/f/${props.images.find((image) => image.type == ImageType.RSVP)?.key}`}
        width={300}
        height={200}
        className='float-end w-full relative h-auto'
      />
      {rsvp && rsvpAnswer && (
        <>
          <Section id='menu' className='bg-background'>
            <Menu
              guestData={props.guestData}
              starters={props.starters}
              mains={props.mains}
              puddings={props.puddings}
              details={props.details}
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
            className='float-end w-full relative -top-[1px] h-auto'
          />
          <Section id='details' className='pb-12'>
            <Details details={props.details} />
          </Section>
        </>
      )}
    </>
  )
}
