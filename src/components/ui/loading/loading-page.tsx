'use client'

import React, { useEffect, useState } from 'react'
import LoadingSpinner from '@/components/ui/loading/loading-spinner'

const LoadingPage = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  return (
    <div
      className={`
        fixed inset-0 z-50 
        flex items-center justify-center 
        bg-background/80
        transition-opacity duration-2000 ease-in-out
        ${mounted ? 'opacity-100' : 'opacity-0'}
      `}
    >
      <LoadingSpinner size={60} className='text-muted fill-primary' />
    </div>
  )
}

export default LoadingPage
