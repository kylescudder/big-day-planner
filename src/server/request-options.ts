import '@tanstack/react-start/server-only'
import { clerkMiddleware } from '@clerk/tanstack-react-start/server'
import {
  sentryGlobalFunctionMiddleware,
  sentryGlobalRequestMiddleware
} from '@sentry/tanstackstart-react'

import { readAuthEnv } from './auth-env'

// Clerk's middleware runs only when Clerk is the selected provider, so Better
// Auth mode needs no Clerk keys and makes no Clerk requests.
export function requestOptions() {
  const clerk = readAuthEnv().AUTH_PROVIDER === 'clerk'
  return {
    requestMiddleware: clerk
      ? [sentryGlobalRequestMiddleware, clerkMiddleware()]
      : [sentryGlobalRequestMiddleware],
    functionMiddleware: [sentryGlobalFunctionMiddleware]
  }
}
