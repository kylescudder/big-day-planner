import { createFileRoute } from '@tanstack/react-router'

import { authRouteHandler } from '@/server/auth-route'

export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: ({ request }) => authRouteHandler(request),
      POST: ({ request }) => authRouteHandler(request)
    }
  }
})
