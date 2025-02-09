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
import { Detail } from '@/server/db/schema'
import { updateDetailRecord } from '@/server/service'
import { IconEdit } from '@tabler/icons-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { EditDetailsForm } from './form/edit-details-form'
import { uuidv4 } from '@/lib/utils'

export function EditDetails(props: {
  details: Detail
  onDetailsSave: () => void
}) {
  const [open, setOpen] = useState(false)

  const isDesktop = useMediaQuery('(min-width: 768px)')

  const form = useForm({
    defaultValues: {
      id: uuidv4(),
      startDateTime: props.details.startDateTime ?? '',
      endDateTime: props.details.endDateTime ?? '',
      address1: props.details?.address1 ?? '',
      address2: props.details?.address2 ?? '',
      address3: props.details?.address3 ?? '',
      town: props.details?.town ?? '',
      county: props.details?.county ?? '',
      postcode: props.details?.postcode ?? '',
      detailsTextSubheader: props.details?.detailsTextSubheader ?? '',
      detailsText: props.details?.detailsText ?? '',
      adultsOnly: props.details?.adultsOnly ?? false,
      adultsOnlyText: props.details?.adultsOnlyText ?? '',
      dresscode: props.details?.dresscode ?? '',
      songRequest: props.details?.songRequest ?? false
    }
  })

  async function onSubmit(values: Detail) {
    const details = {
      ...values
    }
    await updateDetailRecord(details)
    setOpen(false)
    props.onDetailsSave()
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant='outline' className='mx-2'>
            <IconEdit className='pr-2' />
            Edit Details
          </Button>
        </DialogTrigger>
        <DialogContent className='max-w-7xl'>
          <DialogHeader>
            <DialogTitle>Edit Details</DialogTitle>
            <DialogDescription>Edit the details of the day.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
              <EditDetailsForm form={form} />
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
        <Button variant='outline' className='mx-2'>
          <IconEdit className='pr-2' />
          Edit Details
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit Details</DrawerTitle>
          <DrawerDescription>Edit the details of the day.</DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <EditDetailsForm form={form} />
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
