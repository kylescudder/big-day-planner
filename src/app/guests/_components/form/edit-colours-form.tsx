'use client'
import type { UseFormReturn } from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import type { Colour } from '@/server/db/schema'
import { ColourPicker } from '@/components/ui/colour-picker'

interface EditColoursFormProps {
  form: UseFormReturn<Colour>
}

export function EditColoursForm({ form }: EditColoursFormProps) {
  // Get the current hex value from the form
  const hexValue = form.watch('hex')

  // Update the form value when the colour picker changes
  const handleColourChange = (value: string) => {
    form.setValue('hex', value, { shouldValidate: true, shouldDirty: true })
  }

  return (
    <div className='grid gap-4 py-4'>
      <FormField
        control={form.control}
        name='hex'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Colour</FormLabel>
            <FormControl>
              <div className='flex items-center gap-4'>
                <ColourPicker
                  colour={field.value}
                  onChange={handleColourChange}
                />
                <div className='flex-1'>
                  <Input
                    {...field}
                    placeholder='#000000'
                    className='font-mono'
                  />
                </div>
                <div
                  className='h-10 w-10 rounded-md border'
                  style={{ backgroundColor: hexValue }}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
