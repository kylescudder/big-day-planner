import { Show, SignOutButton } from '@clerk/tanstack-react-start'
import { IconLogout } from '@tabler/icons-react'

export default function Logout() {
  return (
    <div className='pl-4'>
      <Show when='signed-in'>
        <SignOutButton redirectUrl='/sign-in'>
          <div className='flex cursor-pointer align-middle'>
            <IconLogout
              size={24}
              className='text-foreground'
              stroke={2}
              strokeLinejoin='miter'
            />
            <p className='text-foreground pl-3 font-black max-lg:hidden'>
              Sign Out
            </p>
          </div>
        </SignOutButton>
      </Show>
    </div>
  )
}
