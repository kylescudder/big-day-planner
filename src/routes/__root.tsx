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
import '@/styles/globals.css'

export const Route = createRootRoute({
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
  return (
    <ClerkProvider>
      <main className='justify-center h-screen'>
        <Outlet />
        <Toaster />
      </main>
    </ClerkProvider>
  )
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
