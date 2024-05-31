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
      <p className='text-3xl pt-14'>menu</p>
      <MenuForm
        guestData={props.guestData}
        starters={props.starters}
        mains={props.mains}
        puddings={props.puddings}
      />
      <Image
        alt='Pink Splatter 3'
        src='/assets-shape-menu&song.svg'
        width={100}
        height={100}
        className='float-start h-auto absolute block right-0 top-600 z-0'
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
    </>
  )
}
