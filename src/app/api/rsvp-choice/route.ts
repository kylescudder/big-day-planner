import { EmailTemplate } from '@/components/templates/emails/rsvp-choice-template'
import { emailQueue, resend } from '@/lib/email-queue'
import { NextResponse } from 'next/server'

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

    emailQueue.enqueue(async () => {
      const emailTemplate = await EmailTemplate({
        forename: emailData.forename,
        rsvpAnswer: emailData.rsvpAnswer
      })

      await resend.emails.send({
        from: `${emailData.bride} & ${emailData.groom} <noreply@scudder.rsvp>`,
        to: [emailData.groomEmail, emailData.brideEmail],
        subject: `${emailData.forename} has submitted their RSVP!`,
        react: emailTemplate
      })
    })

    return NextResponse.json({ queued: true }, { status: 202 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error }, { status: 500 })
  }
}
