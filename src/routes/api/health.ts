import { createFileRoute } from '@tanstack/react-router'

import { healthResponse } from '@/server/health'

// Pre-standardisation path; remove once nothing calls it.
export const Route = createFileRoute('/api/health')({
  server: { handlers: { GET: healthResponse } }
})
