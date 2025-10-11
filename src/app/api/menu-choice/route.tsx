export const runtime = 'nodejs'

import * as React from 'react'
import { EmailTemplate } from '@/components/templates/emails/menu-choice-template'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { render } from '@react-email/render'

const resend = new Resend(process.env.RESEND_API_KEY)

interface EmailData {
  forename: string
  starter: string | null
  main: string | null
  pudding: string | null
  dietaryRequirements: string | null
  bride: string
  groom: string
  brideEmail: string
  groomEmail: string
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

    // ✅ Render HTML from React component
    const htmlContent = await render(
      <EmailTemplate
        forename={emailData.forename}
        starter={emailData.starter}
        main={emailData.main}
        pudding={emailData.pudding}
        dietaryRequirements={emailData.dietaryRequirements}
      />
    )

    const { data, error } = await resend.emails.send({
      from: `${emailData.bride} & ${emailData.groom} <noreply@scudder.rsvp>`,
      to: [emailData.brideEmail, emailData.groomEmail],
      subject: `${emailData.forename} has submitted their menu choice!`,
      html: htmlContent
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error('Handler error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
