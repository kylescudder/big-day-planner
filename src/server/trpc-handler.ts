import '@tanstack/react-start/server-only'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

import { readAuthEnv } from './auth-env'
import { sessionUserId } from './auth-session'
import { appRouter } from './trpc'

export function trpcHandler(request: Request) {
  const env = readAuthEnv()
  // Better Auth sessions arrive as cookies, so refuse cross-site writes.
  if (request.method !== 'GET') {
    const origin = request.headers.get('origin')
    if (
      request.headers.get('sec-fetch-site') === 'cross-site' ||
      (origin && origin !== env.BETTER_AUTH_URL)
    )
      return Response.json(
        { error: 'Cross-site request refused' },
        { status: 403 }
      )
  }
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: request,
    router: appRouter,
    createContext: async () => ({
      userId: await sessionUserId(request.headers)
    })
  })
}
