import { createFileRoute, Link, Navigate } from '@tanstack/react-router'

import { Auth } from '@/components/auth/auth'
import { BetterAuthUIProvider } from '@/components/better-auth-ui-provider'

export const Route = createFileRoute('/auth/$path')({ component: AuthPage })

function AuthPage() {
  const { path } = Route.useParams()
  // Only the couple sign in, so accounts are never self-registered.
  if (path === 'sign-up')
    return <Navigate to='/auth/$path' params={{ path: 'sign-in' }} replace />
  return (
    <div className='bg-pink min-h-screen px-4 py-8 sm:px-8'>
      <header className='mx-auto flex max-w-sm items-center justify-center'>
        <Link to='/' aria-label='Big Day Planner home'>
          <img alt='' src='/logo.svg' height={56} width={122} />
        </Link>
      </header>
      <div className='mx-auto mt-8 flex w-full max-w-sm flex-col items-center gap-6 sm:mt-12'>
        <BetterAuthUIProvider>
          <Auth path={path} className='w-full text-left font-sans' />
        </BetterAuthUIProvider>
        <p className='text-foreground/80 text-center font-sans text-sm'>
          Here to RSVP? You don’t need to sign in.{' '}
          <Link to='/' className='text-primary underline underline-offset-4'>
            Enter your invitation code
          </Link>
        </p>
      </div>
    </div>
  )
}
