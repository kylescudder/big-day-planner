'use client'

import React from 'react'
import { cn } from '@/lib/utils'

const ListItem = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('w-full h-28 text-primary', className)} {...props} />
)

export default ListItem
