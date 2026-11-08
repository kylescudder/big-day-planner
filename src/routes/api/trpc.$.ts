import { createFileRoute } from '@tanstack/react-router'

import { trpcHandler } from '@/server/trpc-handler'

export const Route = createFileRoute('/api/trpc/$')({
  server: {
    handlers: {
      GET: ({ request }) => trpcHandler(request),
      POST: ({ request }) => trpcHandler(request)
    }
  }
})
