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
import { uuidv4 } from '@/lib/utils'
import { espoused, Espoused } from '@/server/db/schema'
import { updateEspousedRecord } from '@/server/service'
import { IconEdit } from '@tabler/icons-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { EditEspousedForm } from './form/edit-espoused-form'

export function EditEspoused(props: {
  espoused: Espoused
  onEspousedSave: () => void
}) {
  const [open, setOpen] = useState(false)

  const isDesktop = useMediaQuery('(min-width: 768px)')

  const form = useForm({
    defaultValues: {
      id: uuidv4(),
      groom: props.espoused?.groom ?? '',
      bride: props.espoused?.bride ?? ''
    }
  })

  async function onSubmit(values: Espoused) {
    const espoused = {
      ...values
    }
    await updateEspousedRecord(espoused)
    setOpen(false)
    props.onEspousedSave()
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant='outline'>
            <IconEdit className='pr-2' />
            Edit Espoused
          </Button>
        </DialogTrigger>
        <DialogContent className='max-w-7xl'>
          <DialogHeader>
            <DialogTitle>Edit Espoused</DialogTitle>
            <DialogDescription>
              Edit the names of the espoused.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
              <EditEspousedForm form={form} />
              <DialogFooter>
                <Button type='submit'>
                  <p>Save changes</p>
                </Button>
                <DialogClose asChild>
                  <Button variant='outline'>Cancel</Button>
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
        <Button variant='outline'>
          <IconEdit className='pr-2' />
          Edit Espoused
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit Espoused</DrawerTitle>
          <DrawerDescription>Edit the names of the espoused.</DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <EditEspousedForm form={form} />
            <DrawerFooter>
              <Button type='submit'>
                <p>Save changes</p>
              </Button>
              <DrawerClose asChild>
                <Button className='w-full' variant='outline'>
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  )
}
