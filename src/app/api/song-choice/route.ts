import { EmailTemplate } from '@/components/templates/emails/song-choice-template'
import { NextResponse } from 'next/server'
import { emailQueue, resend } from '@/lib/email-queue'

interface EmailData {
  forename: string
  song: string
  artist: string
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
        song: emailData.song,
        artist: emailData.artist
      })

      await resend.emails.send({
        from: `${emailData.bride} & ${emailData.groom} <noreply@scudder.rsvp>`,
        to: ['kyle@kylescudder.co.uk'],
        subject: `${emailData.forename} has submitted their song choice!`,
        react: emailTemplate
      })
    })

    return NextResponse.json({ queued: true }, { status: 202 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error }, { status: 500 })
  }
}
