import TranslationProvider from '../../hooks/Translation/TranslationProvider'
import Navbar from '@/components/layout/Navbar/Navbar'
import Footer from '@/components/layout/Footer/Footer'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // const user = {
  //   name: 'Farooq',
  //   avatar: '/images/avatar.jpg',
  // }

  // const handleLogout = () => {
  //   console.log('User logged out')
  //   // Clear tokens or session here
  // }
  return (
    <html lang="ta">
      <body>
        <header>
          <Navbar
            navLinks={[
              { label: 'home', href: '/' },
              { label: 'properties', href: '/properties' },
              { label: 'leads', href: '/leads' },
              { label: 'users', href: '/users' },
              { label: 'support', href: '/support' },
            ]}
            // user={user}
            // onLogout={handleLogout}
          />
        </header>
        <TranslationProvider>{children}</TranslationProvider>
        <footer>
          <Footer />
        </footer>
      </body>
    </html>
  )
}
