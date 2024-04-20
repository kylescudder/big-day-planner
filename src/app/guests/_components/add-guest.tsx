'use client'

import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { IconUserPlus } from '@tabler/icons-react'
import { useMediaQuery } from '@/hooks/use-media-query'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { AddGuestForm } from './form'
import { type Guest } from '@/server/db/schema'

export function AddGuest(props: { onNewGuest: (newGuest: Guest) => void }) {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const onFormSubmit = (open: boolean) => {
    setOpen(open)
  }

  const onNewGuest = (newGuest: Guest) => {
    props.onNewGuest(newGuest)
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        {/* <DialogTrigger asChild>
          <Button variant="outline">
            <IconUserPlus />
            Add Guest
          </Button>
        </DialogTrigger> */}
        <DialogTrigger asChild>
          <Button variant="outline">
            <IconUserPlus className="pr-2" />
            Add Guest
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <AddGuestForm onNewGuest={onNewGuest} onFormSubmit={onFormSubmit} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <IconUserPlus className="pr-2" />
          Add Guest
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <AddGuestForm onNewGuest={onNewGuest} onFormSubmit={onFormSubmit} />
      </DrawerContent>
    </Drawer>
  )
}
