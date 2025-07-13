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
      description: '',
      phone: ''
    }
  })

  async function onSubmit(values: Taxi) {
    const newTaxi = {
      ...values,
      id: uuidv4()
    }
    const updatedTaxis = [...currentTaxis, newTaxi]
    setCurrentTaxis(updatedTaxis)
    await updateTaxiRecord(newTaxi)
    props.onTaxisSave()
    form.reset()
  }

  function handleTaxiDelete(taxi: Taxi) {
    deleteTaxiRecord(taxi)
    setCurrentTaxis((prevTaxis) => prevTaxis.filter((t) => t.id !== taxi.id))
  }

  const TaxiItem = (taxi: Taxi) => (
    <li
      key={taxi.id}
      className='flex flex-col space-y-2 p-4 hover:bg-muted/50 rounded-md'
    >
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <p className='font-medium'>{taxi.name}</p>
          <p className='text-sm text-muted-foreground'>{taxi.phone}</p>
        </div>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => handleTaxiDelete(taxi)}
          aria-label='Delete taxi'
        >
          <IconTrash className='h-4 w-4' />
        </Button>
      </div>
      {taxi.description && (
        <p className='text-sm text-muted-foreground'>{taxi.description}</p>
      )}
    </li>
  )

  const TaxisList = () => (
    <div className='py-4'>
      {currentTaxis.length > 0 ? (
        <ul className='space-y-2 max-h-[400px] overflow-y-auto'>
          {currentTaxis.map(TaxiItem)}
        </ul>
      ) : (
        <div className='text-center py-4 text-muted-foreground'>
          No taxis added yet. Add your first taxi below.
        </div>
      )}
    </div>
  )

  const TaxisForm = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <EditTaxisForm form={form} />
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
            <IconCar className='mr-2 h-4 w-4' />
            Edit Taxis
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[500px]'>
          <DialogHeader>
            <DialogTitle>Edit Taxis</DialogTitle>
            <DialogDescription>Edit the taxis for the day.</DialogDescription>
          </DialogHeader>
          <TaxisList />
          <TaxisForm />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant='outline' className='mx-2'>
          <IconCar className='mr-2 h-4 w-4' />
          Edit Taxis
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit Taxis</DrawerTitle>
          <DrawerDescription>Edit the taxis for the day.</DrawerDescription>
        </DrawerHeader>
        <TaxisList />
        <TaxisForm />
      </DrawerContent>
    </Drawer>
  )
}
