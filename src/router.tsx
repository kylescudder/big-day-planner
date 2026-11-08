import * as Sentry from '@sentry/tanstackstart-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRouter } from '@tanstack/react-router'

import { SENTRY_DSN } from '@/lib/sentry'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  // Per router (per request on the server), so cached sessions never leak.
  // Better Auth UI keeps the signed-in session in this cache.
  const queryClient = new QueryClient()
  const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
    scrollRestoration: true,
    Wrap: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  })

  if (!router.isServer && import.meta.env.PROD) {
    Sentry.init({
      dsn: SENTRY_DSN,
      integrations: [
        Sentry.tanstackRouterBrowserTracingIntegration(router),
        Sentry.replayIntegration()
      ],
      tracesSampleRate: 1,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0
    })
  }

  return router
}
