'use client'
import Footer from '@/components/layout/Footer/Footer'
import Navbar from '@/components/layout/Navbar/Navbar'
import React from 'react'

const SitePageLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <div>
      <header>
        <Navbar />
      </header>
      <main>{children}</main>
      <footer>
        <Footer />
      </footer>
    </div>
  )
}

export default SitePageLayout
