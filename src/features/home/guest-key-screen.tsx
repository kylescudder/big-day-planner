import { uploadUrl } from '@/lib/uploads'
import { Images } from '@/server/db/schema'
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
import { trpc } from '@/lib/trpc'
import { useNavigate } from '@tanstack/react-router'
import LoadingPage from '@/components/ui/loading/loading-page'

export function GuestKeyScreen({
  backgroundImage
}: {
  backgroundImage: Images
}) {
  const [showOverlay, setShowOverlay] = useState(true)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => setShowOverlay(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const bgUrl = `url(${uploadUrl(backgroundImage.key)})`

  const form = useForm({
    defaultValues: {
      guestKey: ''
    }
  })

  async function onSubmit(values: { guestKey: string }) {
    setLoading(true)
    const guest = await trpc.guestByKey.mutate({ guestKey: values.guestKey })

    if (guest) {
      await navigate({ to: '/guest/$id', params: { id: guest.id } })
      return
    }
    form.setError('guestKey', {
      type: 'manual',
      message: 'invalid key. please try again.'
    })
    setLoading(false)
  }

  return (
    <div
      className='relative flex min-h-screen items-center justify-center bg-cover bg-center'
      style={{ backgroundImage: bgUrl }}
    >
      {loading && <LoadingPage />}
      <div
        className={`
          fixed inset-0 z-20 bg-cover bg-center
          transition-opacity duration-2000
          ${showOverlay ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}
        `}
        style={{ backgroundImage: bgUrl }}
      />

      {/* Dim overlay after fade */}
      {!showOverlay && (
        <div className='pointer-events-none fixed inset-0 z-10 bg-black/10 transition-opacity duration-2000' />
      )}

      {/* Centered form */}
      {!showOverlay && (
        <div className='z-30 flex w-[85%] flex-col items-center'>
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
                          placeholder='enter your unique code'
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
