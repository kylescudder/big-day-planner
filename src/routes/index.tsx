import { createFileRoute } from '@tanstack/react-router'

import { ImageType } from '@/consts/image-types'
import { GuestKeyScreen } from '@/features/home/guest-key-screen'
import { getHomePageData } from '@/server/service'

export const Route = createFileRoute('/')({
  loader: () => getHomePageData(),
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
