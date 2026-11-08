import '@tanstack/react-start/server-only'
import { db } from './db'
import { getBetterAuth } from './auth'
import { readAuthEnv } from './auth-env'
import { createProfileHandler } from './profile-handler'

export function handleProfileRequest(request: Request) {
  const env = readAuthEnv()
  return createProfileHandler(db, {
    origin: new URL(env.BETTER_AUTH_URL!).origin,
    allowedEmails: env.AUTH_ALLOWED_EMAILS,
    getSession: (headers) => getBetterAuth().api.getSession({ headers })
  })(request)
}
