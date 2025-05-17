'use server'

import { getImagesRecord } from '@/server/service'
import { GuestKeyScreen } from './_components/guest-key-screen'
import { ImageType } from '@/consts/image-types'

export default async function HomePage() {
  const images = (await getImagesRecord()) || []
  // Pick the first image, or handle as needed
  const backgroundImage = images.find(
    (image) => image.type == ImageType.LANDING
  )
  if (backgroundImage == undefined) return

  return <GuestKeyScreen backgroundImage={backgroundImage} />
}
