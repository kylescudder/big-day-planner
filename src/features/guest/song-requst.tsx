import { Espoused, type Guest } from '@/server/db/schema'
import { SongRequestForm } from './song-request-form'

export function SongRequest(props: { guestData: Guest[]; espoused: Espoused }) {
  return (
    <div className='relative z-10 text-white'>
      <p className='pt-14 text-3xl'>song request</p>
      <p className='py-10 text-lg'>
        we wanna make sure there&apos;s at least one song you just can&apos;t
        help but dance to!
      </p>
      {props.guestData.map((guest, index) => (
        <SongRequestForm key={index} guest={guest} espoused={props.espoused} />
      ))}
      <div className='columns-2 pt-10'>
        <img
          alt='Song request illustration'
          src='/assets-song-request.svg'
          width={200}
          height={100}
          className='relative float-start h-auto pt-10'
        />
        <p className='-ms-16 text-lg'>
          check out the playlist you and all the other guests are creating{' '}
          <a className='text-primary'>here</a>
        </p>
      </div>
      <p className='float-end w-48 pb-10 text-right'>
        We kindly ask you to make your choices by 00/00/25
      </p>
    </div>
  )
}
