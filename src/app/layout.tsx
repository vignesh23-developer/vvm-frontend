import type { Metadata, Viewport } from 'next'
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
import FacebookPixel from '@/components/analytics/FacebookPixel'
import { generateOrganizationSchema, generateWebSiteSchema } from '@/lib/jsonld'
import { DEFAULT_METADATA, SITE_CONFIG } from '@/lib/seo'

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

// Viewport configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#3b1804',
}

// Complete SEO Metadata
export const metadata: Metadata = {
  ...DEFAULT_METADATA,
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.name} – ${SITE_CONFIG.tagline}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: SITE_CONFIG.keywords,
  authors: [{ name: SITE_CONFIG.name, url: SITE_CONFIG.url }],
  creator: SITE_CONFIG.name,
  publisher: SITE_CONFIG.name,

  // Complete Open Graph
  openGraph: {
    type: 'website',
    locale: 'ta_IN',
    alternateLocale: 'en_IN',
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name} – ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.name} - Tamil Nadu Real Estate Platform`,
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    site: '@VaazhgaValam',
    creator: '@VaazhgaValam',
    title: `${SITE_CONFIG.name} – ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
    images: ['/og-image.jpg'],
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Verification
  verification: {
    google: '8fq6jy3pkrKcHL6C20EVifJ3Y6_Bg21Z3Zd5d-hc-ME',
  },

  // Canonical and alternates
  alternates: {
    canonical: SITE_CONFIG.url,
    languages: {
      'ta-IN': SITE_CONFIG.url,
      'en-IN': `${SITE_CONFIG.url}/en`,
    },
  },

  // Icons
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },

  // Manifest
  manifest: '/manifest.json',

  // Category
  category: 'real estate',
}

// Root Layout
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

  const initialUser = safeJsonParse<Record<string, unknown> | null>(userCookie, null)
  const parsedToken = safeJsonParse<string | null>(tokenCookie, tokenCookie)
  const initialToken = typeof parsedToken === 'string' && parsedToken.trim().length > 0 ? parsedToken : null

  // Generate structured data schemas
  const organizationSchema = generateOrganizationSchema()
  const webSiteSchema = generateWebSiteSchema()

  return (
    <html lang="ta" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />

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
            <LoadingAnimation />
            <TranslationProvider>
              <ConnectivityNotifier />
              <GlobalNotificationListener />
              <main className="min-h-screen">{children}</main>
              <ScrollToTop />
              <Toaster position="top-right" reverseOrder={false} />
            </TranslationProvider>
          </GlobalProvider>
        </AuthProvider>
        {/* Facebook Pixel */}
        <FacebookPixel />
      </body>
    </html>
  )
}
