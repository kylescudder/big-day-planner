'use client'

import { env } from '@/env'
import { Guest, Images } from '@/server/db/schema'
import { useEffect, useState } from 'react'
import { useForm, type FieldValues } from 'react-hook-form'
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { getGuestByKeyRecord } from '@/server/service'
import { redirect } from 'next/navigation'
import LoadingPage from '@/components/ui/loading/loading-page'

export function GuestKeyScreen({
  backgroundImage
}: {
  backgroundImage: Images
}) {
  const [showOverlay, setShowOverlay] = useState(true)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowOverlay(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const bgUrl = `url(https://${env.NEXT_PUBLIC_UT_APP_ID}.ufs.sh/f/${backgroundImage.key})`

  const form = useForm({
    defaultValues: {
      guestKey: ''
    }
  })

  async function onSubmit(values: { guestKey: string }) {
    setLoading(true)
    const guest: Guest[] | undefined = await getGuestByKeyRecord(
      values.guestKey.toLowerCase()
    )

    if (guest != undefined && guest.length > 0) {
      redirect(`/guest/${guest[0]!.id}`)
    }
    form.setError('guestKey', {
      type: 'manual',
      message: 'Invalid key. Please try again.'
    })
    setLoading(false)
  }

  return (
    <div
      className='relative min-h-screen flex items-center justify-center bg-cover bg-center'
      style={{ backgroundImage: bgUrl }}
    >
      {loading && <LoadingPage />}
      <div
        className={`
          fixed inset-0 z-20 bg-cover bg-center
          transition-opacity duration-2000
          ${showOverlay ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        style={{ backgroundImage: bgUrl }}
      />

      {/* Dim overlay after fade */}
      {!showOverlay && (
        <div className='fixed inset-0 bg-black/10 z-10 pointer-events-none transition-opacity duration-2000' />
      )}

      {/* Centered form */}
      {!showOverlay && (
        <div className='z-30 flex flex-col items-center w-[85%]'>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='w-full max-w-xs'
            >
              <div className='grid gap-4'>
                <FormField
                  control={form.control}
                  name='guestKey'
                  render={({ field }: { field: FieldValues }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          id='guest-key'
                          placeholder='Enter your guest key'
                          className='text-base'
                          variant='default'
                          autoFocus
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type='submit'
                  size='xs'
                  variant='songrequest'
                  className='float-right ml-auto w-20'
                >
                  <p>submit</p>
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  )
}
