'use client'

import { Button } from '@/components/ui/button'
import { useState } from 'react'
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
import { IconUserPlus } from '@tabler/icons-react'
import { useMediaQuery } from '@/hooks/use-media-query'
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
import { AddGuestForm } from './form/add-guest-form'
import { type Guest } from '@/server/db/schema'
import { Form } from '@/components/ui/form'
import { uuidv4 } from '@/lib/utils'
import { useForm } from 'react-hook-form'
import { createGuestRecord } from '@/server/service'
import { Address } from '@/types/address'

export function AddGuest(props: {
  guests: Guest[]
  onNewGuest: (newGuest: Guest) => void
}) {
  const [open, setOpen] = useState(false)
  const [addressSearched, setAddressSearched] = useState(false)
  const [addressList, setAddressList] = useState<Address[]>([])

  const isDesktop = useMediaQuery('(min-width: 768px)')

  const form = useForm({
    defaultValues: {
      id: uuidv4(),
      forename: '',
      surname: '',
      guestKey: '',
      email: '',
      phone: '',
      address1: '',
      address2: '',
      address3: '',
      town: '',
      county: '',
      postcode: '',
      starterId: null,
      mainId: null,
      puddingId: null,
      song: '',
      artist: '',
      rsvp: false,
      rsvpAnswer: false,
      dietaryRequirements: '',
      parentId: null as string | null,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

  async function onSubmit(values: Guest) {
    const newGuest = {
      ...values,
      songChoice: '',
      rsvp: false,
      rsvpAnswer: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    await createGuestRecord(newGuest)
    setAddressList([])
    setAddressSearched(false)
    props.onNewGuest(newGuest)
    setOpen(false)
    form.reset()
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant='outline' className='mr-1'>
            <IconUserPlus className='pr-2' />
            Add Guest
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Add Guest</DialogTitle>
            <DialogDescription>
              Add the guests required information.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
              <AddGuestForm
                form={form}
                addressSearched={addressSearched}
                addressList={addressList}
                guestList={props.guests}
              />
              <DialogFooter>
                <Button type='submit'>
                  <p>Save changes</p>
                </Button>
                <DialogClose asChild>
                  <Button className='w-full' variant='outline'>
                    Cancel
                  </Button>
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
        <Button variant='outline' className='mr-1'>
          <IconUserPlus className='pr-2' />
          Add Guest
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add Guest</DrawerTitle>
          <DrawerDescription>
            Add the guests required information.
          </DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <AddGuestForm
              form={form}
              addressSearched={addressSearched}
              addressList={addressList}
              guestList={props.guests}
            />
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
