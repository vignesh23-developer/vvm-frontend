'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Loader from '@/components/ui/CustomComponent/Loader/Loader'

export default function RouteLoader() {
  const pathname = usePathname()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const timeout = setTimeout(() => setLoading(false), 400) // short delay for smoothness
    return () => clearTimeout(timeout)
  }, [pathname])

  return loading ? <Loader /> : null
}
