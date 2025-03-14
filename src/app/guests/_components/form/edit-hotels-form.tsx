import { Input } from '@/components/ui/input'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { FieldValues } from 'react-hook-form'

export function EditHotelsForm(props: { form: any }) {
  return (
    <div className='grid grid-cols-12 gap-4 p-4'>
      <div className='col-span-4'>
        <FormField
          control={props.form.control}
          name='name'
          rules={{ required: 'Name is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor='name'>Name</FormLabel>
              <FormControl>
                <Input {...field} id='name' className='text-base' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={props.form.control}
          name='url'
          rules={{ required: 'URL is required' }}
          render={({ field }: { field: FieldValues }) => (
            <FormItem>
              <FormLabel htmlFor='url'>URL</FormLabel>
              <FormControl>
                <div className='items-center gap-4'>
                  <Input {...field} id='url' className='text-base' />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
