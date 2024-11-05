'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { type Guest } from '@/server/db/schema'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useForm } from 'react-hook-form'
import { updateRSVP } from '@/server/service'

export function RSVPAnswer(props: { guestData: Guest[] }) {
  const [rsvpAnswerNo, setRsvpAnswerNo] = useState<boolean>(
    props.guestData.every(
      (guest) => guest.rsvpAnswer === false && guest.rsvp === true
    )
  )

  const form = useForm({
    defaultValues: {
      ...props.guestData
    }
  })

  async function onSubmit(guests: Guest[]) {
    for (const [key, value] of Object.entries(guests)) {
      const guest = {
        ...value,
        rsvp: true,
        rsvpAnswer:
          typeof value.rsvpAnswer === 'string'
            ? value.rsvpAnswer === 'true'
            : Boolean(value.rsvpAnswer),
        updatedAt: new Date()
      }

      await updateRSVP(guest)
      await fetch('/api/rsvp-choice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          forename: guest.forename,
          rsvpAnswer: guest.rsvpAnswer
        })
      })
    }
    setRsvpAnswerNo(true)
  }

  return rsvpAnswerNo === true ? (
    <p className='pb-3'>thanks for letting us know, you&apos;ll be missed!</p>
  ) : (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='grid gap-4'>
          {props.guestData.map((guest, index) => (
            <div key={index} className='text-lg pb-10'>
              <p className='text-lg'>{guest.forename}</p>
              <FormField
                control={form.control}
                name={`${index}.rsvpAnswer`}
                render={({ field }) => (
                  <FormItem className='space-y-3'>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        className='flex flex-col space-y-1'
                      >
                        <FormItem className='flex items-center space-x-3 space-y-0 justify-between'>
                          <FormLabel className='font-normal'>
                            wouldn&apos;t miss it for the world
                          </FormLabel>
                          <FormControl>
                            <RadioGroupItem
                              value={'true'}
                              className='bg-primary border-background border-2 text-secondary rounded-4xl ml-auto hover:border-secondary hover:border-2 transition-colors ease-in-out duration-500'
                            />
                          </FormControl>
                        </FormItem>
                        <FormItem className='flex items-center space-x-3 space-y-0 justify-between'>
                          <FormLabel className='font-normal'>
                            will be there in spirit
                          </FormLabel>
                          <FormControl>
                            <RadioGroupItem
                              value={'false'}
                              className='bg-primary border-background border-2 text-secondary rounded-4xl ml-auto hover:border-secondary hover:border-2 transition-colors ease-in-out duration-500'
                            />
                          </FormControl>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
          <div className='flex justify-between items-center pb-10'>
            <p className='text-xs'>
              We kindly ask you let us know by 00/00/2025
            </p>
            <Button
              type='submit'
              size='xs'
              variant='rsvp'
              className='float-right'
            >
              <p>submit</p>
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
