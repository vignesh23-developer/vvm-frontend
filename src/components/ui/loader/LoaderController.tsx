'use client'

import React, { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import LoadingAnimation from './LoadingAnimation'
import SimplePageLoader from './SimplePageLoader'
import { useGlobalContext } from '@/hooks/GlobalContext/GlobalContext'

const LoaderController: React.FC = () => {
  const pathname = usePathname()
  const { setIsPageLoading } = useGlobalContext()

  // Reset loading state whenever pathname changes
  useEffect(() => {
    setIsPageLoading(true)
  }, [pathname, setIsPageLoading])

  // Normalize pathname to check for home page
  const isHomePage = pathname === '/' || pathname === '/en' || pathname === '/ta'

  if (isHomePage) {
    return <LoadingAnimation key={pathname} />
  }

  return <SimplePageLoader key={pathname} />
}

export default LoaderController
