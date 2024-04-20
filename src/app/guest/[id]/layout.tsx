import TopBar from './_components/top-bar'

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <TopBar />
      {children}
    </div>
  )
}
