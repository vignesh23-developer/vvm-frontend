import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import TranslationProvider from '../hooks/Translation/TranslationProvider'
import { Toaster } from 'react-hot-toast'

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
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ta" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body suppressHydrationWarning className="font-sans antialiased bg-gray-50 text-gray-900 min-h-screen">
        <TranslationProvider>
          {/*  Page Content */}
          <main className="min-h-screen">{children}</main>

          {/*  Toast Notifications */}
          <Toaster position="top-right" reverseOrder={false} />
        </TranslationProvider>
      </body>
    </html>
  )
}
