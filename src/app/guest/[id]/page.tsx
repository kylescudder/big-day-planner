'use server'

import { type Guest } from '@/server/db/schema'
import { Section } from '@/components/section'
import { getGuestAndLinkedGuestRecord } from '@/server/service'
import Image from 'next/image'
import { GuestResponse } from './_components/guest-response'
import { RSVP } from './_components/rsvp'
import { redirect } from 'next/navigation'
import { Fab } from './_components/fab'

export default async function Guest({ params }: { params: { id: string } }) {
  const guestData = await getGuestAndLinkedGuestRecord(params.id)

  if (guestData.length === 0) {
    redirect('/')
  }
  return (
    <div className='flex min-h-screen flex-col items-center overflow-x-hidden pt-10'>
      <Section id='home' className='bg-background pt-7'>
        <Image
          alt='Pink Splatter 1'
          src='/assets-shape-welcome.svg'
          height={200}
          width={200}
          className='float-end h-auto -mr-8 absolute block right-0 top-16 z-0'
        />
        <div className='text-5xl'>
          <div className='whitespace-pre-line z-10 relative'>
            {guestData.map((guest, index) =>
              index === 0
                ? `hello ${guest.forename.toLowerCase()}`
                : `\n& ${guest.forename.toLowerCase()}`
            )}
          </div>
        </div>
        <p className='text-3xl text-primary pt-10 pb-20 relative z-10'>
          we&apos;re getting married!
        </p>
      </Section>
      <Section id='rsvp' className='bg-primary text-background pb-10'>
        <Image
          alt='Pink Splatter 2'
          src='/assets-shape-rsvp.svg'
          height={100}
          width={100}
          className='float-start h-auto absolute block left-0 top-200 z-0'
        />
        <p className='text-3xl pt-14'>rsvp</p>
        <section className='pt-10'>
        <section className='pt-10 z-10 relative'>
          <RSVP guestData={guestData} />
        </section>
        <Image
          alt='Venue illustration'
          src='/assets-rsvp.svg'
          width={300}
          height={200}
          className='float-end w-full relative h-auto -mr-16'
          className='float-end w-full relative h-auto -mr-12'
        />
      </Section>
      <GuestResponse guestData={guestData} />
      <Fab />
    </div>
  )
}
