import React, { lazy, Suspense } from 'react'
import { useLoaderData } from '@tanstack/react-router'
import SignOut from '@/components/sign-out'
import SiteTitle from '@/components/site-title'
import { ModeToggle } from '@/components/ui/dark-mode-toggle'
import { Separator } from '@/components/ui/separator'

// Loaded only on signed-in pages, keeping the auth UI out of guest pages.
const BetterAuthUserMenu = lazy(() =>
  import('@/components/better-auth-user-menu').then(
    ({ BetterAuthUserMenu }) => ({ default: BetterAuthUserMenu })
  )
)

const TopBar = (props: { authed?: boolean }) => {
  const { provider } = useLoaderData({ from: '__root__' })
  return (
    <section className='flex w-full justify-between border-zinc-400 p-6'>
      <div className='flex-row items-center'>
        <SiteTitle />
      </div>
      <div className='flex items-center'>
        <ModeToggle />
        {props.authed && (
          <>
            <Separator orientation='vertical' />
            {provider === 'better-auth' ? (
              <div className='pl-4'>
                <Suspense
                  fallback={
                    <span className='bg-muted block size-8 rounded-full' />
                  }
                >
                  <BetterAuthUserMenu />
                </Suspense>
              </div>
            ) : (
              <SignOut />
            )}
          </>
        )}
      </div>
    </section>
  )
}

export default TopBar
