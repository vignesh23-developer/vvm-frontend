import TranslationProvider from '../../hooks/Translation/TranslationProvider'
import Navbar from '@/components/layout/Navbar/Navbar'
import Footer from '@/components/layout/Footer/Footer'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = {
    name: 'Farooq',
    avatar: '/avatar.png',
  }

  // const handleLogout = () => {
  //   console.log('User logged out')
  //   // Clear tokens or session here
  // }
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
          user={user}
          // onLogout={handleLogout}
        />
      </header>
      <main>{children}</main>
      <footer>
        <Footer />
      </footer>
    </div>
  )
}
