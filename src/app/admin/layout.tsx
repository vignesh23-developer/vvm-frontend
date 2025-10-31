import Navbar from '@/components/layout/Navbar/Navbar'
import Footer from '@/components/layout/Footer/Footer'
import { Toaster } from 'react-hot-toast'
import Breadcrumbs from '@/components/ui/CustomComponent/Breadcrumbs/Breadcrumbs'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = {
    name: 'Farooq',
    avatar: '/avatar.png',
  }

  return (
    <div>
      <header>
        <Navbar
          navLinks={[
            { label: 'home', href: '/admin/dashboard' },
            {
              label: 'master',
              href: '#',
              subMenu: [
                {
                  label: 'property categories',
                  href: '/admin/dashboard/property-category',
                },
                {
                  label: 'feature categories',
                  href: '/admin/dashboard/feature-category',
                },
                {
                  label: 'feature group',
                  href: '/admin/dashboard/feature-group',
                },
              ],
            },
            { label: 'properties', href: '/admin/dashboard/properties' },
            { label: 'leads', href: '/leads' },
            { label: 'users', href: '/users' },
            { label: 'support', href: '/support' },
          ]}
          user={user}
        />
      </header>
      <main>
        <div className="p-5 bg-gray-50 flex items-center justify-between">
          <Breadcrumbs />
        </div>
        {children}
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  )
}
