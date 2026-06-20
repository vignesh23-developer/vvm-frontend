'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/layout/Navbar/Navbar'
import Footer from '@/components/layout/Footer/Footer'
import ScrollToTop from '@/components/common/ScrollToTop'

export default function SellerLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const isPlanDashboard = pathname === '/dashboard'

  if (isPlanDashboard) {
    return (
      <div>
        <main>{children}</main>
        <ScrollToTop />
      </div>
    )
  }

  return (
    <div>
      <header>
        <Navbar />
      </header>
      <main>{children}</main>
      <footer>
        <Footer />
      </footer>
      <ScrollToTop />
    </div>
  )
}
