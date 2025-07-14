'use client'

import React, { useEffect, useState } from 'react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import ListItem from '@/components/ui/list-item'
import { PAGES } from '@/consts/pages'
import Image from 'next/image'
import { IconMenu2 } from '@tabler/icons-react'
import * as SheetPrimitive from '@radix-ui/react-dialog'
import { Detail, type Guest } from '@/server/db/schema'

const TopBar = (props: { guestData: Guest[]; details: Detail }) => {
  const [currentSection, setCurrentSection] = useState<string>('home')
  const showSheet =
    props.guestData?.[0]?.rsvp && props.guestData?.[0]?.rsvpAnswer
  console.log('showSheet: ', showSheet)
  useEffect(() => {
    const section = document.getElementById(currentSection)
    const sectionTop =
      currentSection === 'home'
        ? (section?.offsetTop ?? 0) - 96
        : section?.offsetTop
    window.scrollTo({
      top: sectionTop,
      behavior: 'smooth'
    })
  }, [currentSection])

  return (
    <div className='flex justify-between bg-pink py-6 px-6 h-24 w-full'>
      <div>
        <Image alt='K&R Logo' src='/logo.svg' height={60} width={60} />
      </div>
      {showSheet ? (
        <div>
          <Sheet key='right'>
            <SheetTrigger asChild>
              <IconMenu2 className='text-primary' width={30} height={30} />
            </SheetTrigger>
            <SheetContent side='right'>
              <div className='flex h-full'>
                <ul className='w-full pt-12'>
                  {PAGES.map((page) => (
                    <ListItem
                      key={page.id}
                      className={
                        page.id == 'song-request' && !props.details.songRequest
                          ? 'hidden'
                          : ''
                      }
                    >
                      <li>
                        <SheetPrimitive.Close className='w-full'>
                          <div
                            onClick={() => {
                              setCurrentSection(page.id)
                            }}
                            className={`flex items-center w-full h-3/4 text-5xl p-3 hover:bg-secondary/[.5] transition-colors ease-in-out duration-500 rounded-3xl ${currentSection === page.id ? `bg-secondary text-white` : ``}`}
                          >
                            {page.text}
                          </div>
                        </SheetPrimitive.Close>
                      </li>
                    </ListItem>
                  ))}
                </ul>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      ) : null}
    </div>
  )
}

export default TopBar
