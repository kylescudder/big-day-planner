import { render } from '@react-email/render'
import type { ReactElement } from 'react'
import { Resend } from 'resend'

import { EmailTemplate as MenuChoiceEmail } from '@/components/templates/emails/menu-choice-template'
import { EmailTemplate as RsvpChoiceEmail } from '@/components/templates/emails/rsvp-choice-template'
import { EmailTemplate as RsvpThanksEmail } from '@/components/templates/emails/rsvp-thanks-template'
import { EmailTemplate as SongChoiceEmail } from '@/components/templates/emails/song-choice-template'
import { env } from '@/env'
import type { Espoused, Guest } from '@/server/db/schema'

const SONG_REQUEST_RECIPIENT = 'kyle@kylescudder.co.uk'
// Must be a verified sending domain in Resend.
const SENDER_ADDRESS = 'noreply@rsvp.thescudders.org'
// Resend allows two requests per second; space sends out across guests.
const SEND_INTERVAL_MS = 500

let resend: Resend | undefined
let queue: Promise<void> = Promise.resolve()

type Message = { to: string[]; subject: string; body: ReactElement }

/**
 * Queue an email without delaying the guest's response. Recipients and
 * sender names come from the database, never from the browser.
 */
function send(espoused: Espoused, { to, subject, body }: Message) {
  queue = queue.then(async () => {
    try {
      resend ??= new Resend(env.RESEND_API_KEY)
      const { error } = await resend.emails.send({
        from: `${espoused.bride} & ${espoused.groom} <${SENDER_ADDRESS}>`,
        to,
        subject,
        html: await render(body)
      })
      if (error) console.error('Resend error:', error)
    } catch (error) {
      console.error('Email error:', error)
    }
    await new Promise((resolve) => setTimeout(resolve, SEND_INTERVAL_MS))
  })
}

export function sendRsvpEmails(espoused: Espoused, guest: Guest) {
  const rsvpAnswer = Boolean(guest.rsvpAnswer)
  send(espoused, {
    to: [espoused.groomEmail, espoused.brideEmail],
    subject: `${guest.forename} has submitted their RSVP!`,
    body: <RsvpChoiceEmail forename={guest.forename} rsvpAnswer={rsvpAnswer} />
  })
  send(espoused, {
    to: [guest.email],
    subject: 'Thank you for submitting your RSVP!',
    body: (
      <RsvpThanksEmail
        forename={guest.forename}
        rsvpAnswer={rsvpAnswer}
        bride={espoused.bride}
        groom={espoused.groom}
      />
    )
  })
}

export function sendMenuChoiceEmail(
  espoused: Espoused,
  guest: Guest,
  choice: {
    starter: string | null
    main: string | null
    pudding: string | null
  }
) {
  send(espoused, {
    to: [espoused.brideEmail, espoused.groomEmail],
    subject: `${guest.forename} has submitted their menu choice!`,
    body: (
      <MenuChoiceEmail
        forename={guest.forename}
        {...choice}
        dietaryRequirements={guest.dietaryRequirements}
      />
    )
  })
}

export function sendSongChoiceEmail(espoused: Espoused, guest: Guest) {
  send(espoused, {
    to: [SONG_REQUEST_RECIPIENT],
    subject: `${guest.forename} has submitted their song choice!`,
    body: (
      <SongChoiceEmail
        forename={guest.forename}
        song={guest.song}
        artist={guest.artist}
      />
    )
  })
}
