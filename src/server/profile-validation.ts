import { z } from 'zod'

export const avatarPath = '/api/profile/avatar'
// A new version on every upload, so browsers never show a stale photo.
export const avatarUrl = (version: string) => avatarPath + '?v=' + version

// Profile edits are limited to names and the server-owned photo URL. The
// verified email cannot be changed from the profile. The auth hook also checks
// that an image value matches the photo stored for that user.
export const profileUpdateSchema = z
  .strictObject({
    name: z.string().trim().min(1).max(120).optional(),
    givenName: z
      .string()
      .trim()
      .max(100)
      .nullable()
      .transform((value) => value ?? '')
      .optional(),
    familyName: z
      .string()
      .trim()
      .max(100)
      .nullable()
      .transform((value) => value ?? '')
      .optional(),
    image: z.string().max(200).nullable().optional()
  })
  .refine((value) => Object.keys(value).length > 0)
