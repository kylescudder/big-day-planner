import Image from 'next/image'

export function Timings() {
  return (
    <div>
      <p className='text-3xl pt-14'>timings</p>
      <p className=' text-lg pt-10'>
        here are some of the timing guidelines for throughout the day
      </p>
      <div className='text-lg w-4/5 mx-auto'>
        <div className='flex flex-row items-center pb-5'>
          <div className='flex-col col-span-1'>
            <p className='text-lg w-50 flex'>wedding ceremony</p>
            <p className='text-xs font-extralight'>2pm</p>
          </div>
          <div className='flex-col col-span-1'>
            <Image
              alt='Ring illustration'
              src='/assets-timings.svg'
              width={100}
              height={100}
              className='ml-auto w-50'
            />
          </div>
        </div>

        <div className='flex items-center flex-row-reverse pb-5'>
          <div className='flex-col col-span-1'>
            <p className='text-lg w-50'>cocktail hour</p>
            <p className='text-xs font-extralight'>3pm</p>
          </div>
          <div className='flex-col col-span-1'>
            <Image
              alt='Ring illustration'
              src='/assets-timings.svg'
              width={100}
              height={100}
              className='mr-auto w-50'
            />
          </div>
        </div>

        <div className='flex flex-row items-center pb-5'>
          <div className='flex-col col-span-1'>
            <p className='text-lg'>dinner & toasts</p>
            <p className='text-xs font-extralight'>5pm</p>
          </div>
          <div className='flex-col col-span-1'>
            <Image
              alt='Ring illustration'
              src='/assets-timings.svg'
              width={100}
              height={100}
              className='ml-auto'
            />
          </div>
        </div>

        <div className='flex items-center flex-row-reverse pb-5'>
          <div className='flex-col col-span-1'>
            <p className='text-lg'>party begins</p>
            <p className='text-xs font-extralight'>6pm</p>
          </div>
          <div className='flex-col col-span-1'>
            <Image
              alt='Ring illustration'
              src='/assets-timings.svg'
              width={100}
              height={100}
              className='mr-auto'
            />
          </div>
        </div>
        <div className='flex flex-row items-center pb-5'>
          <div className='flex-col col-span-1'>
            <p className='text-lg'>farewell to mr & mrs</p>
            <p className='text-xs font-extralight'>midnight</p>
          </div>
          <div className='flex-col col-span-1'>
            <Image
              alt='Ring illustration'
              src='/assets-timings.svg'
              width={100}
              height={100}
              className='ml-auto'
            />
          </div>
        </div>
      </div>
    </div>
  )
}
