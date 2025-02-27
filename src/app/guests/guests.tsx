'use client'

import { DataTable } from '@/components/ui/data-table/data-table'
import LoadingPage from '@/components/ui/loading/loading-page'
import {
  Main,
  Pudding,
  Starter,
  type Detail,
  type Espoused,
  type Guest,
  type Images,
  type Timing
} from '@/server/db/schema'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { getGuestColumns } from './_components/columns'
import { AddGuest } from './_components/add-guest'
import { EditDetails } from './_components/edit-details'
import { deleteGuestRecord } from '@/server/service'
import { EditEspoused } from './_components/edit-espoused'
import { EditImages } from './_components/edit-images'
import { EditTimings } from './_components/edit-timings'
import { EditMeals } from './_components/edit-meals'

export default function Guests(props: {
  details: Detail
  starters: Starter[]
  mains: Main[]
  puddings: Pudding[]
  espoused: Espoused | null
  data: Guest[]
  images: Images[]
  timings: Timing[]
}) {
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

  useEffect(() => {
    if (props.data) {
      setGuests(props.data)
    }
  }, [props.data])

  if (!props.data) return <LoadingPage />

  const onNewGuest = (newGuest: Guest) => {
    setGuests((prevGuests) => [...prevGuests, newGuest])
  }

  const onDetailsSave = () => {
    toast('Details saved!', {
      duration: 2000
    })
  }

  const onMealsSave = () => {
    toast('Meals saved!', {
      duration: 2000
    })
  }

  const onEspousedSave = () => {
    toast('Espoused saved!', {
      duration: 2000
    })
  }

  const onImagesSave = () => {
    toast('Images saved!', {
      duration: 2000
    })
  }

  const onTimingsSave = () => {
    toast('Timings saved!', {
      duration: 2000
    })
  }

  return (
    <div>
      <AddGuest guests={guests} onNewGuest={onNewGuest} />
      <EditDetails details={props.details} onDetailsSave={onDetailsSave} />
      <EditMeals
        starters={props.starters}
        mains={props.mains}
        puddings={props.puddings}
        onMealsSave={onMealsSave}
      />
      <EditEspoused espoused={props.espoused} onEspousedSave={onEspousedSave} />
      <EditImages images={props.images} onImagesSave={onImagesSave} />
      <EditTimings timings={props.timings} onTimingsSave={onTimingsSave} />
      <div className='flex flex-col'>
        <DataTable columns={columns} data={guests || []} />
      </div>
    </div>
  )
}
