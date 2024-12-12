import { Label } from '@/components/ui/label'
import UploadThingImageLogo from '@/components/ui/upload-thing'
import { ImageType } from '@/consts/image-types'
import { uuidv4 } from '@/lib/utils'
import { Image } from '@/server/db/schema'
import { useState } from 'react'

export function EditImagesForm(props: { images: Image[] }) {
  const logoImage = props.images.filter(
    (image) => image.type === ImageType.LOGO
  )[0]

  const [uploadedLogoImage, setUploadedLogoImage] = useState<Image | undefined>(
    logoImage
  )

  const displayedLogoImage = uploadedLogoImage || logoImage

  return (
    <div className='grid gap-4 p-4'>
      <Label htmlFor='logo'>Logo</Label>
      <div className='flex items-center justify-between gap-4'>
        <UploadThingImageLogo
          onUploadCompleteAction={setUploadedLogoImage}
          disabled={uploadedLogoImage !== undefined}
        />
        {displayedLogoImage && (
          <img
            src={`https://utfs.io/f/${displayedLogoImage.key}`}
            alt='Logo'
            className='w-24 h-24 object-contain'
          />
        )}
      </div>
    </div>
  )
}
