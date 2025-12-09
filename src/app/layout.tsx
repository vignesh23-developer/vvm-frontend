import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import TranslationProvider from '../hooks/Translation/TranslationProvider'
import { AuthProvider } from '@/hooks/AuthContext/AuthContextProvider'
import { Toaster } from 'react-hot-toast'
import { GlobalProvider } from '@/hooks/GlobalContext/GlobalContext'
import { cookies } from 'next/headers'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import ConnectivityNotifier from '@/components/common/ConnectivityNotifier'
import LoadingAnimation from '../components/ui/loader/LoadingAnimation'
import ScrollToTop from '@/components/common/ScrollToTop'
// Font setup
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

// Metadata (update this later per page if needed)
export const metadata: Metadata = {
  title: {
    default: 'Vaazhga Valamudan – Real Estate Platform',
    template: '%s | Vaazhga Valamudan',
  },
  description: 'Property management and listing app built with Next.js',
  keywords: ['real estate', 'next.js', 'property portal'],
  authors: [{ name: 'Vaazhga Valamudan', url: 'https://vaazhgavalamudan.com' }],
  openGraph: {
    title: 'Vaazhga Valamudan – Real Estate Platform',
  },
}

//Root Layout
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const userCookie = cookieStore.get('userData')?.value
  const tokenCookie = cookieStore.get('authToken')?.value ?? null

  const initialUser = userCookie ? JSON.parse(userCookie) : null
  const initialToken = tokenCookie ?? null

  return (
    <html lang="ta" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body suppressHydrationWarning className="font-sans antialiased bg-gradient-to-b from-yellow-50 via-white to-yellow-50 text-gray-900 min-h-screen">
        <AuthProvider initialUser={initialUser} initialToken={initialToken}>
          <GlobalProvider>
            {/* client-only loader (renders GSAP animation, hides itself when complete) */}
            <LoadingAnimation />
            <TranslationProvider>
              <ConnectivityNotifier />
              {/*  Page Content */}

              <main className="min-h-screen">{children}</main>
              <ScrollToTop />
              {/*  Toast Notifications */}
              <Toaster position="top-right" reverseOrder={false} />
            </TranslationProvider>
          </GlobalProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
