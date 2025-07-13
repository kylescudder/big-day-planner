'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { updateGuestRecord } from '@/server/service'
import { Guest } from '@/server/db/schema'
import { GuestFormFields } from './guest-form-fields'
import { Address } from '@/types/address'
import { useMediaQuery } from '@/hooks/use-media-query'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer'

export interface EditGuestModalProps {
  guest: Guest
  guests: Guest[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onGuestUpdate: (g: Guest) => void
}

export function EditGuestModal({
  guest,
  guests,
  open,
  onOpenChange,
  onGuestUpdate
}: EditGuestModalProps) {
  // Re-initialize whenever `guest` changes
  const form = useForm<Guest>({
    defaultValues: guest
  })
  const [addressList, setAddressList] = useState<Address[]>([])
  const [addressSearched, setAddressSearched] = useState(false)

  const isDesktop = useMediaQuery('(min-width: 768px)')

  useEffect(() => {
    form.reset(guest)
    setAddressList([])
    setAddressSearched(false)
  }, [guest, form])

  const onSubmit = async (values: Guest) => {
    const updated: Guest = {
      ...values,
      updatedAt: new Date()
    }
    await updateGuestRecord(updated)
    onGuestUpdate(updated)
    onOpenChange(false)
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Edit Guest</DialogTitle>
            <DialogDescription>
              Change any of the guest details below.
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
                <Button type='submit'>Save Changes</Button>
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
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add Guest</DrawerTitle>
          <DrawerDescription>
            Add the guests required information.
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
