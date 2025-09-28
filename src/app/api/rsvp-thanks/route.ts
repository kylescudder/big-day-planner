import { EmailTemplate } from '@/components/templates/emails/rsvp-thanks-template'
import { emailQueue } from '@/lib/email-queue'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const emailData = await req.json()

    if (!emailData) {
      return NextResponse.json(
        { error: 'Email data not found' },
        { status: 404 }
      )
    }

    emailQueue.enqueue(async () => {
      const emailTemplate = await EmailTemplate(emailData)

      const { error } = await resend.emails.send({
        from: `${emailData.bride} & ${emailData.groom} <noreply@scudder.rsvp>`,
        to: [emailData.email],
        subject: `Thank you for submitting your RSVP!`,
        react: emailTemplate
      })

      if (error) throw error
    })

    return NextResponse.json({ queued: true }, { status: 202 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error }, { status: 500 })
  }
}
