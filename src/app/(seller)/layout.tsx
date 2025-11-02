'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getLocalStorageItem } from '@/utils/local_storage/local_storage_handler'
import Navbar from '@/components/layout/Navbar/Navbar'
import Footer from '@/components/layout/Footer/Footer'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const router = useRouter()
  const authToken = getLocalStorageItem('authToken')
  useEffect(() => {
    if (!authToken) {
      router.push('/login')
    }
  }, [])
  return (
    <div>
      <header>
        <Navbar
          navLinks={[
            { label: 'home', href: '/' },
            { label: 'properties', href: '/properties' },
            { label: 'leads', href: '/leads' },
            { label: 'users', href: '/users' },
            { label: 'support', href: '/support' },
          ]}
        />
      </header>
      <main>{children}</main>
      <footer>
        <Footer />
      </footer>
    </div>
  )
}
