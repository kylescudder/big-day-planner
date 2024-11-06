import { Detail } from '@/server/db/schema'

export function Details(props: { details: Detail }) {
  return (
    <div className='text-background'>
      <p className='text-3xl pt-14'>details</p>
      <div className='text-lg'>
        <p className='pt-10'>{props.details.detailsTextSubheader}</p>
        <p className='pt-10'>{props.details.adultsOnlyText}</p>
        <p className='pt-10'>{props.details.detailsText}</p>
        <p className='pt-10'>{props.details.dresscode}</p>
      </div>
    </div>
  )
}
