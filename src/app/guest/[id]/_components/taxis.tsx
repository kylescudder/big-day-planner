import { Taxi } from '@/server/db/schema'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'

export function Taxis(props: { taxis: Taxi[] | null }) {
  if (props.taxis != null) {
    return (
      <div
        className={`grid gap-4 mt-10 p-2 border-primary border-4 rounded-2xl`}
      >
        <p className='text-lg'>
          for those who will be staying close or not driving, here are a list of
          local taxi numbers
        </p>
        <Collapsible className='w-full space-y-2'>
          <CollapsibleTrigger className='w-full'>
            <Button className='text-lg' variant='default'>
              taxi
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className='overflow-hidden transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down'>
            <div className='relative z-10'>
              <div className='text-lg mx-auto text-center pt-7'>
                {props.taxis.map((taxi, index) => (
                  <div key={index} className='pb-5'>
                    <div className='flex flex-col items-center'>
                      <p>{taxi.name}</p>
                      <p>{taxi.description}</p>
                      <a
                        className='hover:underline text-primary'
                        href={`tel:${taxi.phone}`}
                      >
                        {taxi.phone}
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
