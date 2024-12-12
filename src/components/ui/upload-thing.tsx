'use client'
import { useState } from 'react'
import { UploadButton } from '@/utils/uploadthing'
import { twMerge } from 'tailwind-merge'
import { Image } from '@/server/db/schema'
import { uuidv4 } from '@/lib/utils'
import { ImageType } from '@/consts/image-types'

interface UploadThingImageLogoProps {
  onUploadCompleteAction: (image: Image) => void
  disabled?: boolean
}

export default function UploadThingImageLogo({
  onUploadCompleteAction,
  disabled = false
}: UploadThingImageLogoProps) {
  const [isUploaded, setIsUploaded] = useState(false)

  return (
    <main className='flex flex-col items-center justify-between'>
      {!isUploaded ? (
        <UploadButton
          disabled={disabled}
          appearance={{
            button:
              'ut-ready:bg-primary ut-uploading:cursor-not-allowed rounded-r-none bg-primary bg-none after:bg-secondary',
            container: 'w-max flex-row rounded-md border-cyan-300 bg-slate-800',
            allowedContent:
              'flex h-8 flex-col items-center justify-center px-2 text-white'
          }}
          endpoint='logoUploader'
          onClientUploadComplete={(res) => {
            console.log('Files: ', res)
            const uploadedImage: Image = {
              id: uuidv4(),
              key: res[0]!.key,
              type: ImageType.LOGO
              // Add other required Image properties here
            }
            onUploadCompleteAction(uploadedImage)
            setIsUploaded(true)
          }}
          onUploadError={(error: Error) => {
            alert(`ERROR! ${error.message}`)
          }}
          config={{ cn: twMerge }}
        />
      ) : (
        <div className='text-green-600 font-medium'>Upload complete!</div>
      )}
    </main>
  )
}
