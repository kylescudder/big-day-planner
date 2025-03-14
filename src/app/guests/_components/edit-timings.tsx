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
import { EditTimingsForm } from './form/edit-timings-form'
import { uuidv4 } from '@/lib/utils'
import { useForm } from 'react-hook-form'
import { deleteTimingRecord, updateTimingRecord } from '@/server/service'
import { Timing } from '@/server/db/schema'
import { format } from 'date-fns'
import { env } from '@/env'

export function EditTimings(props: {
  timings: Timing[]
  onTimingsSave: () => void
}) {
  const [open, setOpen] = useState(false)
  const [currentTimings, setCurrentTimings] = useState<Timing[]>(props.timings)

  const isDesktop = useMediaQuery('(min-width: 768px)')

  const form = useForm({
    defaultValues: {
      id: uuidv4(),
      time: new Date(),
      event: '',
      altText: '',
      imageUrl: ''
    }
  })

  async function onSubmit(values: Timing) {
    const newTiming = {
      ...values,
      id: uuidv4() // Ensure a new ID is generated for the new timing
    }
    const updatedTimings = [...currentTimings, newTiming]
    setCurrentTimings(updatedTimings)
    await updateTimingRecord(newTiming) // Assuming this function updates the record
    props.onTimingsSave // Pass the updated timings back
    form.reset()
  }

  function handleTimingDelete(timing: Timing) {
    deleteTimingRecord(timing)
    setCurrentTimings((prevTimings) =>
      prevTimings.filter((t) => t.id !== timing.id)
    )
  }

  const renderTimingItem = (timing: Timing) => (
    <li key={timing.id} className='flex items-center justify-between py-2'>
      <span>
        {format(new Date(timing.time), 'HH:mm')} - {timing.event}
      </span>
      {timing.imageUrl && (
        <img
          src={`https://${env.NEXT_PUBLIC_UT_APP_ID}.ufs.sh/f/${timing.imageUrl}`}
          alt='Logo'
          className='w-24 h-24 object-contain'
        />
      )}
      <Button
        variant='outline'
        className='ml-2'
        onClick={() => handleTimingDelete(timing)}
        aria-label='Delete timing'
      >
        <IconTrash />
      </Button>
    </li>
  )

  const listStyle = 'overflow-y-auto max-h-64' // Set max height and enable scrolling

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant='outline' className='mx-2'>
            <IconClock className='pr-2' />
            Edit Timings
          </Button>
        </DialogTrigger>
        <DialogContent className='max-w-7xl'>
          <DialogHeader>
            <DialogTitle>Edit Timings</DialogTitle>
            <DialogDescription>Edit the timings for the day.</DialogDescription>
          </DialogHeader>
          <ul className={listStyle}>{currentTimings.map(renderTimingItem)}</ul>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
              <EditTimingsForm form={form} />
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
          <IconClock className='pr-2' />
          Edit Timings
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit Timings</DrawerTitle>
          <DrawerDescription>Edit the timings for the day.</DrawerDescription>
        </DrawerHeader>
        <ul className={listStyle}>{currentTimings.map(renderTimingItem)}</ul>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <EditTimingsForm form={form} />
            <DrawerFooter>
              <Button type='submit'>
                <p>Save changes</p>
              </Button>
              <DrawerClose asChild>
                <Button variant='outline'>Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  )
}
