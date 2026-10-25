import { auth } from '@clerk/tanstack-react-start/server'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { ThemeProvider } from 'next-themes'

import { Toaster } from '@/components/ui/sonner'
import Guests from '@/features/guests/guests'
import TopBar from '@/features/guests/top-bar'
import { getGuestsPageData } from '@/server/service'

const getSignedInUser = createServerFn({ method: 'GET' }).handler(
  async () => (await auth()).userId
)

export const Route = createFileRoute('/guests')({
  beforeLoad: async () => {
    if (!(await getSignedInUser())) throw redirect({ to: '/sign-in' })
  },
  loader: () => getGuestsPageData(),
  component: GuestsPage
})

function GuestsPage() {
  const data = Route.useLoaderData()
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='system'
      enableSystem
      disableTransitionOnChange
    >
      <div>
        <TopBar authed={true} />
        <div className='flex items-center justify-center'>
          <div className='h-full w-full p-6 md:max-w-7xl'>
            <div>
              <Guests {...data} />
            </div>
            <Toaster />
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}
