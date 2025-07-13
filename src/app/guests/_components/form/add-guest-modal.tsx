'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
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
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { createGuestRecord } from '@/server/service'
import { Guest } from '@/server/db/schema'
import { GuestFormFields } from './guest-form-fields'
import { Address } from '@/types/address'
import { IconUserPlus } from '@tabler/icons-react'
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
import { useMediaQuery } from '@/hooks/use-media-query'
import { uuidv4 } from '@/lib/utils'

export interface AddGuestModalProps {
  guests: Guest[]
  onNewGuest: (g: Guest) => void
}

export function AddGuestModal({ guests, onNewGuest }: AddGuestModalProps) {
  const form = useForm<Guest>({
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
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

  const [open, setOpen] = useState(false)
  const [addressList, setAddressList] = useState<Address[]>([])
  const [addressSearched, setAddressSearched] = useState(false)

  const isDesktop = useMediaQuery('(min-width: 768px)')

  const onSubmit = async (values: Guest) => {
    const newGuest: Guest = {
      ...values,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    await createGuestRecord(newGuest)
    onNewGuest(newGuest)
    form.reset()
    setAddressList([])
    setAddressSearched(false)
    setOpen(false)
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
              Fill in the guest details below.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
              <GuestFormFields
                form={form}
                guestList={guests}
                initialAddressList={addressList}
                initialAddressSearched={addressSearched}
              />
              <DialogFooter>
                <Button type='submit'>Save</Button>
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
            Fill in the guest details below.
          </DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <GuestFormFields
              form={form}
              guestList={guests}
              initialAddressList={addressList}
              initialAddressSearched={addressSearched}
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
