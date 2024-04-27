import React from 'react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import ListItem from '@/components/ui/list-item'
import { PAGES } from '@/consts/pages'
import Image from 'next/image'
import { IconMenu2 } from '@tabler/icons-react'

const TopBar = () => {
  return (
    <div className='flex justify-between py-6 px-6 h-24 w-full'>
      <div>
        <Image alt='K&R Logo' src='/logo.svg' height={60} width={60} />
      </div>
      <div>
        <Sheet key='right'>
          <SheetTrigger asChild>
            <IconMenu2 className='text-primary' width={30} height={30} />
          </SheetTrigger>
          <SheetContent side='right'>
            <div className='flex h-full'>
              <ul className='w-full'>
                {PAGES.map((page) => (
                  <ListItem key={page.id}>
                    <a
                      className='flex items-center w-full h-full text-5xl'
                      href={page.id}
                    >
                      {page.text}
                    </a>
                  </ListItem>
                ))}
              </ul>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}

export default TopBar
