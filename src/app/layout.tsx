import { Toaster } from '@/components/ui/sonner'
import '@/styles/globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import localFont from 'next/font/local'

// Font files can be colocated inside of `pages`
const cooperBlack = localFont({ src: '../styles/fonts/COOPBL.woff' })

export const metadata = {
  title: 'Big Day Planner',
  description: 'Plan your big day!',
  icons: [{ rel: 'icon', url: '/favicon.ico' }]
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body className={`${cooperBlack.className}`}>
        <ClerkProvider>
          <main className={`${cooperBlack.className} justify-center h-screen`}>
            {children}
            <Toaster />
          </main>
        </ClerkProvider>
      </body>
    </html>
  )
}
