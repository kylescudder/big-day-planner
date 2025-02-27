import Image from 'next/image'
import { MenuForm } from './menu-form'
import {
  type Pudding,
  type Main,
  type Starter,
  type Guest
} from '@/server/db/schema'

export function Menu(props: {
  guestData: Guest[]
  starters: Starter[]
  mains: Main[]
  puddings: Pudding[]
}) {
  return (
    <>
      <p className='text-5xl pt-14'>menu</p>
      <div className='grid gap-4 mt-10 p-2 border-primary border-4 rounded-2xl'>
        <MenuForm
          guestData={props.guestData}
          starters={props.starters}
          mains={props.mains}
          puddings={props.puddings}
        />
        <div className='columns-2 pt-10'>
          <Image
            alt='Menu illustration'
            src='/assets-menu-choice.svg'
            width={150}
            height={150}
          />
          <p className='pt-28 pr-12 text-right -ms-16 relative z-10'>
            We kindly ask you to make your choices by 00/00/25
          </p>
        </div>
      </div>
    </>
  )
}
