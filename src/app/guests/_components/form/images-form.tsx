import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import UploadThing from '@/components/ui/upload-thing'
import { FieldValues } from 'react-hook-form'

export function EditImagesForm(props: { form: any }) {
  return (
    <div className='grid gap-4 p-4'>
      <FormField
        control={props.form.control}
        name='logo'
        render={({ field }: { field: FieldValues }) => (
          <FormItem>
            <FormLabel htmlFor='logo'>Logo</FormLabel>
            <FormControl>
              <div className='items-center gap-4'>
                <UploadThing />
                <Input {...field} type='file' id='logo' className='text-base' />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
