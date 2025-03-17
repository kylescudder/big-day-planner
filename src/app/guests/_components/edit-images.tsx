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
import { Images } from '@/server/db/schema'
import { updateImageRecord } from '@/server/service'

export function EditImages(props: {
  images: Images[]
  onImagesSave: () => void
}) {
  const [open, setOpen] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<Images[]>([])

  const isDesktop = useMediaQuery('(min-width: 768px)')

  const handleSave = async () => {
    uploadedImages.forEach((image) => {
      updateImageRecord(image)
    })
    try {
      props.onImagesSave()
      setOpen(false)
    } catch (error) {
      console.error('Error saving images:', error)
    }
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant='outline' className='mx-2'>
            <IconLibraryPhoto className='pr-2' />
            Edit Images
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[500px]'>
          <DialogHeader>
            <DialogTitle>Edit Images</DialogTitle>
            <DialogDescription>
              Edit the images used around the site.
            </DialogDescription>
          </DialogHeader>
          <EditImagesForm
            images={props.images}
            setUploadedImages={setUploadedImages}
          />
          <DialogFooter>
            <Button type='button' onClick={handleSave}>
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
        <EditImagesForm
          images={props.images}
          setUploadedImages={setUploadedImages}
        />
        <DrawerFooter>
          <Button type='button' onClick={handleSave}>
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
