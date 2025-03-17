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
import { IconCar, IconTrash } from '@tabler/icons-react'
import { EditTaxisForm } from './form/edit-taxis-form'
import { uuidv4 } from '@/lib/utils'
import { useForm } from 'react-hook-form'
import { deleteTaxiRecord, updateTaxiRecord } from '@/server/service'
import { Taxi } from '@/server/db/schema'

export function EditTaxis(props: { taxis: Taxi[]; onTaxisSave: () => void }) {
  const [open, setOpen] = useState(false)
  const [currentTaxis, setCurrentTaxis] = useState<Taxi[]>(props.taxis)

  const isDesktop = useMediaQuery('(min-width: 768px)')

  const form = useForm({
    defaultValues: {
      id: uuidv4(),
      name: '',
      phone: ''
    }
  })

  async function onSubmit(values: Taxi) {
    const newTaxi = {
      ...values,
      id: uuidv4() // Ensure a new ID is generated for the newtaxi
    }
    const updatedTaxis = [...currentTaxis, newTaxi]
    setCurrentTaxis(updatedTaxis)
    await updateTaxiRecord(newTaxi) // Assuming this function updates the record
    props.onTaxisSave // Pass the updated taxis back
    form.reset()
  }

  function handleTaxiDelete(taxi: Taxi) {
    deleteTaxiRecord(taxi)
    setCurrentTaxis((prevTaxis) => prevTaxis.filter((t) => t.id !== taxi.id))
  }

  const renderTaxiItem = (taxi: Taxi) => (
    <li
      key={taxi.id}
      className='flex items-center justify-between py-2 px-4 hover:bg-muted/50 rounded-md'
    >
      <span>{taxi.name}</span>
      <span>{taxi.phone}</span>
      <Button
        variant='ghost'
        size='icon'
        onClick={() => handleTaxiDelete(taxi)}
        aria-label='Delete taxi'
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
            <IconCar className='pr-2' />
            Edit Taxis
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[500px]'>
          <DialogHeader>
            <DialogTitle>Edit Taxis</DialogTitle>
            <DialogDescription>Edit the taxis for the day.</DialogDescription>
          </DialogHeader>
          {currentTaxis.length > 0 ? (
            <ul className={listStyle}>{currentTaxis.map(renderTaxiItem)}</ul>
          ) : (
            <div className='text-center py-4 text-muted-foreground'>
              No taxis added yet. Add your first taxi below.
            </div>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
              <EditTaxisForm form={form} />
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
          <IconCar className='pr-2' />
          Edit Taxis
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit Taxis</DrawerTitle>
          <DrawerDescription>Edit the taxis for the day.</DrawerDescription>
        </DrawerHeader>
        {currentTaxis.length > 0 ? (
          <ul className={listStyle}>{currentTaxis.map(renderTaxiItem)}</ul>
        ) : (
          <div className='text-center py-4 text-muted-foreground'>
            No taxis added yet. Add your first taxi below.
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <EditTaxisForm form={form} />
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
