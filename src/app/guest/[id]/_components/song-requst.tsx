import { type Guest } from '@/server/db/schema'
import { SongRequestForm } from './song-request-form'
import Image from 'next/image'

export function SongRequest(props: { guestData: Guest[] }) {
  return (
    <div className='text-white'>
      <p className='text-3xl pt-14'>song request</p>
      <p className='text-lg py-10'>
        we wanna make sure there&apos;s at least one song you just can&apos;t
        help but dance to!
      </p>
      {props.guestData.map((guest, index) => (
        <SongRequestForm key={index} guest={guest} />
      ))}
      <div className='columns-2 pt-10'>
        <Image
          alt='Song request illustration'
          src='/assets-song-request.svg'
          width={200}
          height={100}
          className='float-start relative h-auto pt-10'
        />
        <p className='text-lg -ms-16'>
          check out the playlist you and all the other guests are creating{' '}
          <p className='text-primary'>here</p>
        </p>
      </div>
      <p className='text-right w-48 float-end pb-10'>
        We kindly ask you to make your choices by 00/00/25
      </p>
    </div>
  )
}
