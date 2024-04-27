import { Button } from '@/components/ui/button'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { type Guest } from '@/server/db/schema'
import { updateSongChoice } from '@/server/service'
import { useForm, type FieldValues } from 'react-hook-form'

export function SongRequestForm(props: { guest: Guest }) {
  const form = useForm({
    defaultValues: {
      ...props.guest
    }
  })

  async function onSubmit(values: Guest) {
    const guest = {
      ...values,
      updatedAt: new Date()
    }
    await updateSongChoice(guest)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='grid gap-4 py-4'>
          <FormField
            control={form.control}
            name='artist'
            render={({ field }: { field: FieldValues }) => (
              <FormItem>
                <FormLabel htmlFor='artist'>Artist</FormLabel>
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
                <FormLabel htmlFor='song'>Song</FormLabel>
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
          />
        </div>
        <Button
          type='submit'
          size='xs'
          variant='songrequest'
          className='float-right'
        >
          <p>submit</p>
        </Button>
      </form>
    </Form>
  )
}
