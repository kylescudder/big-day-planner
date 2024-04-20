import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { useForm, type FieldValues } from 'react-hook-form'
import { useState } from 'react'
import { toast } from 'sonner'
import LoadingSpinner from '@/components/ui/loading/loading-spinner'
import {
  DrawerClose,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer'
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
  createGuestRecord
} from '@/server/service'
// import { getAddressList, getAddress } from '@/server/queries'

export function AddGuestForm(props: {
  onNewGuest: (newGuest: Guest) => void
  onFormSubmit: (open: boolean) => void
}) {
  const [addressSearched, setAddressSearched] = useState(false)
  const [addressList, setAddressList] = useState<Address[]>([])

  const form = useForm({
    defaultValues: {
      forename: '',
      surname: '',
      email: '',
      phone: '',
      address1: '',
      address2: '',
      address3: '',
      town: '',
      county: '',
      postcode: '',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })
  // const postcode = form.getValues('postcode')
  // const { data: addressListData, isLoading: addressListLoading } =
  //   api.address.getAddressList.useQuery(
  //     { postcode },
  //     { enabled: postcodeShouldFetch } // The query will not run until shouldFetch is true
  //   )
  // const { data: addressData, isLoading: addressDataLoading } =
  //   api.address.getAddress.useQuery(
  //     { addressUrl },
  //     { enabled: addressShouldFetch } // The query will not run until shouldFetch is true
  //   )

  // const createMutation = api.guest.create.useMutation({
  //   onSuccess: () => {
  //     toast({
  //       description: 'Guest added!'
  //     })
  //     props.onFormSubmit(false)
  //   },
  //   onError: () => {
  //     toast({
  //       variant: 'destructive',
  //       title: 'Uh oh! Something went wrong!',
  //       description: 'There was a problem with your request.'
  //     })
  //   }
  // })

  // const mutate = api.guest.create.useMutation({
  //   onSuccess: () => {
  //     toast({
  //       description: 'Guest added!'
  //     })
  //     props.onFormSubmit(false)
  //   },
  //   onError: () => {
  //     toast({
  //       variant: 'destructive',
  //       title: 'Uh oh! Something went wrong!',
  //       description: 'There was a problem with your request.'
  //     })
  //   }
  // })

  const handlePostcodeLookup = async () => {
    const postcode = form.getValues('postcode')
    const addressListData = await getAddressListRecords(postcode)
    const addressList =
      addressListData?.suggestions.map((suggestion) => suggestion) ?? []
    setAddressList(addressList)
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

  async function onSubmit(values: Guest) {
    const newGuest = {
      ...values,
      starterId: '',
      mainId: '',
      puddingId: '',
      songChoice: '',
      rsvp: false,
      rsvpAnswer: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    await createGuestRecord(newGuest)
    setAddressList([])
    setAddressSearched(false)
    // props.onNewGuest(newGuest)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <DrawerHeader>
          <DrawerTitle>Add Guest</DrawerTitle>
          <DrawerDescription>
            Add the guests required information.
          </DrawerDescription>
        </DrawerHeader>
        <div className="grid gap-4 p-4">
          <FormField
            control={form.control}
            name="forename"
            render={({ field }: { field: FieldValues }) => (
              <FormItem>
                <FormLabel htmlFor="forename">Forename</FormLabel>
                <FormControl>
                  <div className="items-center gap-4">
                    <Input {...field} id="forename" className="text-base" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="surname"
            render={({ field }: { field: FieldValues }) => (
              <FormItem>
                <FormLabel htmlFor="surname">Surname</FormLabel>
                <FormControl>
                  <div className="items-center gap-4">
                    <Input {...field} id="surname" className="text-base" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }: { field: FieldValues }) => (
              <FormItem>
                <FormLabel htmlFor="email">Email address</FormLabel>
                <FormControl>
                  <div className="items-center gap-4">
                    <Input {...field} id="email" className="text-base" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }: { field: FieldValues }) => (
              <FormItem>
                <FormLabel htmlFor="phone">Phone number</FormLabel>
                <FormControl>
                  <div className="items-center gap-4">
                    <Input {...field} id="phone" className="text-base" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="postcode"
            render={({ field }: { field: FieldValues }) => (
              <FormItem>
                <FormLabel htmlFor="postcode">Postcode</FormLabel>
                <FormControl>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Input
                      {...field}
                      id="postcode"
                      className=" col-span-3 text-base"
                    />
                    <Button
                      variant="default"
                      type="button"
                      className="col-span-1"
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
            name="address"
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
                      <SelectValue placeholder="Select an address" />
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
        <DrawerFooter>
          <Button type="submit">
            {/* {mutate.isPending ? (
              <LoadingSpinner className={'text-muted fill-primary'} />
            ) : ( */}
            <p>Save changes</p>
            {/* )} */}
          </Button>
          <DrawerClose asChild>
            <Button className="w-full" variant="outline">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </form>
    </Form>
  )
}
