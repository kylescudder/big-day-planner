import {
  createUploadthing,
  UploadThingError,
  type FileRouter
} from 'uploadthing/server'

import { sessionUserId } from './auth-session'

const f = createUploadthing()

// Uploads need a signed-in planner from the selected provider. uploadedBy is
// the Clerk user ID under Clerk and the Better Auth user ID under Better Auth.
export async function requireUploader({ req }: { req: Request }) {
  const userId = await sessionUserId(req.headers)
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
