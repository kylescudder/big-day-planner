'use client'

import { DataTable } from '@/components/ui/data-table/data-table'
import LoadingPage from '@/components/ui/loading/loading-page'
import { type Guest } from '@/server/db/schema'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { getGuestColumns } from './_components/columns'
import { AddGuest } from './_components/add-guest'
import { deleteGuestRecord } from '@/server/service'

export default function Guests(props: { data: Guest[] }) {
  const [guests, setGuests] = useState<Guest[]>([])

  const onDelete = async (guest: Guest) => {
    await deleteGuestRecord(guest.id)
    toast('Guest deleted!', {
      duration: 2000,
      id: guest.id
    })
    setGuests((prevGuests) => prevGuests.filter((g) => g.id !== guest.id))
  }

  const columns = useMemo(() => getGuestColumns({ onDelete }), [])

  console.log(props.data)

  useEffect(() => {
    if (props.data) {
      setGuests(props.data)
    }
  }, [props.data])

  if (!props.data) return <LoadingPage />

  const onNewGuest = (newGuest: Guest) => {
    setGuests((prevGuests) => [...prevGuests, newGuest])
  }

  return (
    <div>
      <AddGuest onNewGuest={onNewGuest} />
      <div className="flex flex-col">
        <DataTable columns={columns} data={guests || []} />
      </div>
    </div>
  )
}
