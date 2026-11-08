import '@tanstack/react-start/server-only'
import { db } from './db'
import { readAuthEnv } from './auth-env'
import { createBigDayPlannerAuth } from './auth-factory'
import { sendLinkEmail, sendLoginEmail } from './auth-email'

let instance: ReturnType<typeof createBigDayPlannerAuth> | undefined

export function getBetterAuth() {
  if (instance) return instance
  const env = readAuthEnv()
  if (env.AUTH_PROVIDER !== 'better-auth')
    throw new Error('Better Auth is not enabled')
  const origin = new URL(env.BETTER_AUTH_URL!).origin
  const mail = { apiKey: env.BREVO_API_KEY!, from: env.AUTH_EMAIL_FROM! }
  instance = createBigDayPlannerAuth(
    db,
    {
      baseURL: env.BETTER_AUTH_URL!,
      secret: env.BETTER_AUTH_SECRET!,
      allowedEmails: env.AUTH_ALLOWED_EMAILS,
      dailyEmailLimit: env.AUTH_EMAIL_DAILY_LIMIT
    },
    (email, otp) => sendLoginEmail(mail, origin, email, otp),
    (email, kind, url) => sendLinkEmail(mail, origin, email, kind, url)
  )
  return instance
}
