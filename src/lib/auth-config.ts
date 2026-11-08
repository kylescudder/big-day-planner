import { createServerFn } from '@tanstack/react-start'

// Public runtime selection keeps the client and server on the same provider.
// Credentials stay inside the server function and are never returned.
export const getAuthConfig = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { readAuthEnv } = await import('../server/auth-env')
    return { provider: readAuthEnv().AUTH_PROVIDER }
  }
)
