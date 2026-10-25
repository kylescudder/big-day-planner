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
import { updateRSVP } from '@/server/service'
import { format } from 'date-fns'
import LoadingPage from '@/components/ui/loading/loading-page'

export function RSVPAnswer(props: {
  guestData: Guest[]
  onRsvpAnswer: (guests: Guest[]) => void
  details: Detail
  espoused: Espoused
}) {
  const [rsvpAnswerNo, _] = useState<boolean>(
    props.guestData.every(
      (guest) => guest.rsvpAnswer === false && guest.rsvp === true
    )
  )
  const [loading, setLoading] = useState<boolean>(false)

  const form = useForm({
    defaultValues: {
      ...props.guestData
    }
  })

  async function onSubmit(guests: Guest[]) {
    setLoading(true)

    const updatedGuests: Guest[] = []

    for (const [_, value] of Object.entries(guests)) {
      const guest = {
        ...value,
        rsvp: true,
        rsvpAnswer:
          typeof value.rsvpAnswer === 'string'
            ? value.rsvpAnswer === 'true'
            : Boolean(value.rsvpAnswer),
        updatedAt: new Date()
      }

      await updateRSVP({ data: guest })
      updatedGuests.push(guest)
    }

    props.onRsvpAnswer(updatedGuests)
    setLoading(false)
  }

  return (
    <>
      {loading && <LoadingPage />}
      {rsvpAnswerNo ? (
        <p className='pb-3'>
          thanks for letting us know, you&apos;ll be missed!
        </p>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='border-primary mt-10 grid gap-4 rounded-2xl border-4 p-2'>
              {props.guestData.map((guest, index) => (
                <div key={index} className='pb-10 text-lg'>
                  <p className='text-primary text-lg'>
                    {guest.forename.toLowerCase()}
                  </p>
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
                            <FormItem className='flex items-center justify-between space-y-0 space-x-3'>
                              <FormLabel className='text-lg font-normal'>
                                wouldn&apos;t miss it for the world
                              </FormLabel>
                              <FormControl>
                                <RadioGroupItem
                                  value={'true'}
                                  className='bg-primary border-background text-secondary hover:border-secondary ml-auto rounded-4xl border-2 transition-colors duration-500 ease-in-out hover:border-2'
                                />
                              </FormControl>
                            </FormItem>
                            <FormItem className='flex items-center justify-between space-y-0 space-x-3'>
                              <FormLabel className='text-lg font-normal'>
                                will be there in spirit
                              </FormLabel>
                              <FormControl>
                                <RadioGroupItem
                                  value={'false'}
                                  className='bg-primary border-background text-secondary hover:border-secondary ml-auto rounded-4xl border-2 transition-colors duration-500 ease-in-out hover:border-2'
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
            <div className='flex items-center justify-between py-10'>
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
      )}
    </>
  )
}
