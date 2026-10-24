import { MenuForm } from './menu-form'
import {
  type Pudding,
  type Main,
  type Starter,
  type Guest,
  Detail,
  Espoused
} from '@/server/db/schema'
import { format } from 'date-fns'

export function Menu(props: {
  guestData: Guest[]
  starters: Starter[]
  mains: Main[]
  puddings: Pudding[]
  details: Detail
  espoused: Espoused
}) {
  return (
    <section>
      <p className='pt-14 text-5xl'>menu</p>
      <div className='border-primary mt-10 grid gap-4 rounded-2xl border-4 p-2'>
        <MenuForm
          guestData={props.guestData}
          starters={props.starters}
          mains={props.mains}
          puddings={props.puddings}
          espoused={props.espoused}
        />
      </div>
      <div>
        {props.details.menuDeadlineDateTime ? (
          <p className='pt-4 text-center text-lg'>
            we kindly ask you to make your choices by{' '}
            {format(props.details.menuDeadlineDateTime, 'dd/MM/yyyy')}
          </p>
        ) : null}
      </div>
    </section>
  )
}
