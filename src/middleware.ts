import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isGuestsRoute = createRouteMatcher(['/guests(.*)'])

export default clerkMiddleware(async (auth, req) => {
  // Restrict admin route to users with specific role
  if (isGuestsRoute(req)) await auth.protect()
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)']
}
