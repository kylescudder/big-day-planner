'use client'
import { Detail, type Guest } from '@/server/db/schema'
import { RSVPAnswer } from './rsvp-answer'
import { useState } from 'react'
import { format, differenceInDays } from 'date-fns'

export function RSVP(props: {
  guestData: Guest[]
  onRsvpAnswer: (guests: Guest[]) => void
  details: Detail
}) {
  const [rsvpAnswer, setRsvpAnswer] = useState(
    props.guestData.some((guest) => guest.rsvpAnswer)
  )
  const [rsvp, setRsvp] = useState(props.guestData.some((guest) => guest.rsvp))

  function onRsvpAnswer(guests: Guest[]) {
    setRsvpAnswer(guests.some((guest) => guest.rsvpAnswer))
    setRsvp(guests.some((guest) => guest.rsvp))
    props.onRsvpAnswer(guests)
  }

  return (
    <div>
      {(!rsvp && !rsvpAnswer) || (rsvpAnswer && rsvp) ? (
        <section>
          {props.details.startDateTime ? (
            <div>
              {rsvp ? (
                <p className='text-5xl'>
                  {' '}
                  {differenceInDays(
                    props.details.startDateTime,
                    new Date()
                  )}{' '}
                  days to go
                </p>
              ) : (
                <p className='text-5xl'>rsvp</p>
              )}
            </div>
          ) : null}
          <div className='text-lg'>
            {props.details.startDateTime && props.details.endDateTime ? (
              <div>
                <p
                  className={`${props.details.startDateTime ? '' : 'hidden'} pt-4 text-primary text-lg`}
                >
                  {format(props.details.startDateTime, 'MMMM dd, yyyy')}
                </p>
                <p
                  className={`${props.details.startDateTime && props.details.endDateTime ? '' : 'hidden'} text-primary text-lg`}
                >
                  {format(props.details.startDateTime, 'hh:mmaaa')} -{' '}
                  {format(props.details.endDateTime, 'hh:mmaaa')}
                </p>
              </div>
            ) : null}
            <div>
              <p
                className={`${props.details.address1 ? '' : 'hidden'} pt-4 text-primary text-lg`}
              >
                {props.details.address1}
              </p>
              <div
                className={`${props.details.address2 || props.details.address3 ? 'flex items-center space-x-2' : 'hidden'}`}
              >
                <p
                  className={`${props.details.address2 ? '' : 'hidden'} text-lg`}
                >
                  {props.details.address2}
                  {props.details.address2 && <span>,</span>}
                </p>
                <p
                  className={`${props.details.address3 ? '' : 'hidden'} text-lg`}
                >
                  {props.details.address3}
                  {props.details.address3 && <span>,</span>}
                </p>
              </div>
              <span
                className={`${!props.details.postcode && !props.details.town && !props.details.county ? 'hidden' : ''} text-lg`}
              >
                <div className='flex items-center space-x-2'>
                  <p
                    className={`${props.details.town ? '' : 'hidden'} text-lg`}
                  >
                    {props.details.town}
                    {props.details.town && props.details.county && (
                      <span>,</span>
                    )}
                  </p>
                  <p
                    className={`${props.details.county ? '' : 'hidden'} text-lg`}
                  >
                    {props.details.county}
                    {props.details.county && props.details.postcode && (
                      <span>,</span>
                    )}
                  </p>
                  <p
                    className={`${props.details.postcode ? '' : 'hidden'} text-lg`}
                  >
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
