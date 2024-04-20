import { Section } from '@/components/section'

export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Section id="home" className="bg-background h-fit">
        hello guest & guest hello guest & guest hello guest & guest hello guest
        & guest hello guest & guest
      </Section>
      <Section id="rsvp" className="bg-primary">
        rsvp
      </Section>
      <Section id="menu" className="bg-background">
        menu
      </Section>
      <Section id="song-request" className="bg-secondary">
        song request
      </Section>
      <Section id="timings" className="bg-background">
        timings
      </Section>
      <Section id="details" className="bg-primary h-46">
        details
      </Section>
    </main>
  )
}
