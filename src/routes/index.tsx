import { createFileRoute } from '@tanstack/react-router'

import { ImageType } from '@/consts/image-types'
import { GuestKeyScreen } from '@/features/home/guest-key-screen'
import { trpc } from '@/lib/trpc'

export const Route = createFileRoute('/')({
  loader: () => trpc.home.query(),
  component: HomePage
})

function HomePage() {
  const { images } = Route.useLoaderData()
  const backgroundImage = images.find(
    (image) => image.type == ImageType.LANDING
  )
  if (backgroundImage == undefined) return null

  return <GuestKeyScreen backgroundImage={backgroundImage} />
}
