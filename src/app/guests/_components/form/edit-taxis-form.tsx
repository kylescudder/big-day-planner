import { Input } from '@/components/ui/input'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { TimePicker } from '@/components/ui/timepicker'
import { FieldValues } from 'react-hook-form'
import UploadThingImageLogo from '@/components/ui/upload-thing'
import { env } from '@/env'
import { ImageType } from '@/consts/image-types'

export function EditTaxisForm(props: { form: any }) {
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
          name='phone'
          rules={{ required: 'Phone number is required' }}
          render={({ field }: { field: FieldValues }) => (
            <FormItem>
              <FormLabel htmlFor='event'>Event</FormLabel>
              <FormControl>
                <div className='items-center gap-4'>
                  <Input {...field} id='event' className='text-base' />
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
