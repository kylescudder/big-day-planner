import { EmailTemplate } from '@/components/templates/emails/menu-choice-template'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
interface Guest {
  forename: string
  starter: string
  main: string
  pudding: string
}

export async function POST(req: Request) {
  try {
    const guest = (await req.json()) as Guest

    if (!guest) {
      return NextResponse.json({ error: 'Guest not found' }, { status: 404 })
    }
    const emailTemplate = await EmailTemplate({
      forename: guest.forename,
      starter: guest.starter,
      main: guest.main,
      pudding: guest.pudding
    })

    const { data, error } = await resend.emails.send({
      from: 'The Wedding Site <wedding@kylescudder.co.uk>',
      to: ['kyle@kylescudder.co.uk'],
      subject: `${guest.forename} has submitted their menu choice!`,
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
