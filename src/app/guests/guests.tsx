'use client'

import { DataTable } from '@/components/ui/data-table/data-table'
import LoadingPage from '@/components/ui/loading/loading-page'
import { type Guest } from '@/server/db/schema'
import { getGuestColumns } from './columns'
import { useMemo } from 'react'

export default function Guests(props: { data: Guest[] }) {
  // const [guestList, setGuestList] = useState<typeof guests[]>([])

  // const deleteMutation = api.guest.delete.useMutation({
  //   onSuccess: () => {
  //     toast({
  //       description: 'Guest deleted!'
  //     })
  //   },
  //   onError: () => {
  //     toast({
  //       variant: 'destructive',
  //       title: 'Uh oh! Something went wrong!',
  //       description: 'There was a problem with your request.'
  //     })
  //   }
  // })

  const onDelete = (guest: Guest) => {
    console.log(guest)
    // deleteMutation.mutate(
    //   { id: guest.id },
    //   {
    //     onSuccess: () => {
    //       setGuests((prevGuests) => prevGuests.filter((g) => g.id !== guest.id))
    //     }
    //   }
    // )
  }

  // const columns = useMemo(() => getGuestColumns({ onDelete }), [])
  const columns = getGuestColumns({ onDelete })

  console.log(props.data)

  // useEffect(() => {
  //   if (data) {
  //     console.log(data)
  //     // setGuestList(data)
  //   }
  // }, [data])

  if (!props.data) return <LoadingPage />

  // const onNewGuest = (newGuest: Guest) => {
  //   setGuests((prevGuests) => [...prevGuests, newGuest])
  // }

  return (
    <div>
      {/* <AddGuest onNewGuest={onNewGuest} /> */}
      <div className="flex flex-col">
        <DataTable columns={columns} data={props.data || []} />
      </div>
    </div>
  )
}
