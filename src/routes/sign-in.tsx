import { SignIn } from '@clerk/tanstack-react-start'
import { createFileRoute, redirect } from '@tanstack/react-router'

import { getAuthConfig } from '@/lib/auth-config'

export const Route = createFileRoute('/sign-in')({
  // Better Auth has its own sign-in screens; Clerk keeps this page.
  beforeLoad: async () => {
    if ((await getAuthConfig()).provider === 'better-auth')
      throw redirect({ to: '/auth/$path', params: { path: 'sign-in' } })
  },
  component: SignInPage
})

function SignInPage() {
  return (
    <div className='flex min-h-screen items-center justify-center p-6'>
      <SignIn routing='hash' forceRedirectUrl='/guests' />
    </div>
  )
}
