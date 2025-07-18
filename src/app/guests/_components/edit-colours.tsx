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
import { IconColorFilter, IconTrash } from '@tabler/icons-react'
import { EditColoursForm } from './form/edit-colours-form'
import { uuidv4 } from '@/lib/utils'
import { useForm } from 'react-hook-form'
import { deleteColourRecord, updateColourRecord } from '@/server/service'
import type { Colour } from '@/server/db/schema'

export function EditColours(props: {
  colours: Colour[]
  onColoursSave: () => void
}) {
  const [open, setOpen] = useState(false)
  const [currentColours, setCurrentColours] = useState<Colour[]>(props.colours)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const form = useForm({
    defaultValues: {
      id: uuidv4(),
      hex: '#ffffff'
    }
  })

  async function onSubmit(values: Colour) {
    const newColour = {
      ...values,
      id: uuidv4()
    }
    const updatedColours = [...currentColours, newColour]
    setCurrentColours(updatedColours)
    await updateColourRecord(newColour)
    props.onColoursSave()
    form.reset({
      id: uuidv4(),
      hex: '#ffffff'
    })
  }

  function handleColourDelete(colour: Colour) {
    deleteColourRecord(colour)
    setCurrentColours((prevColours) =>
      prevColours.filter((t) => t.id !== colour.id)
    )
  }

  const ColourItem = (colour: Colour) => (
    <li
      key={colour.id}
      className='flex flex-col space-y-2 p-4 hover:bg-muted/50 rounded-md'
    >
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <span
            className='w-6 h-6 rounded-md border'
            style={{ backgroundColor: colour.hex }}
          />
          <p className='font-mono'>{colour.hex}</p>
        </div>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => handleColourDelete(colour)}
          aria-label='Delete colour'
        >
          <IconTrash className='h-4 w-4' />
        </Button>
      </div>
    </li>
  )

  const ColoursList = () => (
    <div className='py-4'>
      {currentColours.length > 0 ? (
        <ul className='space-y-2 max-h-[400px] overflow-y-auto'>
          {currentColours.map(ColourItem)}
        </ul>
      ) : (
        <div className='text-center py-4 text-muted-foreground'>
          No colours added yet. Add your first colour below.
        </div>
      )}
    </div>
  )

  const ColourForm = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <EditColoursForm form={form} />
        <DialogFooter className='mt-4'>
          <Button type='submit'>Add Colour</Button>
          <DialogClose asChild>
            <Button variant='outline'>Close</Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </Form>
  )

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant='outline' className='mx-2'>
            <IconColorFilter className='mr-2 h-4 w-4' />
            Edit Colours
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[500px]'>
          <DialogHeader>
            <DialogTitle>Edit Colours</DialogTitle>
            <DialogDescription>
              Add or remove colours from your palette.
            </DialogDescription>
          </DialogHeader>
          <ColoursList />
          <ColourForm />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant='outline' className='mx-2'>
          <IconColorFilter className='mr-2 h-4 w-4' />
          Edit Colours
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit Colours</DrawerTitle>
          <DrawerDescription>
            Add or remove colours from your palette.
          </DrawerDescription>
        </DrawerHeader>
        <div className='px-4'>
          <ColoursList />
          <ColourForm />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
