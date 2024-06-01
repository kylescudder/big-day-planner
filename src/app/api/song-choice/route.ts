import { EmailTemplate } from '@/components/templates/emails/song-choice-template'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
interface Guest {
  forename: string
  song: string
  artist: string
}

export async function POST(req: Request) {
  try {
    const guest = (await req.json()) as Guest

    if (!guest) {
      return NextResponse.json({ error: 'Guest not found' }, { status: 404 })
    }

    const { data, error } = await resend.emails.send({
      from: 'The Wedding Site <wedding@kylescudder.co.uk>',
      to: ['kyle@kylescudder.co.uk'],
      subject: `${guest.forename} has submitted their song choice!`,
      text: 'Hello world',
      react: EmailTemplate({
        forename: guest.forename,
        song: guest.song,
        artist: guest.artist
      })
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
