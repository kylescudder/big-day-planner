import { Checkbox } from '@/components/ui/checkbox'
import { DateTimePicker } from '@/components/ui/datetimepicker'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { enGB } from 'date-fns/locale'
import { FieldValues } from 'react-hook-form'

export function EditDetailsForm(props: { form: any }) {
  return (
    <div className='grid grid-cols-12 gap-4 p-4'>
      <div className='col-span-4'>
        <FormField
          control={props.form.control}
          name='address1'
          rules={{ required: 'Address 1 is required' }}
          render={({ field }: { field: FieldValues }) => (
            <FormItem>
              <FormLabel htmlFor='address1'>Address 1</FormLabel>
              <FormControl>
                <div className='items-center gap-4'>
                  <Input {...field} id='address1' className='text-base' />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={props.form.control}
          name='address2'
          render={({ field }: { field: FieldValues }) => (
            <FormItem>
              <FormLabel htmlFor='address2'>Address 2</FormLabel>
              <FormControl>
                <div className='items-center gap-4'>
                  <Input {...field} id='address2' className='text-base' />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={props.form.control}
          name='address3'
          render={({ field }: { field: FieldValues }) => (
            <FormItem>
              <FormLabel htmlFor='address3'>Address 3</FormLabel>
              <FormControl>
                <div className='items-center gap-4'>
                  <Input {...field} id='address3' className='text-base' />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={props.form.control}
          name='town'
          rules={{ required: 'Town is required' }}
          render={({ field }: { field: FieldValues }) => (
            <FormItem>
              <FormLabel htmlFor='town'>Town</FormLabel>
              <FormControl>
                <div className='items-center gap-4'>
                  <Input {...field} id='town' className='text-base' />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={props.form.control}
          name='county'
          rules={{ required: 'County is required' }}
          render={({ field }: { field: FieldValues }) => (
            <FormItem>
              <FormLabel htmlFor='county'>County</FormLabel>
              <FormControl>
                <div className='items-center gap-4'>
                  <Input {...field} id='county' className='text-base' />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={props.form.control}
          name='postcode'
          rules={{ required: 'Postcode is required' }}
          render={({ field }: { field: FieldValues }) => (
            <FormItem>
              <FormLabel htmlFor='postcode'>Postcode</FormLabel>
              <FormControl>
                <div className='items-center gap-4'>
                  <Input {...field} id='postcode' className='text-base' />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className='col-span-4'>
        <FormField
          control={props.form.control}
          name='adultsOnlyText'
          render={({ field }: { field: FieldValues }) => (
            <FormItem>
              <FormLabel htmlFor='adultsOnlyText'>Adult Only Text</FormLabel>
              <FormControl>
                <div className='items-center gap-4'>
                  <Input {...field} id='adultsOnlyText' className='text-base' />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={props.form.control}
          name='detailsTextSubheader'
          render={({ field }: { field: FieldValues }) => (
            <FormItem>
              <FormLabel htmlFor='detailsTextSubheader'>
                Details Subheader Text
              </FormLabel>
              <FormControl>
                <div className='items-center gap-4'>
                  <Input
                    {...field}
                    id='detailsTextSubheader'
                    className='text-base'
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={props.form.control}
          name='detailsText'
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor='detailsText'>Details Text</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  id='detailsText'
                  placeholder='The details of your big day'
                  className='resize-none text-base'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={props.form.control}
          name='dresscode'
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor='dresscode'>Dress code</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  id='dresscode'
                  placeholder='formal... black tie...'
                  className='resize-none text-base'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={props.form.control}
          name='registryMessage'
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor='registryMessage'>Registry Message</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  id='registryMessage'
                  className='text-base'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className='col-span-4'>
        <FormField
          control={props.form.control}
          name='songRequest'
          render={({ field }) => (
            <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className='space-y-1 leading-none'>
                <FormLabel>Allow Song Requests?</FormLabel>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={props.form.control}
          name='startDateTime'
          render={({ field }) => (
            <FormItem className='flex w-72 flex-col gap-2'>
              <FormLabel htmlFor='datetime'>Start Date time</FormLabel>
              <FormControl>
                <DateTimePicker
                  displayFormat={{ hour24: 'dd/MM/yyyy hh:mmaaa' }}
                  locale={enGB}
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={props.form.control}
          name='endDateTime'
          render={({ field }) => (
            <FormItem className='flex w-72 flex-col gap-2'>
              <FormLabel htmlFor='datetime'>End Date time</FormLabel>
              <FormControl>
                <DateTimePicker
                  displayFormat={{ hour24: 'dd/MM/yyyy hh:mmaaa' }}
                  locale={enGB}
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={props.form.control}
          name='rsvpDeadlineDateTime'
          render={({ field }) => (
            <FormItem className='flex w-72 flex-col gap-2'>
              <FormLabel htmlFor='datetime'>RSVP Deadline Date time</FormLabel>
              <FormControl>
                <DateTimePicker
                  displayFormat={{ hour24: 'dd/MM/yyyy hh:mmaaa' }}
                  locale={enGB}
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={props.form.control}
          name='menuDeadlineDateTime'
          render={({ field }) => (
            <FormItem className='flex w-72 flex-col gap-2'>
              <FormLabel htmlFor='datetime'>Menu Deadline Date time</FormLabel>
              <FormControl>
                <DateTimePicker
                  displayFormat={{ hour24: 'dd/MM/yyyy hh:mmaaa' }}
                  locale={enGB}
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
