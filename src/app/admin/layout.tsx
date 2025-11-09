'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getLocalStorageItem } from '@/utils/local_storage/local_storage_handler'
import Navbar from '@/components/layout/Navbar/Navbar'
import Footer from '@/components/layout/Footer/Footer'
import Breadcrumbs from '@/components/ui/CustomComponent/Breadcrumbs/Breadcrumbs'
import { LOCAL_STORAGE_NAME } from '@/utils/local_storage/local_storage_constant'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const authToken = getLocalStorageItem(LOCAL_STORAGE_NAME.authToken)

  useEffect(() => {
    if (!authToken) router.push('/login')
  }, [authToken, router])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Section */}
      <header className="shrink-0">
        <Navbar />
      </header>

      {/* Main Content Area */}
      <main className="flex-1 bg-gray-50">
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
    </div>
  )
}
