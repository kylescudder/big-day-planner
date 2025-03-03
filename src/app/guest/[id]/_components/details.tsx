import { Detail } from '@/server/db/schema'

export function Details(props: { details: Detail }) {
  return (
    <div>
      <p className='text-5xl pt-14'>details</p>
      <div className='grid gap-4 mt-10 p-2 border-primary border-4 rounded-2xl'>
        <p className='pt-10'>{props.details.detailsTextSubheader}</p>
        <p className='pt-10'>{props.details.adultsOnlyText}</p>
        <p className='pt-10'>{props.details.detailsText}</p>
        <p className='pt-10'>{props.details.dresscode}</p>
      </div>
    </div>
  )
}
