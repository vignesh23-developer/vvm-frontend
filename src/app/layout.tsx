import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import TranslationProvider from '../hooks/Translation/TranslationProvider'
import { Toaster } from 'react-hot-toast'
import RouteLoader from '@/components/ui/CustomComponent/RouteLoader/RouteLoader' // ✅ Add this for page loading animation

// ✅ Font setup
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
    default: 'MyApp – Real Estate Platform',
    template: '%s | MyApp',
  },
  description: 'Property management and listing app built with Next.js',
  keywords: ['real estate', 'next.js', 'property portal'],
  authors: [{ name: 'dev_farooq' }],
  openGraph: {
    title: 'MyApp – Real Estate Portal',
    description: 'Browse, buy, and manage properties seamlessly.',
    type: 'website',
    locale: 'en_U S',
  },
}

//Root Layout
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ta" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body suppressHydrationWarning className="font-sans antialiased bg-gray-50 text-gray-900 min-h-screen">
        <TranslationProvider>
          {/*  Route Transition Loader */}
          {/* <RouteLoader /> */}

          {/*  Page Content */}
          <main className="min-h-screen">{children}</main>

          {/*  Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#333',
                color: '#fff',
                borderRadius: '8px',
              },
            }}
          />
        </TranslationProvider>
      </body>
    </html>
  )
}
