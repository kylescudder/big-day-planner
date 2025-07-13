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
      id: uuidv4()
    }
    const updatedTimings = [...currentTimings, newTiming]
    setCurrentTimings(updatedTimings)
    await updateTimingRecord(newTiming)
    props.onTimingsSave()
    form.reset()
  }

  function handleTimingDelete(timing: Timing) {
    deleteTimingRecord(timing)
    setCurrentTimings((prevTimings) =>
      prevTimings.filter((t) => t.id !== timing.id)
    )
  }

  const TimingItem = (timing: Timing) => (
    <li
      key={timing.id}
      className='flex flex-col space-y-2 p-4 hover:bg-muted/50 rounded-md'
    >
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <p className='font-medium'>
            {format(new Date(timing.time), 'HH:mm')} - {timing.event}
          </p>
          {timing.imageUrl && (
            <img
              src={`https://${env.NEXT_PUBLIC_UT_APP_ID}.ufs.sh/f/${timing.imageUrl}`}
              alt='Logo'
              className='w-24 h-24 object-contain'
            />
          )}
        </div>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => handleTimingDelete(timing)}
          aria-label='Delete timing'
        >
          <IconTrash className='h-4 w-4' />
        </Button>
      </div>
    </li>
  )

  const TimingsList = () => (
    <div className='py-4'>
      {currentTimings.length > 0 ? (
        <ul className='space-y-2 max-h-[400px] overflow-y-auto'>
          {currentTimings.map(TimingItem)}
        </ul>
      ) : (
        <div className='text-center py-4 text-muted-foreground'>
          No timings added yet. Add your first timing below.
        </div>
      )}
    </div>
  )

  const TimingsForm = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <EditTimingsForm form={form} />
        {isDesktop ? (
          <DialogFooter>
            <Button type='submit'>
              <p>Save changes</p>
            </Button>
            <DialogClose asChild>
              <Button variant='outline'>Cancel</Button>
            </DialogClose>
          </DialogFooter>
        ) : (
          <DrawerFooter>
            <Button type='submit'>
              <p>Save changes</p>
            </Button>
            <DrawerClose asChild>
              <Button variant='outline'>Cancel</Button>
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
            <IconClock className='pr-2' />
            Edit Timings
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[500px]'>
          <DialogHeader>
            <DialogTitle>Edit Timings</DialogTitle>
            <DialogDescription>Edit the timings for the day.</DialogDescription>
          </DialogHeader>
          <TimingsList />
          <TimingsForm />
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
        <TimingsList />
        <TimingsForm />
      </DrawerContent>
    </Drawer>
  )
}
