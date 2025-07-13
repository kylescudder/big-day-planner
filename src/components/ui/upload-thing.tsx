'use client'
import { useState } from 'react'
import { UploadButton } from '@/utils/uploadthing'
import { twMerge } from 'tailwind-merge'
import { cn, uuidv4 } from '@/lib/utils'
import { ImageType } from '@/consts/image-types'
import { Images } from '@/server/db/schema'

interface UploadThingImageLogoProps {
  className?: string | undefined
  onUploadCompleteAction: (image: Images) => void
  disabled?: boolean
  type: ImageType
}

export default function UploadThingImage({
  className,
  onUploadCompleteAction,
  disabled = false,
  type
}: UploadThingImageLogoProps) {
  const [isUploaded, setIsUploaded] = useState(false)

  return (
    <main className={cn('flex flex-col ', className)}>
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
          const uploadedImage: Images = {
            id: uuidv4(),
            key: res[0]!.key,
            type: type
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
    </main>
  )
}
