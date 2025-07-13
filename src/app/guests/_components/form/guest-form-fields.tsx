'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { IconSearch } from '@tabler/icons-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { type FieldValues, UseFormReturn } from 'react-hook-form'
import { type Address } from '@/types/address'
import { type Guest } from '@/server/db/schema'
import {
  getAddressRecords,
  getAddressListRecords,
  getGuestRecord
} from '@/server/service'
import { useState } from 'react'

export interface GuestFormFieldsProps {
  form: UseFormReturn<Guest>
  initialAddressList?: Address[]
  initialAddressSearched?: boolean
  guestList: Guest[]
}

export function GuestFormFields({
  form,
  guestList,
  initialAddressList = [],
  initialAddressSearched = false
}: GuestFormFieldsProps) {
  const [addressSearched, setAddressSearched] = useState(initialAddressSearched)
  const [addressList, setAddressList] = useState<Address[]>(initialAddressList)
  const [linkedGuestId, setLinkedGuestId] = useState<string | null>(null)

  const handlePostcodeLookup = async () => {
    const postcode = form.getValues('postcode')
    const addressListData = await getAddressListRecords(postcode ?? '')
    console.log(
      'addressListData',
      addressListData?.suggestions.map((suggestion) => suggestion) ?? []
    )
    const suggestions = addressListData?.suggestions ?? []
    setAddressList(suggestions)
    setAddressSearched(true)
  }

  const handleAddressSelection = async (addressUrl: string) => {
    const addressData = await getAddressRecords(addressUrl)
    form.setValue('address1', addressData?.line_1 ?? '')
    form.setValue('address2', addressData?.line_2 ?? '')
    form.setValue('address3', addressData?.line_3 ?? '')
    form.setValue('town', addressData?.town_or_city ?? '')
    form.setValue('county', addressData?.county ?? '')
  }

  const handleLinkSelection = async (id: string) => {
    const guestData = await getGuestRecord(id)
    setLinkedGuestId(id)
    form.setValue('guestKey', guestData?.guestKey ?? '')
    form.setValue('parentId', guestData?.id ?? null)
  }

  return (
    <div className='grid gap-4 p-4'>
      <FormField
        control={form.control}
        name='forename'
        rules={{ required: 'Forename is required' }}
        render={({ field }: { field: FieldValues }) => (
          <FormItem>
            <FormLabel htmlFor='forename'>Forename</FormLabel>
            <FormControl>
              <Input {...field} id='forename' className='text-base' />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name='surname'
        rules={{ required: 'Surname is required' }}
        render={({ field }: { field: FieldValues }) => (
          <FormItem>
            <FormLabel htmlFor='surname'>Surname</FormLabel>
            <FormControl>
              <Input {...field} id='surname' className='text-base' />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormItem>
        <FormLabel>Going with</FormLabel>
        <Select
          onValueChange={(parentId) => void handleLinkSelection(parentId)}
        >
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder='Select a guest to link' />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {guestList.map((g) => (
              <SelectItem key={g.id} value={g.id}>
                {g.forename} {g.surname}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>

      <FormField
        control={form.control}
        name='guestKey'
        rules={{ required: 'Guest Key is required' }}
        render={({ field }: { field: FieldValues }) => (
          <FormItem>
            <FormLabel htmlFor='guestKey'>Guest Key</FormLabel>
            <FormControl>
              <Input
                {...field}
                id='guestKey'
                className='text-base'
                readOnly={!!linkedGuestId}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name='email'
        rules={{ required: 'Email is required' }}
        render={({ field }: { field: FieldValues }) => (
          <FormItem>
            <FormLabel htmlFor='email'>Email address</FormLabel>
            <FormControl>
              <Input {...field} id='email' className='text-base' />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name='phone'
        rules={{ required: 'Phone is required' }}
        render={({ field }: { field: FieldValues }) => (
          <FormItem>
            <FormLabel htmlFor='phone'>Phone number</FormLabel>
            <FormControl>
              <Input {...field} id='phone' className='text-base' />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name='postcode'
        render={({ field }: { field: FieldValues }) => (
          <FormItem>
            <FormLabel htmlFor='postcode'>Postcode</FormLabel>
            <FormControl>
              <div className='grid grid-cols-4 gap-2'>
                <Input
                  {...field}
                  id='postcode'
                  className='col-span-3 text-base'
                />
                <Button
                  type='button'
                  variant='default'
                  className='col-span-1'
                  onClick={handlePostcodeLookup}
                >
                  <IconSearch />
                </Button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormItem>
        <FormLabel>Address</FormLabel>
        <Select
          disabled={!addressSearched}
          onValueChange={(url) => void handleAddressSelection(url)}
        >
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder='Select an address' />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {addressList.map((a) => (
              <SelectItem key={a.url} value={a.url}>
                {a.address}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    </div>
  )
}
