'use client'

import { DataTable } from '@/components/ui/data-table/data-table'
import LoadingPage from '@/components/ui/loading/loading-page'
import {
  Colour,
  Hotel,
  Main,
  Pudding,
  Starter,
  Taxi,
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
import { EditTaxis } from './_components/edit-taxis'
import { EditHotels } from './_components/edit-hotels'
import { EditColours } from './_components/edit-colours'

export default function Guests(props: {
  details: Detail
  starters: Starter[]
  mains: Main[]
  puddings: Pudding[]
  espoused: Espoused | null
  data: Guest[]
  images: Images[]
  timings: Timing[]
  taxis: Taxi[]
  hotels: Hotel[]
  colours: Colour[]
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

  const onSave = (entity: string) => {
    toast(`${entity} saved!`, {
      duration: 2000
    })
  }

  return (
    <div>
      <AddGuest guests={guests} onNewGuest={onNewGuest} />
      <EditDetails
        details={props.details}
        onDetailsSave={() => onSave('Details')}
      />
      <EditMeals
        starters={props.starters}
        mains={props.mains}
        puddings={props.puddings}
        onMealsSave={() => onSave('Meals')}
      />
      <EditEspoused
        espoused={props.espoused}
        onEspousedSave={() => onSave('Espoused')}
      />
      <EditImages images={props.images} onImagesSave={() => onSave('Images')} />
      <EditTimings
        timings={props.timings}
        onTimingsSave={() => onSave('Timings')}
      />
      <EditTaxis taxis={props.taxis} onTaxisSave={() => onSave('Taxis')} />
      <EditHotels hotels={props.hotels} onHotelsSave={() => onSave('Hotels')} />
      <EditColours
        colours={props.colours}
        onColoursSave={() => onSave('Colours')}
      />
      <div className='flex flex-col'>
        <DataTable columns={columns} data={guests || []} />
      </div>
    </div>
  )
}
