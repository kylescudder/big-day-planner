'use client'

import * as React from 'react'
import { IconClock } from '@tabler/icons-react'

import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

interface TimePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
}

export function TimePicker({
  date,
  setDate,
  className,
  ...props
}: TimePickerProps) {
  const minuteRef = React.useRef<HTMLButtonElement>(null)
  const hourRef = React.useRef<HTMLButtonElement>(null)
  const [selectedHour, setSelectedHour] = React.useState<number | null>(null)
  const [selectedMinute, setSelectedMinute] = React.useState<number | null>(
    null
  )

  const minutes = React.useMemo(() => {
    const minutes = []
    for (let i = 0; i < 60; i += 5) {
      minutes.push(i)
    }
    return minutes
  }, [])

  const hours = React.useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => i)
  }, [])

  React.useEffect(() => {
    if (date) {
      setSelectedHour(date.getHours())
      setSelectedMinute(date.getMinutes())
    }
  }, [date])

  const handleHourChange = React.useCallback(
    (hour: string) => {
      const hourValue = Number.parseInt(hour, 10)
      setSelectedHour(hourValue)
      const newDate = new Date(date || new Date())
      newDate.setHours(hourValue)
      setDate(newDate)
      minuteRef.current?.focus()
    },
    [date, setDate]
  )

  const handleMinuteChange = React.useCallback(
    (minute: string) => {
      const minuteValue = Number.parseInt(minute, 10)
      setSelectedMinute(minuteValue)
      const newDate = new Date(date || new Date())
      newDate.setMinutes(minuteValue)
      setDate(newDate)
    },
    [date, setDate]
  )

  return (
    <div className={cn('flex items-end gap-2', className)} {...props}>
      <div className='grid gap-1 text-center'>
        <Select onValueChange={handleHourChange}>
          <SelectTrigger ref={hourRef} className='w-[80px]'>
            <SelectValue
              placeholder={
                selectedHour !== null
                  ? selectedHour.toString().padStart(2, '0')
                  : 'HH'
              }
            />
          </SelectTrigger>
          <SelectContent position='popper'>
            {hours.map((hour) => (
              <SelectItem key={hour} value={hour.toString()}>
                {hour.toString().padStart(2, '0')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className='text-xs text-muted-foreground'>Hour</span>
      </div>
      <div className='grid gap-1 text-center'>
        <Select onValueChange={handleMinuteChange}>
          <SelectTrigger ref={minuteRef} className='w-[80px]'>
            <SelectValue
              placeholder={
                selectedMinute !== null
                  ? selectedMinute.toString().padStart(2, '0')
                  : 'MM'
              }
            />
          </SelectTrigger>
          <SelectContent position='popper'>
            {minutes.map((minute) => (
              <SelectItem key={minute} value={minute.toString()}>
                {minute.toString().padStart(2, '0')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className='text-xs text-muted-foreground'>Minute</span>
      </div>
      <div className='flex h-10 items-center'>
        <IconClock className='ml-2 h-4 w-4 text-muted-foreground' />
      </div>
    </div>
  )
}
