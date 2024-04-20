'use server'

import { type Guest } from '@/server/db/schema'
import { Section } from '@/components/section'
import { getGuestAndLinkedGuestRecord } from '@/server/service'

export default async function Guest({ params }: { params: { id: string } }) {
  const guestData = await getGuestAndLinkedGuestRecord(params.id)
  console.log(guestData)
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Section id="home" className="bg-background h-fit">
        hello
        {guestData.map((guest) => guest.forename)}
      </Section>
      <Section id="rsvp" className="bg-primary text-background">
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
      <Section id="details" className="bg-primary h-46 text-background">
        details
      </Section>
    </div>
  )
}
