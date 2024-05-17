import { type Guest } from '@/server/db/schema'
import { SongRequestForm } from './song-request-form'

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
    </div>
  )
}
