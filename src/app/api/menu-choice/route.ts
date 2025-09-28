import { EmailTemplate } from '@/components/templates/emails/menu-choice-template'
import { emailQueue, resend } from '@/lib/email-queue'
import { NextResponse } from 'next/server'

interface EmailData {
  forename: string
  starter: string
  main: string
  pudding: string
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

    emailQueue.enqueue(async () => {
      const emailTemplate = await EmailTemplate({
        forename: emailData.forename,
        starter: emailData.starter,
        main: emailData.main,
        pudding: emailData.pudding
      })

      await resend.emails.send({
        from: `${emailData.bride} & ${emailData.groom} <noreply@scudder.rsvp>`,
        to: ['kyle@kylescudder.co.uk'],
        subject: `${emailData.forename} has submitted their menu choice!`,
        react: emailTemplate
      })
    })

    return NextResponse.json({ queued: true }, { status: 202 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error }, { status: 500 })
  }
}
