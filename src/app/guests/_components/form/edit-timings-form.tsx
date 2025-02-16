import { Input } from '@/components/ui/input'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { TimePicker } from '@/components/ui/timepicker'

export function EditTimingsForm(props: { form: any }) {
  return (
    <div className='grid grid-cols-12 gap-4 p-4'>
      <div className='col-span-4'>
        <FormField
          control={props.form.control}
          name='time'
          rules={{ required: 'Time is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time</FormLabel>
              <FormControl>
                <TimePicker
                  date={field.value}
                  setDate={(date) => field.onChange(date)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={props.form.control}
          name='event'
          rules={{ required: 'Event description is required' }}
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
