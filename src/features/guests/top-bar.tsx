import React from 'react'
import SignOut from '@/components/sign-out'
import SiteTitle from '@/components/site-title'
import { ModeToggle } from '@/components/ui/dark-mode-toggle'
import { Separator } from '@/components/ui/separator'

const TopBar = (props: { authed?: boolean }) => {
  return (
    <section className='border-zinc-400 p-6 w-full flex justify-between'>
      <div className='flex-row items-center'>
        <SiteTitle />
      </div>
      <div className='flex items-center'>
        <ModeToggle />
        {props.authed && (
          <>
            <Separator orientation='vertical' />
            <SignOut />
          </>
        )}
      </div>
    </section>
  )
}

export default TopBar
