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
import { Images } from '@/server/db/schema'
import { useEffect, useState } from 'react'
import { env } from '@/env'
import { ImageType } from '@/consts/image-types'

export function EditTimingsForm(props: { form: any }) {
  const [uploadedLogoImage, setUploadedLogoImage] = useState<
    Images | undefined
  >()

  useEffect(() => {
    if (uploadedLogoImage) {
      props.form.setValue('imageUrl', uploadedLogoImage.key)
    } else {
      props.form.setValue('imageUrl', '') // Clear the imageUrl if no image is uploaded
    }
  }, [uploadedLogoImage, props.form])

  const displayedLogoImage = uploadedLogoImage

  return (
    <div className='gap-4 p-4'>
      <div>
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
        <FormField
          control={props.form.control}
          name='altText'
          render={({ field }: { field: FieldValues }) => (
            <FormItem>
              <FormLabel htmlFor='altText'>Image Alt Text</FormLabel>
              <FormControl>
                <div className='items-center gap-4'>
                  <Input {...field} id='altText' className='text-base' />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <UploadThingImageLogo
          onUploadCompleteAction={setUploadedLogoImage}
          disabled={uploadedLogoImage !== undefined}
          type={ImageType.LOGO}
        />
        {displayedLogoImage && (
          <img
            src={`https://${env.NEXT_PUBLIC_UT_APP_ID}.ufs.sh/f/${displayedLogoImage.key}`}
            alt='Logo'
            className='w-24 h-24 object-contain'
          />
        )}
      </div>
    </div>
  )
}
