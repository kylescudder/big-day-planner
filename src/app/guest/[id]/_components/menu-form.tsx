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
import { useForm } from 'react-hook-form'

export function MenuForm(props: {
  guestData: Guest[]
  starters: Starter[]
  mains: Main[]
  puddings: Pudding[]
}) {
  const [allMenuChosen, setAllMenuChosen] = useState<boolean>(
    props.guestData.every(
      (guest) => guest.starterId && guest.mainId && guest.puddingId
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
        updatedAt: new Date()
      }
      await updateMenuChoice(guest)
    }
    setAllMenuChosen(true)
  }

  return allMenuChosen === true ? (
    <p className='pb-3 pt-10'>Thanks for submitting your menu choice</p>
  ) : (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='grid gap-4'>
          {props.guestData.map((guest, index) => (
            <div key={index} className='text-lg pt-10'>
              <p className='text-lg'>{guest.forename}</p>
              <p className='text-secondary pb-5'>starter</p>
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
                            {index !== props.starters.length - 1 && <p>or</p>}
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <p className='text-secondary pb-5'>main</p>
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
                            {index !== props.starters.length - 1 && <p>or</p>}
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <p className='text-secondary pb-5'>pudding</p>
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
                            {index !== props.starters.length - 1 && <p>or</p>}
                          </div>
                        ))}
                      </RadioGroup>
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
