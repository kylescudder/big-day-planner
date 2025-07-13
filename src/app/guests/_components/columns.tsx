// app/guests/_components/columns.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Checkbox } from '@/components/ui/checkbox'
import { IconDots } from '@tabler/icons-react'
import { type ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header'
import type { Guest } from '@/server/db/schema'
import { EditGuestModal } from '@/app/guests/_components/form/edit-guest-modal'

export interface GuestColumnsProps {
  guests: Guest[]
  onDelete: (guest: Guest) => Promise<void>
  onEdit: (updated: Guest) => void
}

export const getGuestColumns = ({
  guests,
  onDelete,
  onEdit
}: GuestColumnsProps): ColumnDef<Guest>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(val) => table.toggleAllPageRowsSelected(!!val)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(val) => row.toggleSelected(!!val)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'surname',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => {
      const name = `${row.original.forename} ${row.original.surname}`
      return <div className='font-medium'>{name}</div>
    },
    accessorFn: (row) => `${row.forename} ${row.surname}`
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    )
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Phone' />
    )
  },
  {
    accessorKey: 'rsvpd',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="RSVP'd" />
    ),
    cell: ({ row }) => (
      <div className='text-right font-medium'>
        {row.getValue('rsvpd') ? 'Yes' : 'No'}
      </div>
    )
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const guest = row.original
      const [editOpen, setEditOpen] = useState(false)

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <span className='sr-only'>Open menu</span>
                <IconDots className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <DropdownMenuItem onClick={() => setEditOpen(true)}>
                Edit guest
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => void onDelete(guest)}>
                Delete guest
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <EditGuestModal
            guest={guest}
            guests={guests}
            open={editOpen}
            onOpenChange={setEditOpen}
            onGuestUpdate={onEdit}
          />
        </>
      )
    }
  }
]
