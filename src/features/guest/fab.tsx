import { Button } from '@/components/ui/button'
import { IconChevronUp } from '@tabler/icons-react'
import { useEffect, useState } from 'react'

export function Fab() {
  const [showButton, setShowButton] = useState<boolean>(false)

  useEffect(() => {
    const handleScrollButtonVisibility = () => {
      window.scrollY > 300 ? setShowButton(true) : setShowButton(false)
    }

    window.addEventListener('scroll', handleScrollButtonVisibility)
    return () => {
      window.removeEventListener('scroll', handleScrollButtonVisibility)
    }
  })

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
      /* you can also use 'auto' behaviour 
         in place of 'smooth' */
    })
  }

  return (
    <Button
      variant='default'
      size='icon'
      onClick={scrollToTop}
      className={`fixed right-3 bottom-3 transition-opacity duration-1000 ease-in-out ${!showButton ? 'opacity-0' : 'opacity-100'}`}
    >
      <IconChevronUp className='h-4 w-4' />
    </Button>
  )
}
