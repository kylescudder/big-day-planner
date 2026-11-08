import '@tanstack/react-start/server-only'
import { getBetterAuth } from './auth'

// Only the endpoints the sign-in, profile and passkey screens use. Sign-up,
// email change and every other Better Auth endpoint stay unreachable.
const paths = new Set([
  '/get-session',
  '/sign-out',
  '/update-user',
  '/email-otp/send-verification-otp',
  '/sign-in/email-otp',
  '/sign-in/email',
  '/sign-in/magic-link',
  '/magic-link/verify',
  '/request-password-reset',
  '/reset-password',
  '/change-password',
  '/list-accounts',
  '/passkey/generate-register-options',
  '/passkey/verify-registration',
  '/passkey/generate-authenticate-options',
  '/passkey/verify-authentication',
  '/passkey/list-user-passkeys',
  '/passkey/update-passkey',
  '/passkey/delete-passkey'
])

export async function authRouteHandler(request: Request) {
  const path = new URL(request.url).pathname.slice('/api/auth'.length)
  // The emailed reset link lands on /reset-password/<token> before redirecting.
  const allowed = paths.has(path) || /^\/reset-password\/[\w-]+$/.test(path)
  if (!allowed) return new Response('Not found', { status: 404 })
  return getBetterAuth().handler(request)
}
