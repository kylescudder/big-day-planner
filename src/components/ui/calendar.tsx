import * as React from 'react'
import { DayPicker } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption_label: 'text-sm font-medium',
        nav: 'space-x-1 flex items-center',
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-9 w-9 p-0 font-normal aria-selected:opacity-100'
        ),
        ...classNames
      }}
      components={{
        Chevron: ({ ...props }) =>
          props.orientation === 'left' ? (
            <IconChevronLeft className='h-4 w-4' />
          ) : (
            <IconChevronRight className='h-4 w-4' />
          )
      }}
      {...props}
    />
  )
}
Calendar.displayName = 'Calendar'

export { Calendar }
