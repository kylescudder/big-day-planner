import { EmailTemplate } from '@/components/templates/emails/song-choice-template'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
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

    const emailTemplate = await EmailTemplate({
      forename: emailData.forename,
      song: emailData.song,
      artist: emailData.artist
    })

    const { data, error } = await resend.emails.send({
      from: `${emailData.bride} & ${emailData.groom} <noreply@scudder.rsvp>`,
      to: ['kyle@kylescudder.co.uk'],
      subject: `${emailData.forename} has submitted their song choice!`,
      text: 'Hello world',
      react: emailTemplate
    })

    if (error) {
      console.error(error)
      return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error(error) // Log the error for debugging purposes
    return NextResponse.json({ error }, { status: 500 })
  }
}
