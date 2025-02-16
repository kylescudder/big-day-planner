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

  const daysDifference = differenceInDays(
    props.details.startDateTime,
    new Date()
  )

  return (
    <div>
      {(!rsvp && !rsvpAnswer) || (rsvpAnswer && rsvp) ? (
        <section>
          {rsvp ? (
            <p className='text-5xl pt-14'>{daysDifference} days to go</p>
          ) : (
            <p className='text-5xl pt-14'>rsvp</p>
          )}
          <div className='text-lg'>
            <p
              className={`${props.details.startDateTime ? '' : 'hidden'} pt-4 text-primary`}
            >
              {format(props.details.startDateTime, 'MMMM dd, yyyy')}
            </p>
            <p
              className={`${props.details.startDateTime && props.details.endDateTime ? '' : 'hidden'} text-primary`}
            >
              {format(props.details.startDateTime, 'hh:mmaaa')} -{' '}
              {format(props.details.endDateTime, 'hh:mmaaa')}
            </p>
            <div>
              <p
                className={`${props.details.address1 ? '' : 'hidden'} pt-4 text-primary`}
              >
                {props.details.address1}
              </p>
              <div
                className={`${props.details.address2 || props.details.address3 ? 'flex items-center space-x-2' : 'hidden'}`}
              >
                <p className={`${props.details.address2 ? '' : 'hidden'}`}>
                  {props.details.address2}
                  {props.details.address2 && <span>,</span>}
                </p>
                <p className={`${props.details.address3 ? '' : 'hidden'}`}>
                  {props.details.address3}
                  {props.details.address3 && <span>,</span>}
                </p>
              </div>
              <span
                className={`${!props.details.postcode && !props.details.town && !props.details.county ? 'hidden' : ''}`}
              >
                <div className='flex items-center space-x-2'>
                  <p className={`${props.details.town ? '' : 'hidden'}`}>
                    {props.details.town}
                    {props.details.town && props.details.county && (
                      <span>,</span>
                    )}
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
          </div>
          {!rsvp && (
            <RSVPAnswer
              guestData={props.guestData}
              onRsvpAnswer={onRsvpAnswer}
              details={props.details}
            />
          )}
        </section>
      ) : null}
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
