import Image from 'next/image'
import { MenuForm } from './menu-form'
import { type Guest } from '@/server/db/schema'

export function Menu(props: {
  guestData: Guest[]
  starters: string[]
  mains: string[]
  puddings: string[]
}) {
  console.log(props.starters)
  console.log(props.mains)
  console.log(props.puddings)

  return (
    <>
      <Image
        alt='Pink Splatter 3'
        src='/assets-shape-menu&song.svg'
        width={100}
        height={100}
        className='float-start h-auto absolute block right-0 top-300 z-0'
      />
      <p className='text-3xl pt-14'>menu</p>
      <MenuForm
        guestData={props.guestData}
        starters={props.starters}
        mains={props.mains}
        puddings={props.puddings}
      />
    </>
  )
}
