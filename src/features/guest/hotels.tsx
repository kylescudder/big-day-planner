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
        className={`grid gap-4 mt-10 p-2 border-primary border-4 rounded-2xl`}
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
          <CollapsibleContent className='overflow-hidden transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down'>
            <div className='relative z-10'>
              <div className='text-lg mx-auto text-center pt-7'>
                {props.hotels.map((hotel, index) => (
                  <div key={index} className='pb-5'>
                    <div className='flex flex-col items-center'>
                      <p>{hotel.name}</p>
                      <a
                        className='hover:underline text-primary'
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
