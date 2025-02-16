import Image from 'next/image'
import { Timing } from '@/server/db/schema'

export function Timings(props: { timings: Timing[] }) {
  return (
    <div className='relative z-10'>
      <p className='text-3xl pt-14'>Timings</p>
      <p className='text-lg pt-10'>
        Here are some of the timing guidelines for throughout the day
      </p>
      <div className='text-lg mx-auto'>
        {props.timings.map((timing, index) => (
          <div
            key={index}
            className={`flex items-center pb-5 ${
              index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
            }`}
          >
            <div className='flex-col col-span-1'>
              <p className='text-lg'>{timing.event}</p>
              <p className='text-xs font-extralight'>{timing.time}</p>
            </div>
            <div className='flex-col col-span-1'>
              <Image
                alt='Ring illustration'
                src='/assets-timings.svg'
                width={100}
                height={100}
                className={index % 2 === 0 ? 'ml-auto' : 'mr-auto'}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
