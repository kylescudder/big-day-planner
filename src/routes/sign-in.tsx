import { createFileRoute, redirect } from '@tanstack/react-router'

// Kept so old bookmarks to /sign-in still reach the sign-in screen.
export const Route = createFileRoute('/sign-in')({
  beforeLoad: () => {
    throw redirect({ to: '/auth/$path', params: { path: 'sign-in' } })
  }
})
