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
import { Main, Pudding, Starter, starters } from '@/server/db/schema'
import {
  updateMainRecords,
  updatePuddingRecords,
  updateStarterRecords
} from '@/server/service'
import { IconEdit } from '@tabler/icons-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { EditMealsForm } from './form/edit-meals-form'
import { Meals } from '@/types/meals'

export function EditMeals(props: {
  starters: Starter[]
  mains: Main[]
  puddings: Pudding[]
  onMealsSave: () => void
}) {
  const [open, setOpen] = useState(false)

  const isDesktop = useMediaQuery('(min-width: 768px)')

  const form = useForm<Meals>({
    defaultValues: {
      starters: props.starters ?? [],
      mains: props.mains ?? [],
      puddings: props.puddings ?? []
    }
  })

  async function handleMealChange(values: Meals) {
    const meals = {
      ...values
    }
    if (
      JSON.stringify(meals.starters) !=
      JSON.stringify(form.getValues('starters'))
    ) {
      form.setValue('starters', meals.starters)
      await updateStarterRecords(meals.starters)
    }
    if (
      JSON.stringify(meals.mains) != JSON.stringify(form.getValues('mains'))
    ) {
      form.setValue('mains', meals.mains)
      await updateMainRecords(meals.mains)
    }
    if (
      JSON.stringify(meals.puddings) !=
      JSON.stringify(form.getValues('puddings'))
    ) {
      form.setValue('puddings', meals.puddings)
      await updatePuddingRecords(meals.puddings)
    }
    props.onMealsSave()
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant='outline' className='mx-2'>
            <IconEdit className='pr-2' />
            Edit Meals
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[500px]'>
          <DialogHeader>
            <DialogTitle>Edit Meals</DialogTitle>
            <DialogDescription>Edit the meals of the day.</DialogDescription>
          </DialogHeader>
          <EditMealsForm
            meals={form.getValues()}
            onMealsChange={handleMealChange}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant='outline'>Close</Button>
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
          <IconEdit className='pr-2' />
          Edit Meals
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit Meals</DrawerTitle>
          <DrawerDescription>Edit the meals of the day.</DrawerDescription>
        </DrawerHeader>
        <EditMealsForm
          meals={form.getValues()}
          onMealsChange={handleMealChange}
        />
        <DrawerFooter>
          <DrawerClose asChild>
            <Button className='w-full' variant='outline'>
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
