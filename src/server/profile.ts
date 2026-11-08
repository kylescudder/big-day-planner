import '@tanstack/react-start/server-only'
import { db } from './db'
import { getBetterAuth } from './auth'
import { readAuthEnv } from './auth-env'
import { createProfileHandler } from './profile-handler'

// Profile photos exist only with Better Auth; Clerk keeps its own.
export function handleProfileRequest(request: Request) {
  const env = readAuthEnv()
  if (env.AUTH_PROVIDER !== 'better-auth')
    return new Response('Not found', { status: 404 })
  return createProfileHandler(db, {
    origin: new URL(env.BETTER_AUTH_URL!).origin,
    allowedEmails: env.AUTH_ALLOWED_EMAILS,
    getSession: (headers) => getBetterAuth().api.getSession({ headers })
  })(request)
}
