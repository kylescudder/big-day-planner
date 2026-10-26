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
import { getGuestColumns } from './columns'
import { EditDetails } from './edit-details'
import { trpc } from '@/lib/trpc'
import { EditEspoused } from './edit-espoused'
import { EditImages } from './edit-images'
import { EditTimings } from './edit-timings'
import { EditMeals } from './edit-meals'
import { EditTaxis } from './edit-taxis'
import { EditHotels } from './edit-hotels'
import { EditColours } from './edit-colours'
import { AddGuestModal } from '@/features/guests/form/add-guest-modal'

export default function Guests(props: {
  details: Detail | null
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
    await trpc.guest.delete.mutate(guest.id)
    toast('Guest deleted!', {
      duration: 2000,
      id: guest.id
    })
    setGuests((prevGuests) => prevGuests.filter((g) => g.id !== guest.id))
  }

  const onEdit = (updated: Guest) => {
    toast('Guest updated!', { duration: 2000 })
    setGuests((cur) => cur.map((g) => (g.id === updated.id ? updated : g)))
  }

  const columns = useMemo(
    () =>
      getGuestColumns({
        guests,
        onDelete,
        onEdit
      }),
    [guests]
  )

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
      <AddGuestModal
        guests={guests}
        onNewGuest={(g) => setGuests((c) => [...c, g])}
      />
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
