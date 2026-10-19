import { auth } from '@clerk/tanstack-react-start/server'
import {
  createUploadthing,
  UploadThingError,
  type FileRouter
} from 'uploadthing/server'

const f = createUploadthing()

async function requireUploader() {
  const { userId } = await auth()
  if (!userId)
    throw new UploadThingError({ code: 'FORBIDDEN', message: 'Unauthorized' })
  return { userId }
}

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 1
    }
  })
    .middleware(requireUploader)
    .onUploadComplete(async ({ metadata }) => {
      return { uploadedBy: metadata.userId }
    }),
  logoUploader: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 1
    }
  })
    .middleware(requireUploader)
    .onUploadComplete(async ({ metadata }) => {
      return { uploadedBy: metadata.userId }
    })
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
