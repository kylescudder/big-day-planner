import React from 'react'
import { cn } from '@/lib/utils'

const ListItem = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('text-primary h-28 w-full', className)} {...props} />
)

export default ListItem
