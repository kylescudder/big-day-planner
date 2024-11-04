import TopBar from '@/app/guests/_components/top-bar'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from 'next-themes'

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
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
          <div className='w-full h-full p-6 md:max-w-7xl'>
            {children}
            <Toaster />
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}
