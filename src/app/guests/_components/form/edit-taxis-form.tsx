import { Input } from '@/components/ui/input'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { FieldValues } from 'react-hook-form'

export function EditTaxisForm(props: { form: any }) {
  return (
    <div className='gap-4 p-4'>
      <div>
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
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor='description'>Description</FormLabel>
              <FormControl>
                <Input {...field} id='description' className='text-base' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={props.form.control}
          name='phone'
          rules={{ required: 'Phone number is required' }}
          render={({ field }: { field: FieldValues }) => (
            <FormItem>
              <FormLabel htmlFor='phone'>Phone</FormLabel>
              <FormControl>
                <div className='items-center gap-4'>
                  <Input {...field} id='phone' className='text-base' />
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
