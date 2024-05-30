import { Button } from '@/components/ui/button'
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { type Guest } from '@/server/db/schema'
import { updateMenuChoice } from '@/server/service'
import { useState } from 'react'
import { useForm, type FieldValues } from 'react-hook-form'

export function MenuForm(props: {
  guestData: Guest[]
  starters: string[]
  mains: string[]
  puddings: string[]
}) {
  const [menuChosen, setMenuChosen] = useState<boolean>(false)

  const form = useForm({
    defaultValues: {
      ...props.guestData
    }
  })

  async function onSubmit(values: Guest) {
    const guest = {
      ...values,
      updatedAt: new Date()
    }
    await updateMenuChoice(guest)
    setMenuChosen(true)
  }

  return menuChosen === true ? (
    <p className='pb-3'>
      Thanks for submitting your menu choice {props.guest.forename}!
    </p>
  ) : (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='grid gap-4'>
          {props.guestData.map((guest, index) => (
            <p className='text-lg'>{props.guest.forename}</p>
          ))}
          {/*<FormField
            control={form.control}
            name='artist'
            render={({ field }: { field: FieldValues }) => (
              <FormItem>
                <FormControl>
                  <div className='items-center gap-4'>
                    <Input
                      {...field}
                      id='artist'
                      className='text-base'
                      placeholder='artist'
                      variant='default'
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='song'
            render={({ field }: { field: FieldValues }) => (
              <FormItem>
                <FormControl>
                  <div className='items-center gap-4'>
                    <Input
                      {...field}
                      id='song'
                      placeholder='song title'
                      className='text-base'
                      variant='default'
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />*/}
          <Button
            type='submit'
            size='xs'
            variant='songrequest'
            className='float-right ml-auto w-20'
          >
            <p>submit</p>
          </Button>
        </div>
      </form>
    </Form>
  )
}
