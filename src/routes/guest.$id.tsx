import { createFileRoute, redirect } from '@tanstack/react-router'

import { ClientGuestPage } from '@/features/guest/client-guest'
import { getGuestPageData } from '@/server/service'

export const Route = createFileRoute('/guest/$id')({
  loader: async ({ params }) => {
    const data = await getGuestPageData({ data: { id: params.id } }).catch(
      () => null
    )
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
