import { Colour, Detail } from '@/server/db/schema'

export function Details(props: { details: Detail; colours: Colour[] }) {
  return (
    <div>
      <p className='text-5xl pt-14'>details</p>
      <div
        className={`grid gap-4 mt-10 p-2 border-primary border-4 rounded-2xl ${props.details.detailsTextSubheader ? '' : 'hidden'}`}
      >
        <p className='py-2'>{props.details.detailsTextSubheader}</p>
      </div>
      <div
        className={`grid gap-4 mt-10 p-2 border-primary border-4 rounded-2xl ${props.details.adultsOnlyText ? '' : 'hidden'}`}
      >
        <p className='py-2'>{props.details.adultsOnlyText}</p>
      </div>
      <div
        className={`grid gap-4 mt-10 p-2 border-primary border-4 rounded-2xl ${props.details.detailsText ? '' : 'hidden'}`}
      >
        <p className='py-2'>{props.details.detailsText}</p>
      </div>
      <div
        className={`grid gap-4 mt-10 p-2 border-primary border-4 rounded-2xl ${props.details.dresscode ? '' : 'hidden'}`}
      >
        <p className='py-2 whitespace-pre-line'>{props.details.dresscode}</p>
        <div
          className={`flex flex-wrap justify-center gap-4 mt-10 p-2 ${
            props.colours.length > 0 ? '' : 'hidden'
          }`}
        >
          {props.colours.map((colour, index) => (
            <div key={index} className='flex items-center justify-center'>
              <div
                style={{ backgroundColor: colour.hex }}
                className='w-14 h-14 rounded-full'
              />
            </div>
          ))}
        </div>
      </div>
      <div
        className={`grid gap-4 mt-10 p-2 border-primary border-4 rounded-2xl ${props.details.registryMessage ? '' : 'hidden'}`}
      >
        <p className='py-2'>{props.details.registryMessage}</p>
      </div>
    </div>
  )
}
