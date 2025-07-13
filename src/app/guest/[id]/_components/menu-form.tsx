import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel
} from '@/components/ui/form'
import {
  type Pudding,
  type Main,
  type Starter,
  type Guest
} from '@/server/db/schema'
import { updateMenuChoice } from '@/server/service'
import { useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { Textarea } from '@/components/ui/textarea'

export function MenuForm(props: {
  guestData: Guest[]
  starters: Starter[]
  mains: Main[]
  puddings: Pudding[]
}) {
  const [allMenuChosen, setAllMenuChosen] = useState<boolean>(
    props.guestData.every((guest) => {
      const hasStarter = props.starters.length > 0 ? guest.starterId : true
      const hasMain = props.mains.length > 0 ? guest.mainId : true
      const hasPudding = props.puddings.length > 0 ? guest.puddingId : true

      return hasStarter && hasMain && hasPudding
    })
  )

  const form = useForm({
    defaultValues: {
      ...props.guestData
    }
  })

  async function onSubmit(guests: Guest[]) {
    for (const [_, value] of Object.entries(guests)) {
      const guest = {
        ...value,
        updatedAt: new Date()
      }
      await updateMenuChoice(guest)
      const starter = props.starters.find(
        (starter) => starter.id === guest.starterId
      )
      const main = props.mains.find((main) => main.id === guest.mainId)
      const pudding = props.puddings.find(
        (pudding) => pudding.id === guest.puddingId
      )
      await fetch('/api/menu-choice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          forename: guest.forename,
          starter: starter,
          main: main,
          pudding: pudding
        })
      })
    }
    setAllMenuChosen(true)
  }

  return allMenuChosen ? (
    <p className='py-2'>Thanks for submitting your menu choice</p>
  ) : (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='grid gap-4'>
          {props.guestData.map((guest, index) => (
            <div key={index} className='text-lg pt-4'>
              <p className='text-lg'>{guest.forename}</p>
              {props.starters.length > 0 && (
                <article className='pt-4'>
                  <p className='text-secondary'>starter</p>
                  <FormField
                    control={form.control}
                    name={`${index}.starterId`}
                    render={({ field }) => (
                      <FormItem className='space-y-3'>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value ?? ''}
                            className='flex flex-col space-y-1'
                          >
                            {props.starters.map((starter, index) => (
                              <div key={index}>
                                <FormItem className='flex items-center space-x-3 space-y-0 justify-between'>
                                  <FormLabel className='font-normal'>
                                    {starter.text}
                                  </FormLabel>
                                  <FormControl>
                                    <RadioGroupItem
                                      value={starter.id}
                                      className='border-2 border-black'
                                    />
                                  </FormControl>
                                </FormItem>
                                {index !== props.starters.length - 1 && (
                                  <p>or</p>
                                )}
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </article>
              )}
              {props.mains.length > 0 && (
                <article className='pt-4'>
                  <p className='text-secondary'>main</p>
                  <FormField
                    control={form.control}
                    name={`${index}.mainId`}
                    render={({ field }) => (
                      <FormItem className='space-y-3'>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value ?? ''}
                            className='flex flex-col space-y-1'
                          >
                            {props.mains.map((main, index) => (
                              <div key={index}>
                                <FormItem
                                  key={index}
                                  className='flex items-center space-x-3 space-y-0 justify-between'
                                >
                                  <FormLabel className='font-normal'>
                                    {main.text}
                                  </FormLabel>
                                  <FormControl>
                                    <RadioGroupItem
                                      value={main.id}
                                      className='border-2 border-black'
                                    />
                                  </FormControl>
                                </FormItem>
                                {index !== props.starters.length - 1 && (
                                  <p>or</p>
                                )}
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </article>
              )}
              {props.puddings.length > 0 && (
                <article className='pt-4'>
                  <p className='text-secondary'>pudding</p>
                  <FormField
                    control={form.control}
                    name={`${index}.puddingId`}
                    render={({ field }) => (
                      <FormItem className='space-y-3'>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value ?? ''}
                            className='flex flex-col space-y-1'
                          >
                            {props.puddings.map((pudding, index) => (
                              <div key={index}>
                                <FormItem
                                  key={index}
                                  className='flex items-center space-x-3 space-y-0 justify-between'
                                >
                                  <FormLabel className='font-normal'>
                                    {pudding.text}
                                  </FormLabel>
                                  <FormControl>
                                    <RadioGroupItem
                                      value={pudding.id}
                                      className='border-2 border-black'
                                    />
                                  </FormControl>
                                </FormItem>
                                {index !== props.starters.length - 1 && (
                                  <p>or</p>
                                )}
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </article>
              )}
              <FormField
                control={form.control}
                name={`${index}.dietaryRequirements`}
                render={({ field }: { field: FieldValues }) => (
                  <FormItem className='pt-4'>
                    <FormLabel
                      htmlFor='dietaryRequirements'
                      className='text-secondary'
                    >
                      dietary requirements
                    </FormLabel>
                    <FormControl>
                      <div className='items-center gap-4'>
                        <Textarea
                          {...field}
                          id='dietaryRequirements'
                          className='text-base'
                          variant='ghost'
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
          <Button
            type='submit'
            size='xs'
            variant='menu'
            className='float-right ml-auto w-20'
          >
            <p>submit</p>
          </Button>
        </div>
      </form>
    </Form>
  )
}
