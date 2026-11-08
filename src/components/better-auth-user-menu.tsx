import { UserRound } from 'lucide-react'

import { BetterAuthUIProvider } from '@/components/better-auth-ui-provider'
import { UserButton } from '@/components/auth/user/user-button'

// Loaded only for signed-in planners, keeping the auth UI out of guest pages.
export function BetterAuthUserMenu() {
  return (
    <BetterAuthUIProvider>
      <UserButton
        size='icon'
        align='end'
        hideSettings
        className='ring-primary/40 hover:ring-primary/70 ring-2'
        links={[
          {
            label: 'Profile',
            href: '/profile',
            icon: <UserRound />,
            visibility: 'authenticated'
          }
        ]}
      />
    </BetterAuthUIProvider>
  )
}
