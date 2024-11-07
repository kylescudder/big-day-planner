'use client'
import { type Guest } from '@/server/db/schema'
import { RSVPAnswer } from './rsvp-answer'
import { useState } from 'react'

export function RSVP(props: {
  guestData: Guest[]
  onRsvpAnswer: (rsp: boolean, rsvpAnswer: boolean) => void
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
            <p>we can&apos;t wait to celebrate our day with you!</p>
          </div>
          <div className='text-lg pt-10'>
            <p>00.00.26</p>
            <p>02:00pm-12:00am</p>
            <p className='pt-4'>Lewes Registery Office</p>
            <p>Southover Grange, Southover High St,</p>
            <p>Lewes BN7 1TP</p>
          </div>
          <div className='text-lg'>
            <p className='pt-10'>reception details</p>
            <p>address of the receiption will go here</p>
          </div>
        </section>
      )}
      {rsvp && !rsvpAnswer && (
        <div className='text-lg pb-16'>
          <p className='pt-10'>
            thanks for letting us know, you&apos;ll be missed!
          </p>
        </div>
      )}
    </div>
  )
}
