'use client'

import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import { redirect } from 'next/navigation'
import Navbar from '@/components/layout/Navbar/Navbar'
import Footer from '@/components/layout/Footer/Footer'
import Breadcrumbs from '@/components/ui/CustomComponent/Breadcrumbs/Breadcrumbs'
import ScrollToTop from '@/components/common/ScrollToTop'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { token } = useAuth()

  if (!token) {
    redirect('/login')
  }
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Section */}
      <header className="shrink-0">
        <Navbar />
      </header>

      {/* Main Content Area */}
      <main className="flex-1 bg-transparent pt-16">
        <div className="p-5 flex items-center justify-between border-b border-gray-200 bg-white">
          <Breadcrumbs />
        </div>

        {/* Page content */}
        <div className="p-5">{children}</div>
      </main>

      {/* Footer Section */}
      <footer className="shrink-0 bg-white border-t border-gray-200">
        <Footer />
      </footer>
      <ScrollToTop />
    </div>
  )
}
