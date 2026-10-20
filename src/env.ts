import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

/**
 * Server-only configuration, validated on first use. Run with
 * `SKIP_ENV_VALIDATION=1` for builds that do not need runtime secrets.
 */
export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    DATABASE_PASSWORD_FILE: z.string().optional(),
    GETADDRESS_URL: z.string().url().optional(),
    GETADDRESS_API_KEY: z.string().optional(),
    RESEND_API_KEY: z.string(),
    EMAIL_FROM_ADDRESS: z.string().email(),
    SONG_REQUEST_EMAIL: z.string().email(),
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development')
  },
  runtimeEnv: process.env,
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true
})
