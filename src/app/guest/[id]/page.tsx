'use server'

import { type Guest } from '@/server/db/schema'
import { Section } from '@/components/section'
import { getGuestAndLinkedGuestRecord } from '@/server/service'
import Image from 'next/image'
import { GuestResponse } from './_components/guest-response'
import { RSVP } from './_components/rsvp'
import { redirect } from 'next/navigation'

export default async function Guest({ params }: { params: { id: string } }) {
  const guestData = await getGuestAndLinkedGuestRecord(params.id)

  if (guestData.length === 0) {
    redirect('/')
  }
  return (
    <div className='flex min-h-screen flex-col items-center'>
      <Section id='home' className='bg-background pt-7'>
        <Image
          alt='Pink Splatter'
          src='/pink-splatter.svg'
          height={120}
          width={120}
          className='-right-16 absolute z-0'
        />
        <div className='text-5xl'>
          <p className='inline'>hello </p>
          {guestData.map((guest, index) =>
            index === guestData.length - 1
              ? guest.forename.toLowerCase()
              : `${guest.forename.toLowerCase()} & `
          )}
        </div>
        <p className='text-3xl text-primary pt-10 pb-20'>
          we&apos;re getting married!
        </p>
      </Section>
      <Section id='rsvp' className='bg-primary text-background'>
        <Image
          alt='Pink Splatter 1'
          src='/pink-splatter.svg'
          height={120}
          width={120}
          className='-left-16 absolute z-0'
        />
        <p className='text-3xl pt-14'>rsvp</p>
        <section className='pt-10'>
          <RSVP guestData={guestData} />
        </section>
        <Image
          alt='Venue illustration'
          src='/assets-rsvp.svg'
          width={300}
          height={200}
          className='float-end w-full relative h-auto -mr-16'
        />
      </Section>
      <GuestResponse guestData={guestData} />
    </div>
  )
}
