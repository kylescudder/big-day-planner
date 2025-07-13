'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import { Form } from '@/components/ui/form'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useState } from 'react'
import { IconBed, IconTrash } from '@tabler/icons-react'
import { EditHotelsForm } from './form/edit-hotels-form'
import { uuidv4 } from '@/lib/utils'
import { useForm } from 'react-hook-form'
import { deleteHotelRecord, updateHotelRecord } from '@/server/service'
import { Hotel } from '@/server/db/schema'

export function EditHotels(props: {
  hotels: Hotel[]
  onHotelsSave: () => void
}) {
  const [open, setOpen] = useState(false)
  const [currentHotels, setCurrentHotels] = useState<Hotel[]>(props.hotels)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const form = useForm({
    defaultValues: {
      id: uuidv4(),
      name: '',
      url: ''
    }
  })

  async function onSubmit(values: Hotel) {
    const newHotel = {
      ...values,
      id: uuidv4()
    }
    const updatedHotels = [...currentHotels, newHotel]
    setCurrentHotels(updatedHotels)
    await updateHotelRecord(newHotel)
    props.onHotelsSave()
    form.reset()
  }

  function handleHotelDelete(hotel: Hotel) {
    deleteHotelRecord(hotel)
    setCurrentHotels((prevHotels) =>
      prevHotels.filter((t) => t.id !== hotel.id)
    )
  }

  const HotelItem = (hotel: Hotel) => (
    <li
      key={hotel.id}
      className='flex flex-col space-y-2 p-4 hover:bg-muted/50 rounded-md'
    >
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <p className='font-medium'>{hotel.name}</p>
          <p className='text-sm break-all text-muted-foreground'>{hotel.url}</p>
        </div>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => handleHotelDelete(hotel)}
          aria-label='Delete hotel'
        >
          <IconTrash className='h-4 w-4' />
        </Button>
      </div>
    </li>
  )

  const HotelsList = () => (
    <div className='py-4'>
      {currentHotels.length > 0 ? (
        <ul className='space-y-2 max-h-[400px] overflow-y-auto'>
          {currentHotels.map(HotelItem)}
        </ul>
      ) : (
        <div className='text-center py-4 text-muted-foreground'>
          No hotels added yet. Add your first hotel below.
        </div>
      )}
    </div>
  )

  const HotelsForm = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <EditHotelsForm form={form} />
        {isDesktop ? (
          <DialogFooter>
            <Button type='submit'>Save changes</Button>
            <DialogClose asChild>
              <Button variant='outline'>Close</Button>
            </DialogClose>
          </DialogFooter>
        ) : (
          <DrawerFooter>
            <Button type='submit'>Save changes</Button>
            <DrawerClose asChild>
              <Button variant='outline'>Close</Button>
            </DrawerClose>
          </DrawerFooter>
        )}
      </form>
    </Form>
  )

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant='outline' className='mx-2'>
            <IconBed className='mr-2 h-4 w-4' />
            Edit Hotels
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[500px]'>
          <DialogHeader>
            <DialogTitle>Edit Hotels</DialogTitle>
            <DialogDescription>Edit the hotels for the day.</DialogDescription>
          </DialogHeader>
          <HotelsList />
          <HotelsForm />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant='outline' className='mx-2'>
          <IconBed className='mr-2 h-4 w-4' />
          Edit Hotels
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit Hotels</DrawerTitle>
          <DrawerDescription>Edit the hotels for the day.</DrawerDescription>
        </DrawerHeader>
        <div className='px-4'>
          <HotelsList />
          <HotelsForm />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
