'use server'

import { Detail, type Guest } from '@/server/db/schema'
import { Section } from '@/components/section'
import {
  getDetailRecord,
  getGuestAndLinkedGuestRecord,
  getMainRecords,
  getPuddingRecords,
  getStarterRecords
} from '@/server/service'
import Image from 'next/image'
import { GuestResponse } from './_components/guest-response'
import { redirect } from 'next/navigation'
import { Fab } from './_components/fab'

export default async function Guest(props: {
  params: Promise<{ id: string }>
}) {
  const params = await props.params
  const guestData = await getGuestAndLinkedGuestRecord(params.id)
  const starters = await getStarterRecords()
  const mains = await getMainRecords()
  const puddings = await getPuddingRecords()
  const details: Detail | null = await getDetailRecord()
  if (!details) {
    redirect('/')
  }

  if (guestData.length === 0) {
    redirect('/')
  }

  return (
    <div className='flex min-h-screen flex-col items-center overflow-x-hidden pt-10'>
      <Section id='home' className='bg-background pt-7'>
        <Image
          alt='Pink Splatter 1'
          src='/assets-shape-welcome.svg'
          height={150}
          width={150}
          className='float-end h-auto absolute block right-0 top-20 z-0'
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
        <p className='text-3xl text-primary pt-10 pb-28 relative z-10'>
          we&apos;re getting <br />
          married!
        </p>
      </Section>
      <GuestResponse
        details={details}
        guestData={guestData}
        starters={starters}
        mains={mains}
        puddings={puddings}
      />
      <Fab />
    </div>
  )
}
