'use client'
import Navbar from '@/components/layout/Navbar/Navbar'
import Footer from '@/components/layout/Footer/Footer'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
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
      <main>{children}</main>
      <footer>
        <Footer />
      </footer>
    </div>
  )
}
