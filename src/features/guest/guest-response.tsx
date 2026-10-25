import { Section } from '@/components/section'
import {
  type Pudding,
  type Main,
  type Starter,
  type Guest,
  type Timing,
  type Images,
  Detail,
  Hotel,
  Taxi,
  Colour,
  Espoused
} from '@/server/db/schema'
import { useState } from 'react'
import { Timings } from './timings'
import { SongRequest } from './song-requst'
import { Details } from './details'
import { Menu } from './menu'
import { RSVP } from './rsvp'
import { ImageType } from '@/consts/image-types'
import { uploadUrl } from '@/lib/uploads'
import { Taxis } from './taxis'
import { Hotels } from './hotels'

export function GuestResponse(props: {
  details: Detail
  guestData: Guest[]
  starters: Starter[]
  mains: Main[]
  puddings: Pudding[]
  timings: Timing[] | null
  images: Images[]
  taxis: Taxi[]
  hotels: Hotel[]
  colours: Colour[]
  espoused: Espoused
  onGuestDataUpdate?: (guests: Guest[]) => void
}) {
  const [rsvp, setRSVP] = useState(false)
  const [rsvpAnswer, setRsvpAnswer] = useState(
    props.guestData.some((guest) => guest.rsvpAnswer)
  )
  if (
    !rsvp &&
    props.guestData[0]?.rsvp === true &&
    props.guestData[0]?.rsvpAnswer === true
  ) {
    setRSVP(true)
  }

  function onRsvpAnswer(guests: Guest[]) {
    setRSVP(true)
    setRsvpAnswer(props.guestData.some((guest) => guest.rsvpAnswer))

    if (props.onGuestDataUpdate) {
      props.guestData.map((guest) => ({
        ...guest,
        rsvp,
        rsvpAnswer
      }))
      props.onGuestDataUpdate(guests)
    }
  }

  return (
    <>
      <Section id='rsvp' className={`bg-pink pb-10`}>
        <section className='relative z-10'>
          <RSVP
            guestData={props.guestData}
            onRsvpAnswer={onRsvpAnswer}
            details={props.details}
            espoused={props.espoused}
          />
        </section>
        <img
          alt='Venue illustration'
          src='/assets-venue.svg'
          width={300}
          height={200}
          className='relative float-end h-auto w-full pt-10'
        />
      </Section>
      {(() => {
        const rsvpImage = props.images.find(
          (image) => image.type == ImageType.RSVP
        )
        return rsvpImage ? (
          <img
            alt='RSVP Image'
            src={uploadUrl(rsvpImage.key)}
            width={300}
            height={200}
            className='relative float-end h-auto w-full'
          />
        ) : null
      })()}

      {props.guestData.some(
        (guest) => guest.rsvp === true && guest.rsvpAnswer === true
      ) && (
        <>
          <Section id='menu' className='bg-background'>
            <Menu
              guestData={props.guestData}
              starters={props.starters}
              mains={props.mains}
              puddings={props.puddings}
              details={props.details}
              espoused={props.espoused}
            />
          </Section>
          <Section
            id='song-request'
            className={`${props.details.songRequest ? '' : 'hidden'} h-screen justify-center`}
          >
            <SongRequest
              guestData={props.guestData}
              espoused={props.espoused}
            />
          </Section>
          <img
            alt='Divider illustration'
            src='/assest-timing-top-dividers.svg'
            width='0'
            height='0'
            className='relative float-end h-auto w-full'
          />
          <Section id='timings' className='bg-pink'>
            <Timings timings={props.timings} />
          </Section>
          <img
            alt='Divider illustration'
            src='/assest-timing-bottom-dividers.svg'
            width='0'
            height='0'
            className='relative -top-[1px] float-end h-auto w-full'
          />
          <Section id='details' className='pb-12'>
            <Details details={props.details} colours={props.colours} />
          </Section>
          <Section id='taxis' className='pb-12'>
            <Taxis taxis={props.taxis} />
          </Section>
          <Section id='hotels' className='pb-12'>
            <Hotels hotels={props.hotels} />
          </Section>
          {(() => {
            const footerImage = props.images.find(
              (image) => image.type == ImageType.FOOTER
            )
            return footerImage ? (
              <img
                alt='Footer image'
                src={uploadUrl(footerImage.key)}
                width={300}
                height={200}
                className='relative float-end h-auto w-full'
              />
            ) : null
          })()}
        </>
      )}
    </>
  )
}
