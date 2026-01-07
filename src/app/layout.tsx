import type { Metadata } from 'next'
import Script from 'next/script'
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
import GlobalNotificationListener from '@/components/Notification/GlobalNotificationListener'
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
  title: 'Buy Sell Rent Properties in Tamil Nadu - TN’s Leading Real Estate Listing Platform | Vaazhga Valamudan',
  description:
    'Vaazhga Valamudan offers verified real estate listings across Tamil Nadu. Buy, sell, or rent property in Chennai, Madurai, Coimbatore, Trichy & Tirunelveli, etc.',
  keywords: ['real estate', 'property portal', 'Tamil Nadu real estate'],
  authors: [{ name: 'Vaazhga Valamudan', url: 'https://vaazhgavalamudan.com' }],
  alternates: {
    canonical: 'https://vaazhgavalamudan.com',
  },
  icons: {
    icon: '/favicon.ico',
  },
}

//Root Layout
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const userCookie = cookieStore.get('userData')?.value
  const tokenCookie = cookieStore.get('authToken')?.value ?? null

  const safeJsonParse = <T,>(value: string | null | undefined, fallback: T): T => {
    if (!value) return fallback
    try {
      return JSON.parse(value) as T
    } catch {
      return fallback
    }
  }

  // `userData` can be absent or malformed; never crash the whole app on parse.
  const initialUser = safeJsonParse<Record<string, unknown> | null>(userCookie, null)

  // `authToken` is sometimes stored via JSON.stringify, so it can be "token" or `null`.
  const parsedToken = safeJsonParse<string | null>(tokenCookie, tokenCookie)
  const initialToken = typeof parsedToken === 'string' && parsedToken.trim().length > 0 ? parsedToken : null

  return (
    <html lang="ta" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        {/* Google Analytics */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-PZHXJQ4J6J" strategy="afterInteractive" />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PZHXJQ4J6J');
          `}
        </Script>
      </head>
      <body
        suppressHydrationWarning
        className="font-sans antialiased bg-gradient-to-b from-yellow-50 via-white to-yellow-50 text-gray-900 min-h-screen"
      >
        <AuthProvider initialUser={initialUser} initialToken={initialToken}>
          <GlobalProvider>
            {/* client-only loader (renders GSAP animation, hides itself when complete) */}
            <LoadingAnimation />
            <TranslationProvider>
              <ConnectivityNotifier />
              <GlobalNotificationListener />
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
