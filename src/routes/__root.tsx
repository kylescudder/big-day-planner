/// <reference types="vite/client" />
import { ClerkProvider } from '@clerk/tanstack-react-start'
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute
} from '@tanstack/react-router'
import type { ReactNode } from 'react'

import { Toaster } from '@/components/ui/sonner'
import { getAuthConfig } from '@/lib/auth-config'
import '@/styles/globals.css'

export const Route = createRootRoute({
  // The sign-in provider only changes when the container restarts.
  loader: () => getAuthConfig(),
  staleTime: Infinity,
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Big Day Planner' },
      { name: 'description', content: 'Plan your big day!' }
    ],
    links: [{ rel: 'icon', href: '/favicon.ico', sizes: 'any' }]
  }),
  component: RootComponent,
  shellComponent: RootDocument
})

function RootComponent() {
  const { provider } = Route.useLoaderData()
  const page = (
    <main className='h-screen justify-center'>
      <Outlet />
      <Toaster />
    </main>
  )
  return provider === 'clerk' ? <ClerkProvider>{page}</ClerkProvider> : page
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
