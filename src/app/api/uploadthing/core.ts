import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { UploadThingError } from 'uploadthing/server'
import { auth } from '@clerk/nextjs/server'

const f = createUploadthing()

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 1
    }
  })
    .middleware(async ({ req }) => {
      const user = await auth()
      if (!user) throw new UploadThingError('Unauthorized')

      return { userId: user.userId }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId)

      console.log('file url', file.url)

      return { uploadedBy: metadata.userId }
    }),
  logoUploader: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 1
    }
  })
    .middleware(async ({ req }) => {
      const user = await auth()

      if (!user.userId) throw new Error('Unauthorized')

      return { userId: user.userId }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId }
    })
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
