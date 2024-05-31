import { EmailTemplate } from '@/components/templates/emails/song-choice-template'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
interface Guest {
  forename: string
  song: string
  artist: string
}
export async function POST(req: Request) {
  try {
    void req.json().then(async (guest: Guest) => {
      if (!guest) {
        return Response.json({ error: 'Guest not found' }, { status: 404 })
      }

      console.log('guest', guest)

      const { data, error } = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
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
        console.log(error)
        return Response.json({ error }, { status: 500 })
      }

      return Response.json(data)
    })
  } catch (error) {
    return Response.json({ error }, { status: 500 })
  }
}
