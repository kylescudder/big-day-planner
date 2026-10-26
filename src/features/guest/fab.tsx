import { Button } from '@/components/ui/button'
import { ChevronUpIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

export function Fab() {
  const [showButton, setShowButton] = useState<boolean>(false)

  useEffect(() => {
    const handleScrollButtonVisibility = () => {
      setShowButton(window.scrollY > 300)
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
      <ChevronUpIcon className='h-4 w-4' />
    </Button>
  )
}
