import '@tanstack/react-start/server-only'
import { auth } from '@clerk/tanstack-react-start/server'

import { readAuthEnv } from './auth-env'
import { getBetterAuth } from './auth'
import { isVerifiedAllowedUser } from './auth-policy'

/**
 * The signed-in planner's user ID from the selected provider's verified
 * session, never from request input. With Clerk this is Clerk's user ID, as
 * before. With Better Auth it is the Better Auth user ID, and only for a
 * verified email that is still on AUTH_ALLOWED_EMAILS.
 */
export async function sessionUserId(headers: Headers): Promise<string | null> {
  const env = readAuthEnv()
  if (env.AUTH_PROVIDER === 'clerk') return (await auth()).userId
  const session = await getBetterAuth().api.getSession({ headers })
  return isVerifiedAllowedUser(session?.user, env.AUTH_ALLOWED_EMAILS)
    ? session!.user.id
    : null
}
