import { Hotel } from '@/server/db/schema'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'

export function Hotels(props: { hotels: Hotel[] | null }) {
  if (props.hotels != null) {
    return (
      <div
        className={`border-primary mt-10 grid gap-4 rounded-2xl border-4 p-2`}
      >
        <p className='text-lg'>
          for those that want to stay overnight, here are a list of local hotels
          and bed & breakfasts
        </p>
        <Collapsible className='w-full space-y-2'>
          <CollapsibleTrigger className='w-full'>
            <Button className='text-lg' variant='default'>
              hotel
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className='data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden transition-all'>
            <div className='relative z-10'>
              <div className='mx-auto pt-7 text-center text-lg'>
                {props.hotels.map((hotel, index) => (
                  <div key={index} className='pb-5'>
                    <div className='flex flex-col items-center'>
                      <p>{hotel.name}</p>
                      <a
                        className='text-primary hover:underline'
                        target='_blank'
                        href={hotel.url}
                      >
                        find it here
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    )
  }
}
