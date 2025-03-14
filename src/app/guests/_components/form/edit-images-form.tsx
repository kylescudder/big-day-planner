import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import UploadThingImageLogo from '@/components/ui/upload-thing'
import { ImageType } from '@/consts/image-types'
import { env } from '@/env'
import { Images } from '@/server/db/schema'
import { deleteImageRecord } from '@/server/service'
import { IconTrash } from '@tabler/icons-react'
import { useEffect, useState } from 'react'

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

  let displayedLogoImage = uploadedLogoImage || logoImage

  const rsvpImage = props.images.filter(
    (image) => image.type === ImageType.RSVP
  )[0]
  const footerImage = props.images.filter(
    (image) => image.type === ImageType.FOOTER
  )[0]

  const [uploadedRSVPImage, setUploadedRSVPImage] = useState<
    Images | undefined
  >(rsvpImage)
  const [uploadedFooterImage, setUploadedFooterImage] = useState<
    Images | undefined
  >(footerImage)

  const displayedRSVPImage = uploadedRSVPImage || rsvpImage
  const displayedFooterImage = uploadedFooterImage || footerImage

  const handleLogoUpload = (image: Images) => {
    setUploadedLogoImage(image)
    // Create a new array with all existing images plus the new one
    props.setUploadedImages([...props.images, image])
  }

  const handleRSVPUpload = (image: Images) => {
    setUploadedRSVPImage(image)
    props.setUploadedImages([...props.images, image])
  }
  const handleFooterUpload = (image: Images) => {
    setUploadedFooterImage(image)
    props.setUploadedImages([...props.images, image])
  }

  const deleteImage = (image: Images | undefined, type: ImageType) => {
    if (image != undefined) {
      if (type === ImageType.LOGO) {
        setUploadedLogoImage(undefined)
      } else if (type === ImageType.RSVP) {
        setUploadedRSVPImage(undefined)
      }
      deleteImageRecord(image)
    }
  }
  // Use useEffect to log the state when it changes
  useEffect(() => {
    console.log('Uploaded Logo Image:', uploadedLogoImage)
  }, [uploadedLogoImage])

  useEffect(() => {
    console.log('Uploaded RSVP Image:', uploadedRSVPImage)
  }, [uploadedRSVPImage])

  return (
    <div className='grid gap-4 p-4'>
      <div className='flex flex-col gap-4'>
        <div className='flex items-center'>
          <Label htmlFor='logo'>Logo</Label>
        </div>
        <div className='flex items-center justify-between'>
          <UploadThingImageLogo
            onUploadCompleteAction={handleLogoUpload}
            disabled={uploadedLogoImage !== undefined}
            type={ImageType.LOGO}
          />
          <div className='flex items-center gap-4'>
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
              onClick={() => deleteImage(displayedLogoImage, ImageType.LOGO)}
              aria-label='Delete logo image'
            >
              <IconTrash />
            </Button>
          </div>
        </div>

        <div className='flex items-center'>
          <Label htmlFor='rsvp'>RSVP</Label>
        </div>
        <div className='flex items-center justify-between'>
          <UploadThingImageLogo
            onUploadCompleteAction={handleRSVPUpload}
            disabled={uploadedRSVPImage !== undefined}
            type={ImageType.RSVP}
          />
          <div className='flex items-center gap-4'>
            {displayedRSVPImage && (
              <img
                src={`https://${env.NEXT_PUBLIC_UT_APP_ID}.ufs.sh/f/${displayedRSVPImage.key}`}
                alt='RSVP'
                className='w-24 h-24 object-contain'
              />
            )}
            <Button
              variant='outline'
              className={`ml-2 ${displayedRSVPImage == undefined ? `hidden` : ``}`}
              onClick={() => deleteImage(displayedRSVPImage, ImageType.RSVP)}
              aria-label='Delete RSVP image'
            >
              <IconTrash />
            </Button>
          </div>
        </div>

        <div className='flex items-center'>
          <Label htmlFor='footer'>Footer</Label>
        </div>
        <div className='flex items-center justify-between'>
          <UploadThingImageLogo
            onUploadCompleteAction={handleFooterUpload}
            disabled={uploadedFooterImage !== undefined}
            type={ImageType.FOOTER}
          />
          <div className='flex items-center gap-4'>
            {displayedFooterImage && (
              <img
                src={`https://${env.NEXT_PUBLIC_UT_APP_ID}.ufs.sh/f/${displayedFooterImage.key}`}
                alt='Footer'
                className='w-24 h-24 object-contain'
              />
            )}
            <Button
              variant='outline'
              className={`ml-2 ${displayedFooterImage == undefined ? `hidden` : ``}`}
              onClick={() =>
                deleteImage(displayedFooterImage, ImageType.FOOTER)
              }
              aria-label='Delete footer image'
            >
              <IconTrash />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
