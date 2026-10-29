'use client'

import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import Button from '@/components/ui/CustomComponent/Button/Button'
import { MaskContainer } from '../../../../components/ui/svg-mask-effect'
import { BackgroundLines } from '../../../../components/ui/background-lines'
import { postMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'
import { Download, Smartphone, CheckCircle } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

// Skeleton Loader for App Promo
const AppPromoSkeleton = () => {
  return (
    <section className="w-full py-12 overflow-hidden bg-gradient-to-r from-yellow-50/80 to-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 items-center gap-12 animate-pulse">
        {/* Left Skeleton */}
        <div className="lg:col-span-5 space-y-8">
          <div className="h-6 w-32 bg-gray-200 rounded-full" />
          <div className="h-12 w-full bg-gray-300 rounded-lg" />
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-3/4 bg-gray-200 rounded" />
          <div className="flex gap-4">
            <div className="h-12 w-40 bg-gray-200 rounded" />
            <div className="h-12 w-40 bg-gray-200 rounded" />
          </div>
          <div className="h-12 w-full bg-gray-200 rounded-md" />
        </div>

        {/* Right Skeleton */}
        <div className="lg:col-span-7">
          <div className="h-[28rem] lg:h-[36rem] bg-gray-200 rounded-2xl" />
        </div>
      </div>
    </section>
  )
}

export default function AppPromo() {
  const t = useTranslations()
  const locale = useLocale()
  const [isLoading, setIsLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // PWA Install States
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => setIsLoading(false), 300)
    return () => clearTimeout(timer)
  }, [])

  // PWA Install Logic
  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Check if iOS
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent))

    // Listen for install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
  }, [])

  const handlePWAInstall = async () => {
    if (!installPrompt) return
    await installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') {
      setIsInstalled(true)
      toast.success(t('AppPromo.installSuccess') || 'App installed successfully!')
    }
    setInstallPrompt(null)
  }

  const handleIOSInstall = () => {
    toast(
      tst => (
        <div className="text-sm">
          <p className="font-semibold mb-2">{t('AppPromo.iosTitle')}</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>{t('AppPromo.iosStep1')}</li>
            <li>{t('AppPromo.iosStep2')}</li>
            <li>{t('AppPromo.iosStep3')}</li>
          </ol>
        </div>
      ),
      { duration: 6000 },
    )
  }

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await postMethod(appEndpoints.createNewsletter, { email })

      if (response.error) {
        // Check if it's an "already subscribed" error
        if (response.message?.toLowerCase().includes('already subscribed') || response.status === '409') {
          toast.error('Already subscribed')
        } else {
          toast.error(response.message || 'Failed to subscribe to newsletter')
        }
        return
      }

      toast.success('Subscribed to newsletter')
      setEmail('')
    } catch (error) {
      console.error('Newsletter subscription error:', error)
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <AppPromoSkeleton />
  }

  const features = ['alerts', 'favorites', 'chat', 'browsing']

  return (
    <motion.section
      className="w-full py-12 overflow-hidden bg-gradient-to-r from-yellow-50/80 to-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 items-center gap-12">
        {/* Left: wrapped in MaskContainer to reveal primary color on hover */}
        <div className="lg:col-span-5">
          {/* <MaskContainer revealBg="#2a1407" revealSize={320} className="group rounded-2xl"> */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="space-y-8 relative z-10 px-4 py-6"
          >
            <h3 className="text-sm font-semibold text-yellow-700 uppercase inline-block px-3 py-1 rounded-full bg-yellow-50 border border-yellow-100">
              {t('AppPromo.badge') || 'Get Benefit'}
            </h3>

            {/* smooth color transition using CSS variables provided by MaskContainer */}
            <h2
              className={`${locale === 'ta' ? 'text-xl sm:text-2xl lg:text-3xl' : 'text-2xl sm:text-3xl lg:text-4xl'} font-extrabold leading-tight`}
              style={{
                color: 'var(--title-color, #2a1407)',
                transition: 'color 350ms cubic-bezier(.2,.9,.2,1)',
              }}
            >
              {t('AppPromo.title')}
            </h2>

            <p
              className={`${locale === 'ta' ? 'text-sm sm:text-base leading-snug' : 'text-base sm:text-lg leading-relaxed'} max-w-xl mb-6`}
              style={{
                color: 'var(--body-color, #4b5563)',
                transition: 'color 350ms cubic-bezier(.2,.9,.2,1)',
              }}
            >
              {t('AppPromo.description')}
            </p>

            {/* Benefits List */}
            <ul className="space-y-3 mb-6">
              {features.map((featureKey, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-2 text-sm"
                  style={{
                    color: 'var(--body-color, #4b5563)',
                    transition: 'color 350ms cubic-bezier(.2,.9,.2,1)',
                  }}
                >
                  <span className="text-yellow-600 font-bold">✔</span>
                  <span>{t(`AppPromo.features.${featureKey}`)}</span>
                </motion.li>
              ))}
            </ul>

            {/* PWA Install Buttons */}
            <div className="flex flex-wrap gap-4">
              {/* Already Installed */}
              {isInstalled && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 px-6 py-3 bg-green-600 text-white rounded-xl shadow-lg"
                >
                  <CheckCircle className="w-6 h-6" />
                  <span className="font-semibold">{t('AppPromo.installed')}</span>
                </motion.div>
              )}

              {/* PWA Install Button - Android/Desktop */}
              {!isInstalled && installPrompt && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePWAInstall}
                  className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
                >
                  <Download className="w-6 h-6" />
                  <div className="text-left">
                    <div className="text-xs opacity-90">{t('AppPromo.installNow') || 'Install Now'}</div>
                    <div className="font-semibold">{t('AppPromo.quickInstall') || 'Quick Install'}</div>
                  </div>
                </motion.button>
              )}

              {/* iOS Install Instructions */}
              {!isInstalled && isIOS && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleIOSInstall}
                  className="flex items-center gap-3 px-6 py-3 bg-gray-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
                >
                  <Smartphone className="w-6 h-6" />
                  <div className="text-left">
                    <div className="text-xs opacity-90">{t('AppPromo.addTo') || 'Add to'}</div>
                    <div className="font-semibold">{t('AppPromo.homeScreen') || 'Home Screen'}</div>
                  </div>
                </motion.button>
              )}

              {/* Fallback - When browser doesn't support install prompt */}
              {!isInstalled && !installPrompt && !isIOS && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toast(t('AppPromo.openInChrome') || 'Open in Chrome or Edge browser to install the app')}
                  className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
                >
                  <Download className="w-6 h-6" />
                  <div className="text-left">
                    <div className="text-xs opacity-90">{t('AppPromo.installApp') || 'Install App'}</div>
                    <div className="font-semibold">{t('AppPromo.getApp') || 'Get the App'}</div>
                  </div>
                </motion.button>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-xs text-gray-500">Get property alerts, offers & market insights. No spam.</p>
              <form
                onSubmit={handleNewsletterSubmit}
                className="flex max-w-md rounded-lg overflow-hidden border-2 border-yellow-200 focus-within:ring-2 focus-within:ring-yellow-500 focus-within:border-yellow-400 shadow-md"
              >
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={t('AppPromo.placeholder') || 'Your email'}
                  className="w-full px-4 py-3 text-gray-700 focus:outline-none bg-white"
                  required
                  disabled={isSubmitting}
                />
                <div>
                  <Button
                    type="submit"
                    variant="primary"
                    size="medium"
                    className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Subscribing...' : t('AppPromo.subscribe') || 'Subscribe'}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
          {/* </MaskContainer> */}
        </div>

        {/* Right: larger / integrated with BackgroundLines */}
        <div className="lg:col-span-7">
          <BackgroundLines className="h-[28rem] lg:h-[36rem] rounded-2xl overflow-hidden">
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative flex justify-center items-center w-full h-full p-6"
            >
              <div className="w-[460px] h-[280px] lg:w-[520px] lg:h-[320px] relative perspective-1000">
                {/* back shape */}
                <motion.div
                  initial={{ rotateY: -12, scale: 0.95, y: -8 }}
                  whileHover={{ rotateY: -6, y: -12, scale: 1 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-amber-200 to-yellow-50 shadow-xl transform -rotate-3"
                />

                {/* middle phone-like card (bigger) */}
                <motion.div
                  initial={{ rotateY: 6, scale: 0.98 }}
                  whileHover={{ rotateY: 0, scale: 1.02 }}
                  transition={{ duration: 0.5 }}
                  className="absolute left-6 top-4 w-[340px] h-[220px] lg:w-[380px] lg:h-[240px] rounded-2xl bg-white shadow-2xl border border-yellow-100 overflow-hidden"
                >
                  <div className="w-full h-full bg-[linear-gradient(135deg,#fff8eb_0%,#fffefc_60%)] flex items-center justify-center">
                    {/* placeholder 3D staged room */}
                    <div className="w-5/6 h-4/5 rounded-lg bg-gradient-to-b from-amber-100 to-white shadow-inner flex items-end p-4">
                      <div className="w-full">
                        <div className="h-3 bg-[#2a1407] rounded-md w-2/3 mb-2 opacity-90" />
                        <div className="h-2 bg-amber-300 rounded-md w-1/3" />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* front glossy card (phone mockup) - larger */}
                <motion.div
                  initial={{ y: 10, scale: 0.98 }}
                  whileHover={{ y: -6, scale: 1.03 }}
                  transition={{ duration: 0.45 }}
                  className="absolute right-0 bottom-0 w-[260px] h-[420px] lg:w-[300px] lg:h-[480px] rounded-3xl bg-gradient-to-br from-white to-yellow-50 shadow-2xl border border-yellow-100 overflow-hidden transform translate-y-4"
                >
                  {/* <div className="w-full h-full bg-[url('/app-promo.jpeg')] bg-contain bg-repeat-no-repeat bg-center" /> */}
                  <Image
                    src="/app-promo.jpeg"
                    alt="App Promo"
                    width={300}
                    height={480}
                    className="absolute top-0 left-0 w-full h-full bg-contain bg-repeat-no-repeat bg-center pointer-events-none"
                  />
                </motion.div>
              </div>
            </motion.div>
          </BackgroundLines>
        </div>
      </div>
    </motion.section>
  )
}
