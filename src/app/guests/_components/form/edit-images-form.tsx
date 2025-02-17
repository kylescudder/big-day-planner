import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import UploadThingImageLogo from '@/components/ui/upload-thing'
import { ImageType } from '@/consts/image-types'
import { env } from '@/env'
import { Images } from '@/server/db/schema'
import { deleteImageRecord } from '@/server/service'
import { IconTrash } from '@tabler/icons-react'
import { useState } from 'react'

export function EditImagesForm(props: {
  images: Images[]
  setUploadedImages: (images: Images[]) => void
}) {
  const logoImage = props.images.filter(
    (image) => image.type === ImageType.LOGO
  )[0]

  const [uploadedLogoImage, setUploadedLogoImage] = useState<
    Images | undefined
  >(logoImage)

  const displayedLogoImage = uploadedLogoImage || logoImage

  const rsvpImage = props.images.filter(
    (image) => image.type === ImageType.RSVP
  )[0]

  const [uploadedRSVPImage, setUploadedRSVPImage] = useState<
    Images | undefined
  >(rsvpImage)

  const displayedRSVPImage = uploadedRSVPImage || rsvpImage

  const handleLogoUpload = (image: Images) => {
    setUploadedLogoImage(image)
    props.setUploadedImages((prev) => [...prev, image]) // Add to uploaded images
  }

  const handleRSVPUpload = (image: Images) => {
    setUploadedRSVPImage(image)
    props.setUploadedImages((prev) => [...prev, image]) // Add to uploaded images
  }

  const deleteImage = (image: Images | undefined) => {
    if (image != undefined) {
      deleteImageRecord(image)
    }
  }

  return (
    <div className='grid gap-4 p-4'>
      <div className='flex flex-col gap-4'>
        <div className='flex items-center gap-4'>
          <Label htmlFor='logo'>Logo</Label>
          <UploadThingImageLogo
            onUploadCompleteAction={handleLogoUpload}
            disabled={uploadedLogoImage !== undefined}
            type={ImageType.LOGO}
          />
          {displayedLogoImage && (
            <img
              src={`https://${env.NEXT_PUBLIC_UT_APP_ID}.ufs.sh/f/${displayedLogoImage.key}`}
              alt='Logo'
              className='w-24 h-24 object-contain'
            />
          )}
          <Button
            variant='outline'
            className={`ml-2 ${displayedLogoImage == undefined ? `hidden` : ``}`}
            onClick={() => deleteImage(displayedLogoImage)}
            aria-label='Delete timing'
          >
            <IconTrash />
          </Button>
        </div>

        <div className='flex items-center gap-4'>
          <Label htmlFor='rsvp'>RSVP</Label>
          <UploadThingImageLogo
            onUploadCompleteAction={handleRSVPUpload}
            disabled={uploadedRSVPImage !== undefined}
            type={ImageType.RSVP}
          />
          {displayedRSVPImage && (
            <img
              src={`https://${env.NEXT_PUBLIC_UT_APP_ID}.ufs.sh/f/${displayedRSVPImage.key}`}
              alt='Logo'
              className='w-24 h-24 object-contain'
            />
          )}
          <Button
            variant='outline'
            className={`ml-2 ${displayedRSVPImage == undefined ? `hidden` : ``}`}
            onClick={() => deleteImage(displayedRSVPImage)}
            aria-label='Delete timing'
          >
            <IconTrash />
          </Button>
        </div>
      </div>
    </div>
  )
}
