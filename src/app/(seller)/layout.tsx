'use client'

// import { useRouter as useNextRouter } from 'next/navigation'
// import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import Navbar from '@/components/layout/Navbar/Navbar'
import Footer from '@/components/layout/Footer/Footer'
import ScrollToTop from '@/components/common/ScrollToTop'

export default function SellerLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // const { token } = useAuth()
  // const router = useNextRouter()

  // if (!token) {
  //   router.push('/login')
  // }
  return (
    <div>
      <header>
        <Navbar />
      </header>
      <main className="pt-16">{children}</main>
      <footer>
        <Footer />
      </footer>
      <ScrollToTop />
    </div>
  )
}
