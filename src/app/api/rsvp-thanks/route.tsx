import * as React from 'react'
import { EmailTemplate } from '@/components/templates/emails/rsvp-thanks-template'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { render } from '@react-email/render'

const resend = new Resend(process.env.RESEND_API_KEY)

interface EmailData {
  forename: string
  email: string
  rsvpAnswer: boolean
  bride: string
  groom: string
}

export async function POST(req: Request) {
  try {
    const emailData = (await req.json()) as EmailData

    if (!emailData) {
      return NextResponse.json(
        { error: 'Email data not found' },
        { status: 404 }
      )
    }

    const htmlContent = await render(
      <EmailTemplate
        forename={emailData.forename}
        rsvpAnswer={emailData.rsvpAnswer}
        bride={emailData.bride}
        groom={emailData.groom}
      />
    )

    const { data, error } = await resend.emails.send({
      from: `${emailData.bride} & ${emailData.groom} <noreply@scudder.rsvp>`,
      to: [emailData.email],
      subject: `Thank you for submitting your RSVP!`,
      html: htmlContent
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
