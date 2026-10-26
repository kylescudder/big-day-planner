import { createFileRoute, redirect } from '@tanstack/react-router'

import { ClientGuestPage } from '@/features/guest/client-guest'
import { trpc } from '@/lib/trpc'

export const Route = createFileRoute('/guest/$id')({
  loader: async ({ params }) => {
    const data = await trpc.guestPage.query({ id: params.id }).catch(() => null)
    const { details, espoused } = data ?? {}
    if (!data || !details || !espoused || data.guestData.length === 0) {
      throw redirect({ to: '/' })
    }
    return { ...data, details, espoused }
  },
  component: GuestPage
})

function GuestPage() {
  const { guestData, ...data } = Route.useLoaderData()
  return (
    <div>
      <ClientGuestPage initialGuestData={guestData} {...data} />
    </div>
  )
}
