import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

type RuntimeEnv = Record<string, string | undefined>

const origin = z
  .url()
  .refine((value) => {
    if (!URL.canParse(value)) return false
    const url = new URL(value)
    return (
      ['http:', 'https:'].includes(url.protocol) &&
      !url.username &&
      !url.password &&
      url.pathname === '/' &&
      !url.search &&
      !url.hash
    )
  })
  .transform((value) => new URL(value).origin)

/**
 * Sign-in provider settings, read at runtime rather than during the
 * secret-free production build. Clerk stays the default and the rollback;
 * Better Auth settings are required only when it is selected.
 */
export function readAuthEnv(runtimeEnv: RuntimeEnv = process.env) {
  const env = createEnv({
    server: {
      AUTH_PROVIDER: z.enum(['clerk', 'better-auth']).default('clerk'),
      BETTER_AUTH_URL: origin.optional(),
      BETTER_AUTH_SECRET: z.string().min(32).optional(),
      BREVO_API_KEY: z.string().min(1).optional(),
      AUTH_EMAIL_FROM: z.email().optional(),
      AUTH_EMAIL_DAILY_LIMIT: z.coerce
        .number()
        .int()
        .min(1)
        .max(300)
        .default(40),
      AUTH_ALLOWED_EMAILS: z
        .string()
        .default('')
        .transform((value) =>
          value
            .split(',')
            .map((entry) => entry.trim().toLowerCase())
            .filter(Boolean)
        )
        .pipe(z.array(z.email())),
      NODE_ENV: z
        .enum(['development', 'test', 'production'])
        .default('development')
    },
    runtimeEnv,
    emptyStringAsUndefined: true,
    onValidationError(issues): never {
      // Report setting names only; secrets must never appear in startup logs.
      throw new Error(
        'Invalid environment variables: ' +
          issues.map((issue) => issue.path?.join('.')).join(', ')
      )
    }
  })
  if (env.AUTH_PROVIDER === 'better-auth') {
    const missing: string[] = (
      [
        'BETTER_AUTH_URL',
        'BETTER_AUTH_SECRET',
        'BREVO_API_KEY',
        'AUTH_EMAIL_FROM'
      ] as const
    ).filter((key) => !env[key])
    if (!env.AUTH_ALLOWED_EMAILS.length) missing.push('AUTH_ALLOWED_EMAILS')
    if (missing.length)
      throw new Error('Invalid environment variables: ' + missing.join(', '))
    if (
      env.NODE_ENV === 'production' &&
      !env.BETTER_AUTH_URL!.startsWith('https://')
    )
      throw new Error('Invalid environment variables: BETTER_AUTH_URL')
  }
  return env
}
