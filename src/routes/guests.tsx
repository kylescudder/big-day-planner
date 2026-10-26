import { createFileRoute, redirect } from '@tanstack/react-router'
import { ThemeProvider } from 'next-themes'

import { Toaster } from '@/components/ui/sonner'
import Guests from '@/features/guests/guests'
import TopBar from '@/features/guests/top-bar'
import { trpc } from '@/lib/trpc'

export const Route = createFileRoute('/guests')({
  beforeLoad: async () => {
    if (!(await trpc.session.query()).userId) throw redirect({ to: '/sign-in' })
  },
  loader: () => trpc.guestsPage.query(),
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
