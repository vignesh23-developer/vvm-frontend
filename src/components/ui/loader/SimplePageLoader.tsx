'use client'

import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '@/hooks/GlobalContext/GlobalContext'

const SimplePageLoader: React.FC = () => {
  const { setIsPageLoading } = useGlobalContext()
  const [isFadingOut, setIsFadingOut] = useState(false)

  useEffect(() => {
    // Show loader for 1.2 seconds
    const timer = setTimeout(() => {
      setIsFadingOut(true)
      
      // Wait for fade-out animation to complete
      const finishTimer = setTimeout(() => {
        setIsPageLoading(false)
      }, 500)
      
      return () => clearTimeout(finishTimer)
    }, 1200)

    return () => clearTimeout(timer)
  }, [setIsPageLoading])

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white transition-opacity duration-500 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-yellow-500 border-t-[#2a1407]"></div>
    </div>
  )
}

export default SimplePageLoader
