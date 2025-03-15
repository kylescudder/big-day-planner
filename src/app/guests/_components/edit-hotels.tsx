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
import { IconClock, IconTrash } from '@tabler/icons-react'
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
      id: uuidv4() // Ensure a new ID is generated for the nehotelw
    }
    const updatedHotels = [...currentHotels, newHotel]
    setCurrentHotels(updatedHotels)
    await updateHotelRecord(newHotel) // Assuming this function updates the record
    props.onHotelsSave // Pass the updated hotels back
    form.reset()
  }

  function handleHotelDelete(hotel: Hotel) {
    deleteHotelRecord(hotel)
    setCurrentHotels((prevHotels) =>
      prevHotels.filter((t) => t.id !== hotel.id)
    )
  }

  const renderHotelItem = (hotel: Hotel) => (
    <li
      key={hotel.id}
      className='flex items-center justify-between py-2 px-4 hover:bg-muted/50 rounded-md'
    >
      <span>{hotel.name}</span>
      <span>{hotel.url}</span>
      <Button
        variant='ghost'
        size='icon'
        onClick={() => handleHotelDelete(hotel)}
        aria-label='Delete hotel'
      >
        <IconTrash className='h-4 w-4' />
      </Button>
    </li>
  )

  const listStyle = 'overflow-y-auto max-h-64 space-y-1 my-4'

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant='outline' className='mx-2'>
            <IconClock className='pr-2' />
            Edit Hotels
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[500px]'>
          <DialogHeader>
            <DialogTitle>Edit Hotels</DialogTitle>
            <DialogDescription>Edit the hotels for the day.</DialogDescription>
          </DialogHeader>
          {currentHotels.length > 0 ? (
            <ul className={listStyle}>{currentHotels.map(renderHotelItem)}</ul>
          ) : (
            <div className='text-center py-4 text-muted-foreground'>
              No hotels added yet. Add your first hotel below.
            </div>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
              <EditHotelsForm form={form} />
              <DialogFooter>
                <Button type='submit'>
                  <p>Save changes</p>
                </Button>
                <DialogClose asChild>
                  <Button variant='outline'>Close</Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant='outline' className='mx-2'>
          <IconClock className='pr-2' />
          Edit Hotels
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit Hotels</DrawerTitle>
          <DrawerDescription>Edit the hotels for the day.</DrawerDescription>
        </DrawerHeader>
        {currentHotels.length > 0 ? (
          <ul className={listStyle}>{currentHotels.map(renderHotelItem)}</ul>
        ) : (
          <div className='text-center py-4 text-muted-foreground'>
            No hotels added yet. Add your first hotel below.
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <EditHotelsForm form={form} />
            <DrawerFooter>
              <Button type='submit'>
                <p>Save changes</p>
              </Button>
              <DrawerClose asChild>
                <Button variant='outline'>Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  )
}
