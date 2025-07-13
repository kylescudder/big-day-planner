import { Toaster } from '@/components/ui/sonner'
import '@/styles/globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import localFont from 'next/font/local'
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin'
import { extractRouterConfig } from 'uploadthing/server'

import { ourFileRouter } from '@/app/api/uploadthing/core'

// Font files can be colocated inside of `pages`
const cooperBlack = localFont({ src: '../styles/fonts/COOPBL.woff' })

export const metadata = {
  title: 'Big Day Planner',
  description: 'Plan your big day!'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' suppressHydrationWarning={true}>
      <head>
        <link rel='icon' href='/favicon.ico' sizes='any' />
        <title>Big Day Planner</title>
      </head>
      <body className={`${cooperBlack.className}`}>
        <ClerkProvider dynamic>
          <main className={`${cooperBlack.className} justify-center h-screen`}>
            <NextSSRPlugin
              /**
               * The `extractRouterConfig` will extract **only** the route configs
               * from the router to prevent additional information from being
               * leaked to the client. The data passed to the client is the same
               * as if you were to fetch `/api/uploadthing` directly.
               */
              routerConfig={extractRouterConfig(ourFileRouter)}
            />
            {children}
            <Toaster />
          </main>
        </ClerkProvider>
      </body>
    </html>
  )
}
