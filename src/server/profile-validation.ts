import { z } from 'zod'

// Profile edits are limited to names. There is no avatar storage, and the
// verified email cannot be changed from the profile.
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
      .optional()
  })
  .refine((value) => Object.keys(value).length > 0)
