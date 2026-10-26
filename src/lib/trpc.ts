import { auth } from '@clerk/tanstack-react-start/server'
import { createIsomorphicFn } from '@tanstack/react-start'
import {
  createTRPCClient,
  httpBatchLink,
  unstable_localLink
} from '@trpc/client'
import superjson from 'superjson'

import { appRouter, type AppRouter } from '@/server/trpc'

// Route loaders run on the server while rendering and in the browser after
// that. On the server, call the router in-process with the request's Clerk
// session; in the browser, call it over HTTP.
const createClient = createIsomorphicFn()
  .server(() =>
    createTRPCClient<AppRouter>({
      links: [
        unstable_localLink({
          router: appRouter,
          transformer: superjson,
          createContext: async () => ({ userId: (await auth()).userId })
        })
      ]
    })
  )
  .client(() =>
    createTRPCClient<AppRouter>({
      links: [httpBatchLink({ url: '/api/trpc', transformer: superjson })]
    })
  )

export const trpc = createClient()
