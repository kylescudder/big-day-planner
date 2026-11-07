import {
  sentryGlobalFunctionMiddleware,
  sentryGlobalRequestMiddleware
} from '@sentry/tanstackstart-react'
import { createIsomorphicFn, createStart } from '@tanstack/react-start'

// The server picks its middleware from AUTH_PROVIDER at runtime: Clerk's runs
// only when Clerk is selected.
export const startInstance = createStart(
  createIsomorphicFn()
    .server(async () => {
      const { requestOptions } = await import('./server/request-options')
      return requestOptions()
    })
    .client(() => ({
      requestMiddleware: [sentryGlobalRequestMiddleware],
      functionMiddleware: [sentryGlobalFunctionMiddleware]
    }))
)
