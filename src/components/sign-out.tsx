import { SignOutButton, SignedIn } from '@clerk/nextjs'
import { IconLogout } from '@tabler/icons-react'

export default function Logout() {
  return (
    <div className='pl-4'>
      <SignedIn>
        <SignOutButton redirectUrl='/sign-in'>
          <div className='flex align-middle cursor-pointer'>
            <IconLogout
              size={24}
              className='text-foreground'
              stroke={2}
              strokeLinejoin='miter'
            />
            <p className='text-foreground max-lg:hidden font-black pl-3'>
              Sign Out
            </p>
          </div>
        </SignOutButton>
      </SignedIn>
    </div>
  )
}
