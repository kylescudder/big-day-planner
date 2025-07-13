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
import { Detail, Espoused, type Guest } from '@/server/db/schema'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useForm } from 'react-hook-form'
import { getEspousedRecord, updateRSVP } from '@/server/service'
import { format, subMonths } from 'date-fns'

export function RSVPAnswer(props: {
  guestData: Guest[]
  onRsvpAnswer: (rsp: boolean, rsvpAnswer: boolean) => void
  details: Detail
}) {
  const [rsvpAnswerNo, _] = useState<boolean>(
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

      const espoused: Espoused | null = await getEspousedRecord()
      if (!espoused) throw new Error('espoused not found')

      await updateRSVP(guest)
      await fetch('/api/rsvp-choice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          forename: guest.forename,
          rsvpAnswer: guest.rsvpAnswer,
          brideEmail: espoused.brideEmail,
          groomEmail: espoused.groomEmail
        })
      })

      await fetch('/api/rsvp-thanks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          forename: guest.forename,
          email: guest.email,
          rsvpAnswer: guest.rsvpAnswer,
          bride: espoused.bride,
          groom: espoused.groom
        })
      })
      props.onRsvpAnswer(guest.rsvp, guest.rsvpAnswer)
    }
  }

  return rsvpAnswerNo === true ? (
    <p className='pb-3'>thanks for letting us know, you&apos;ll be missed!</p>
  ) : (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-4 mt-10 p-2 border-primary border-4 rounded-2xl'>
            {props.guestData.map((guest, index) => (
              <div key={index} className='text-lg pb-10'>
                <p className='text-lg text-primary'>{guest.forename}</p>
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
                            <FormLabel className='font-normal text-lg'>
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
                            <FormLabel className='font-normal text-lg'>
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
          </div>
          <div className='flex justify-between items-center py-10'>
            {props.details.rsvpDeadlineDateTime ? (
              <p className='text-xs'>
                we kindly ask you let us know by{' '}
                {format(props.details.rsvpDeadlineDateTime, 'dd/MM/yyyy')}
              </p>
            ) : null}
            <Button
              type='submit'
              size='xs'
              variant='rsvp'
              className='float-right'
            >
              <p>submit</p>
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}
