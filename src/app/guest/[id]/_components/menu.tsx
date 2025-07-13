import { MenuForm } from './menu-form'
import {
  type Pudding,
  type Main,
  type Starter,
  type Guest,
  Detail
} from '@/server/db/schema'
import { format } from 'date-fns'

export function Menu(props: {
  guestData: Guest[]
  starters: Starter[]
  mains: Main[]
  puddings: Pudding[]
  details: Detail
}) {
  return (
    <section>
      <p className='text-5xl pt-14'>menu</p>
      <div className='grid gap-4 mt-10 p-2 border-primary border-4 rounded-2xl'>
        <MenuForm
          guestData={props.guestData}
          starters={props.starters}
          mains={props.mains}
          puddings={props.puddings}
        />
      </div>
      <div>
        {props.details.menuDeadlineDateTime ? (
          <p className='text-center pt-4 text-lg'>
            we kindly ask you to make your choices by{' '}
            {format(props.details.menuDeadlineDateTime, 'dd/MM/yyyy')}
          </p>
        ) : null}
      </div>
    </section>
  )
}
