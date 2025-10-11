import * as React from 'react'
import { EmailTemplate } from '@/components/templates/emails/rsvp-choice-template'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface EmailData {
  forename: string
  rsvpAnswer: boolean
  bride: string
  groom: string
  groomEmail: string
  brideEmail: string
}

export async function POST(req: Request) {
  try {
    const emailData = (await req.json()) as EmailData

    if (!emailData) {
      return NextResponse.json({ error: 'Guest not found' }, { status: 404 })
    }

    const reactEmail = React.createElement(EmailTemplate, {
      forename: emailData.forename,
      rsvpAnswer: emailData.rsvpAnswer
    })

    const { data, error } = await resend.emails.send({
      from: `${emailData.bride} & ${emailData.groom} <noreply@scudder.rsvp>`,
      to: [emailData.groomEmail, emailData.brideEmail],
      subject: `${emailData.forename} has submitted their RSVP!`,
      react: reactEmail
    })

    if (error) {
      console.error(error)
      return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error }, { status: 500 })
  }
}
