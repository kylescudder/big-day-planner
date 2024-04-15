import React from 'react'
import LoadingSpinner from '@/components/ui/loading/loading-spinner'

const LoadingPage = () => {
  return (
    <div className="absolute top-0 right-0 flex h-screen w-screen items-center justify-center">
      <LoadingSpinner size={60} className="text-muted fill-primary" />
    </div>
  )
}

export default LoadingPage
