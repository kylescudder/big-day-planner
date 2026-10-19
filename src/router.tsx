import * as Sentry from '@sentry/tanstackstart-react'
import { createRouter } from '@tanstack/react-router'

import { SENTRY_DSN } from '@/lib/sentry'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
    scrollRestoration: true
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
