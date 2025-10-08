import TranslationProvider from '../../hooks/Translation/TranslationProvider'
import Navbar from '@/components/layout/Navbar/Navbar'
import Footer from '@/components/layout/Footer/Footer'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ta">
      <body>
        <header>
          <Navbar />
        </header>
        <TranslationProvider>{children}</TranslationProvider>
        <footer>
          <Footer />
        </footer>
      </body>
    </html>
  )
}
