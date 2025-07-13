import { Timing } from '@/server/db/schema'
import { format } from 'date-fns'
import { env } from '@/env'

export function Timings(props: { timings: Timing[] | null }) {
  if (props.timings != null) {
    return (
      <div className='relative z-10'>
        <div className='text-lg mx-auto text-center pt-7'>
          {props.timings.map((timing, index) => (
            <div key={index} className='pb-5'>
              <div className='flex justify-center'>
                <img
                  alt={timing.altText ?? ''}
                  src={`https://${env.NEXT_PUBLIC_UT_APP_ID}.ufs.sh/f/${timing.imageUrl}`}
                  width={150}
                  height={150}
                  className='mx-auto'
                />
              </div>
              <div className='flex flex-col items-center'>
                <p className='text-3xl'>
                  {format(new Date(timing.time), 'ha').toLowerCase()}
                </p>
                <p className='text-lg'>{timing.event}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
}
