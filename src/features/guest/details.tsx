import { Colour, Detail } from '@/server/db/schema'

export function Details(props: { details: Detail; colours: Colour[] }) {
  return (
    <div>
      <p className='pt-14 text-5xl'>details</p>
      <div
        className={`border-primary mt-10 grid gap-4 rounded-2xl border-4 p-2 text-lg ${props.details.detailsTextSubheader ? '' : 'hidden'}`}
      >
        <p className='py-2 text-lg'>{props.details.detailsTextSubheader}</p>
      </div>
      <div
        className={`border-primary mt-10 grid gap-4 rounded-2xl border-4 p-2 text-lg ${props.details.adultsOnlyText ? '' : 'hidden'}`}
      >
        <p className='py-2 text-lg'>{props.details.adultsOnlyText}</p>
      </div>
      <div
        className={`border-primary mt-10 grid gap-4 rounded-2xl border-4 p-2 text-lg ${props.details.detailsText ? '' : 'hidden'}`}
      >
        <p className='py-2 text-lg'>{props.details.detailsText}</p>
      </div>
      <div
        className={`border-primary mt-10 grid gap-4 rounded-2xl border-4 p-2 text-lg ${props.details.dresscode ? '' : 'hidden'}`}
      >
        <p className='py-2 text-lg whitespace-pre-line'>
          {props.details.dresscode}
        </p>
        <div
          className={`mt-10 flex flex-wrap justify-center gap-4 p-2 ${
            props.colours.length > 0 ? '' : 'hidden'
          }`}
        >
          {props.colours.map((colour, index) => (
            <div key={index} className='flex items-center justify-center'>
              <div
                style={{ backgroundColor: colour.hex }}
                className='h-14 w-14 rounded-full'
              />
            </div>
          ))}
        </div>
      </div>
      <div
        className={`border-primary mt-10 grid gap-4 rounded-2xl border-4 p-2 text-lg ${props.details.registryMessage ? '' : 'hidden'}`}
      >
        <p className='py-2 text-lg'>{props.details.registryMessage}</p>
      </div>
    </div>
  )
}
