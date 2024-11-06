import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { type FieldValues } from 'react-hook-form'
import { useState } from 'react'
import { IconSearch } from '@tabler/icons-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { type Address } from '@/types/address'
import { type Guest } from '@/server/db/schema'
import {
  getAddressRecords,
  getAddressListRecords,
  getGuestRecord
} from '@/server/service'

export function AddGuestForm(props: {
  form: any
  addressSearched: boolean
  addressList: Address[]
  guestList: Guest[]
}) {
  const [addressSearched, setAddressSearched] = useState(props.addressSearched)
  const [addressList, setAddressList] = useState<Address[]>(props.addressList)
  const [guestList] = useState<Guest[]>(props.guestList)

  const handlePostcodeLookup = async () => {
    const postcode = props.form.getValues('postcode')
    const addressListData = await getAddressListRecords(postcode)
    const addressList =
      addressListData?.suggestions.map((suggestion) => suggestion) ?? []
    setAddressList(addressList)
    setAddressSearched(true)
  }

  const handleAddressSelection = async (addressUrl: string) => {
    const addressData = await getAddressRecords(addressUrl)
    props.form.setValue('address1', addressData?.line_1 ?? '')
    props.form.setValue('address2', addressData?.line_2 ?? '')
    props.form.setValue('address3', addressData?.line_3 ?? '')
    props.form.setValue('town', addressData?.town_or_city ?? '')
    props.form.setValue('county', addressData?.county ?? '')
  }

  const handleLinkSelection = async (id: string) => {
    const guestData = await getGuestRecord(id)
    props.form.setValue('parentId', guestData?.id ?? null)
  }

  return (
    <div className='grid gap-4 p-4'>
      <FormField
        control={props.form.control}
        name='forename'
        rules={{ required: 'Forename is required' }}
        render={({ field }: { field: FieldValues }) => (
          <FormItem>
            <FormLabel htmlFor='forename'>Forename</FormLabel>
            <FormControl>
              <div className='items-center gap-4'>
                <Input {...field} id='forename' className='text-base' />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={props.form.control}
        name='surname'
        rules={{ required: 'Surname is required' }}
        render={({ field }: { field: FieldValues }) => (
          <FormItem>
            <FormLabel htmlFor='surname'>Surname</FormLabel>
            <FormControl>
              <div className='items-center gap-4'>
                <Input {...field} id='surname' className='text-base' />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name='parent'
        render={() => (
          <FormItem>
            <FormLabel>Going with</FormLabel>
            <Select
              onValueChange={(parentId) => {
                void handleLinkSelection(parentId)
              }}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder='Select an guest to link' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {guestList.map((guest, index) => (
                  <SelectItem key={index} value={guest.id}>
                    {guest.forename} {guest.surname}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={props.form.control}
        name='email'
        rules={{ required: 'Email is required' }}
        render={({ field }: { field: FieldValues }) => (
          <FormItem>
            <FormLabel htmlFor='email'>Email address</FormLabel>
            <FormControl>
              <div className='items-center gap-4'>
                <Input {...field} id='email' className='text-base' />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={props.form.control}
        name='phone'
        rules={{ required: 'Phone is required' }}
        render={({ field }: { field: FieldValues }) => (
          <FormItem>
            <FormLabel htmlFor='phone'>Phone number</FormLabel>
            <FormControl>
              <div className='items-center gap-4'>
                <Input {...field} id='phone' className='text-base' />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={props.form.control}
        name='postcode'
        render={({ field }: { field: FieldValues }) => (
          <FormItem>
            <FormLabel htmlFor='postcode'>Postcode</FormLabel>
            <FormControl>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Input
                  {...field}
                  id='postcode'
                  className=' col-span-3 text-base'
                />
                <Button
                  variant='default'
                  type='button'
                  className='col-span-1'
                  onClick={() => handlePostcodeLookup()}
                >
                  <IconSearch />
                </Button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name='address'
        rules={{ required: 'Address is required' }}
        render={() => (
          <FormItem>
            <FormLabel>Address</FormLabel>
            <Select
              disabled={!addressSearched}
              onValueChange={(addressUrl) => {
                void handleAddressSelection(addressUrl)
              }}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder='Select an address' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {addressList.map((address, index) => (
                  <SelectItem key={index} value={address.url}>
                    {address.address}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
