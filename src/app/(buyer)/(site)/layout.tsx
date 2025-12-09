'use client'

import Footer from '@/components/layout/Footer/Footer'
import Navbar from '@/components/layout/Navbar/Navbar'
import React from 'react'
import { usePathname } from 'next/navigation'

const SitePageLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  const pathname = usePathname()
  const isLandingPage = pathname === '/'

  return (
    <div>
      <header>
        <Navbar />
      </header>
      <main className={isLandingPage ? '' : 'pt-16'}>{children}</main>
      <footer>
        <Footer />
      </footer>
    </div>
  )
}

export default SitePageLayout
