'use client'
import { Detail, type Guest } from '@/server/db/schema'
import { RSVPAnswer } from './rsvp-answer'
import { useState } from 'react'
import { format, differenceInDays } from 'date-fns'

export function RSVP(props: {
  guestData: Guest[]
  onRsvpAnswer: (rsp: boolean, rsvpAnswer: boolean) => void
  details: Detail
}) {
  const [rsvpAnswer, setRsvpAnswer] = useState(
    props.guestData.every((guest) => guest.rsvpAnswer)
  )
  const [rsvp, setRSVP] = useState(props.guestData.every((guest) => guest.rsvp))

  function onRsvpAnswer(rsvp: boolean, rsvpAnswer: boolean) {
    setRsvpAnswer(rsvpAnswer)
    setRSVP(rsvp)
    props.onRsvpAnswer(rsvp, rsvpAnswer)
  }

  return (
    <div>
      {!rsvp && (
        <RSVPAnswer guestData={props.guestData} onRsvpAnswer={onRsvpAnswer} />
      )}
      {rsvp && rsvpAnswer && (
        <section>
          <div className='text-lg'>
            <p
              className={`${props.details.startDateTime ? '' : 'hidden'} pt-4`}
            >
              {format(props.details.startDateTime, 'MMMM dd, yyyy')}
            </p>
            <p
              className={`${props.details.startDateTime && props.details.endDateTime ? '' : 'hidden'}`}
            >
              {format(props.details.startDateTime, 'hh:mmaaa')} -{' '}
              {format(props.details.endDateTime, 'hh:mmaaa')}
            </p>
            <p className={`${props.details.address1 ? '' : 'hidden'} pt-4`}>
              {props.details.address1}
            </p>
            <p className={`${props.details.address2 ? '' : 'hidden'}`}>
              {props.details.address2}
            </p>
            <p className={`${props.details.address3 ? '' : 'hidden'}`}>
              {props.details.address3}
            </p>
            <span
              className={`${!props.details.postcode && !props.details.town && !props.details.county ? 'hidden' : ''}`}
            >
              <div className='flex items-center space-x-2'>
                <p className={`${props.details.town ? '' : 'hidden'}`}>
                  {props.details.town}
                  {props.details.town && props.details.county && <span>,</span>}
                </p>
                <p className={`${props.details.county ? '' : 'hidden'}`}>
                  {props.details.county}
                  {props.details.county && props.details.postcode && (
                    <span>,</span>
                  )}
                </p>
                <p className={`${props.details.postcode ? '' : 'hidden'}`}>
                  {props.details.postcode}
                </p>
              </div>
            </span>
          </div>
          <div className='text-lg'>
            <p className='pt-10'>reception details</p>
            <p>address of the receiption will go here</p>
          </div>
        </section>
      )}
      {rsvp && !rsvpAnswer && (
        <div className='text-lg pb-16'>
          <p className='text-5xl'>you will be missed!</p>
          <p className='text-3xl text-primary pt-10'>
            thanks you for your rsvp
          </p>
        </div>
      )}
    </div>
  )
}
