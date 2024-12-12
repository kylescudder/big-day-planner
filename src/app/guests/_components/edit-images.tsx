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
import { useMediaQuery } from '@/hooks/use-media-query'
import { IconLibraryPhoto } from '@tabler/icons-react'
import { useState } from 'react'
import { EditImagesForm } from './form/edit-images-form'
import { Image } from '@/server/db/schema'

export function EditImages(props: {
  images: Image[]
  onImagesSave: () => void
}) {
  const [open, setOpen] = useState(false)

  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant='outline' className='mx-2'>
            <IconLibraryPhoto className='pr-2' />
            Edit Images
          </Button>
        </DialogTrigger>
        <DialogContent className='max-w-7xl'>
          <DialogHeader>
            <DialogTitle>Edit Images</DialogTitle>
            <DialogDescription>
              Edit the images used around the site.
            </DialogDescription>
          </DialogHeader>
          <EditImagesForm images={props.images} />
          <DialogFooter>
            <Button type='submit'>
              <p>Save changes</p>
            </Button>
            <DialogClose asChild>
              <Button variant='outline'>Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant='outline' className='mx-2'>
          <IconLibraryPhoto className='pr-2' />
          Edit Images
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit Images</DrawerTitle>
          <DrawerDescription>
            Edit the images used around the site.
          </DrawerDescription>
        </DrawerHeader>
        <EditImagesForm images={props.images} />
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
      </DrawerContent>
    </Drawer>
  )
}
