'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { type Guest } from '@/server/db/schema'

export function RSVPAnswer(props: { guest: Guest }) {
  return (
    <div className='pb-10'>
      <p className='text-lg'>{props.guest.forename}</p>
      <div className='flex items-center'>
        <label
          htmlFor='terms'
          className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
        >
          wouldn't miss it for the world
        </label>
        <Checkbox
          className='bg-primary border-background border-2 text-secondary rounded-4xl ml-auto' // added ml-auto to float to the right
          onCheckedChange={(value) => console.log(value)}
          aria-label='RSVP Yes'
        />
      </div>
      <div className='flex items-center pt-2'>
        <label
          htmlFor='terms'
          className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
        >
          will be there in spirit
        </label>
        <Checkbox
          className='bg-primary border-background border-2 text-secondary rounded-4xl ml-auto' // added ml-auto to float to the right
          onCheckedChange={(value) => console.log(value)}
          aria-label='RSVP No'
        />
      </div>
    </div>
  )
}
