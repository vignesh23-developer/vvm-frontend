'use client'

import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import { redirect } from 'next/navigation'
import Navbar from '@/components/layout/Navbar/Navbar'
import Footer from '@/components/layout/Footer/Footer'
import ScrollToTop from '@/components/common/ScrollToTop'

export default function SellerLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { token } = useAuth()

  if (!token) {
    redirect('/login')
  }
  return (
    <div>
      <header>
        <Navbar
        // navLinks={[
        //   { label: 'home', href: '/' },
        //   { label: 'properties', href: '/properties' },
        //   { label: 'leads', href: '/leads' },
        //   { label: 'users', href: '/users' },
        //   { label: 'support', href: '/support' },
        // ]}
        />
      </header>
      <main className="pt-16">{children}</main>
      <footer>
        <Footer />
      </footer>
      <ScrollToTop />
    </div>
  )
}
