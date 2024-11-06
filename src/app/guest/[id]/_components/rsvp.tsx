'use client'

import { type Guest } from '@/server/db/schema'
import { RSVPAnswer } from './rsvp-answer'

export function RSVP(props: { guestData: Guest[] }) {
  return (
    <div>
      {props.guestData.every(
        (guest) => guest.rsvp === true && guest.rsvpAnswer === true
      ) ? (
        <div className='text-lg'>
          <p>we can&apos;t wait to celebrate our day with you!</p>
        </div>
      ) : null}
      {props.guestData.every((guest) => guest.rsvpAnswer === true) ? (
        <div className='text-lg pt-10'>
          <p>00.00.26</p>
          <p>02:00pm-12:00am</p>
          <p className='pt-4'>Lewes Registery Office</p>
          <p>Southover Grange, Southover High St,</p>
          <p>Lewes BN7 1TP</p>
        </div>
      ) : null}
      {props.guestData.every((guest) => guest.rsvp === false) ? (
        <RSVPAnswer guestData={props.guestData} />
      ) : null}
      {props.guestData.every(
        (guest) => guest.rsvp === true && guest.rsvpAnswer === true
      ) ? (
        <div className='text-lg'>
          <p className='pt-10'>reception details</p>
          <p>address of the receiption will go here</p>
        </div>
      ) : null}
      {props.guestData.every(
        (guest) => guest.rsvp === true && guest.rsvpAnswer === false
      ) ? (
        <div className='text-lg'>
          <p className='pt-10'>
            thanks for letting us know, you&apos;ll be missed!
          </p>
        </div>
      ) : null}
    </div>
  )
}
