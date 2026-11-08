import '@tanstack/react-start/server-only'
import { readAuthEnv } from './auth-env'
import { getBetterAuth } from './auth'
import { isVerifiedAllowedUser } from './auth-policy'

/**
 * The signed-in planner's Better Auth user ID from the verified session, never
 * from request input, and only for a verified email that is still on
 * AUTH_ALLOWED_EMAILS.
 */
export async function sessionUserId(headers: Headers): Promise<string | null> {
  const env = readAuthEnv()
  const session = await getBetterAuth().api.getSession({ headers })
  return isVerifiedAllowedUser(session?.user, env.AUTH_ALLOWED_EMAILS)
    ? session!.user.id
    : null
}
