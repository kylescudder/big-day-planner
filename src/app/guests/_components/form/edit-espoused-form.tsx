import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { FieldValues } from 'react-hook-form'

export function EditEspousedForm(props: { form: any }) {
  return (
    <div className='grid gap-4 p-4'>
      <FormField
        control={props.form.control}
        name='groom'
        rules={{ required: 'Groom is required' }}
        render={({ field }: { field: FieldValues }) => (
          <FormItem>
            <FormLabel htmlFor='groom'>Groom</FormLabel>
            <FormControl>
              <div className='items-center gap-4'>
                <Input {...field} id='groom' className='text-base' />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={props.form.control}
        name='bride'
        render={({ field }: { field: FieldValues }) => (
          <FormItem>
            <FormLabel htmlFor='bride'>Bride</FormLabel>
            <FormControl>
              <div className='items-center gap-4'>
                <Input {...field} id='bride' className='text-base' />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={props.form.control}
        name='groomEmail'
        rules={{ required: 'Groom email is required' }}
        render={({ field }: { field: FieldValues }) => (
          <FormItem>
            <FormLabel htmlFor='groomEmail'>Groom Email</FormLabel>
            <FormControl>
              <div className='items-center gap-4'>
                <Input {...field} id='groomEmail' className='text-base' />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={props.form.control}
        name='brideEmail'
        render={({ field }: { field: FieldValues }) => (
          <FormItem>
            <FormLabel htmlFor='brideEmail'>Bride Email</FormLabel>
            <FormControl>
              <div className='items-center gap-4'>
                <Input {...field} id='brideEmail' className='text-base' />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
