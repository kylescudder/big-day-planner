import { useQueryClient } from '@tanstack/react-query'
import {
  createFileRoute,
  Link,
  Navigate,
  useLoaderData,
  useNavigate
} from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { Passkeys } from '@/components/auth/passkey/passkeys'
import { UserProfile } from '@/components/auth/settings/account/user-profile'
import { ChangePassword } from '@/components/auth/settings/security/change-password'
import { Button } from '@/components/auth/ui/button'
import { BetterAuthUIProvider } from '@/components/better-auth-ui-provider'
import { authClient } from '@/lib/auth-client'
import { clearPendingSignIn } from '@/lib/pending-sign-in'

export const Route = createFileRoute('/profile')({ component: ProfilePage })

function ProfilePage() {
  const { provider } = useLoaderData({ from: '__root__' })
  // Clerk manages its own account settings; this page is Better Auth only.
  if (provider !== 'better-auth') return <Navigate to='/guests' replace />
  return (
    <div className='bg-pink min-h-screen px-4 py-8 sm:px-8'>
      <div className='mx-auto w-full max-w-3xl'>
        <Link
          to='/guests'
          className='text-primary font-sans underline underline-offset-4'
        >
          Back to your guests
        </Link>
        <h1 className='text-primary mt-6 mb-8 text-3xl'>Your profile</h1>
        <BetterAuthUIProvider redirectTo='/profile'>
          <BetterAuthProfile />
        </BetterAuthUIProvider>
      </div>
    </div>
  )
}

function BetterAuthProfile() {
  const { data: session, isPending } = authClient.useSession()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [signingOut, setSigningOut] = useState(false)
  useEffect(() => {
    if (session) clearPendingSignIn()
    else if (!isPending)
      void navigate({
        href: '/auth/sign-in?redirectTo=%2Fprofile',
        replace: true
      })
  }, [isPending, navigate, session])
  if (!session)
    return (
      <p role='status' className='font-sans'>
        Checking sign-in…
      </p>
    )
  async function signOut() {
    setSigningOut(true)
    setError('')
    try {
      const result = await authClient.signOut()
      if (result.error) {
        setError('Unable to sign out. Please try again.')
        return
      }
      queryClient.clear()
      await navigate({ to: '/' })
    } catch {
      setError('Unable to sign out. Please try again.')
    } finally {
      setSigningOut(false)
    }
  }
  return (
    <div className='font-sans'>
      <UserProfile key={session.user.id} />
      <div className='mt-8'>
        <ChangePassword />
      </div>
      <Passkeys className='mt-8' />
      <p className='text-foreground/80 mt-4 text-sm'>
        Email codes remain available for recovery.
      </p>
      {error && (
        <p role='alert' className='text-destructive mt-6'>
          {error}
        </p>
      )}
      <Button
        type='button'
        variant='outline'
        disabled={signingOut}
        onClick={() => void signOut()}
        className='mt-8'
      >
        {signingOut ? 'Signing out…' : 'Sign out'}
      </Button>
    </div>
  )
}
