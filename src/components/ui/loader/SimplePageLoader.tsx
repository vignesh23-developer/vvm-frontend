'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useGlobalContext } from '@/hooks/GlobalContext/GlobalContext'
import './simple-loader.css'

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
    <div className={`vvm-simple-loader ${isFadingOut ? 'fade-out' : ''}`}>
      <div className="vvm-loader-content">
        <Image
          src="/footer_logo_new_en.png"
          alt="VVM Logo"
          width={200}
          height={100}
          className="vvm-loader-logo"
          priority
        />
        <div className="vvm-progress-container">
          <div className="vvm-progress-bar"></div>
        </div>
      </div>
    </div>
  )
}

export default SimplePageLoader
