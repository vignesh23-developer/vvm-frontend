'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import LanguageSwitch from '@/components/ui/CustomComponent/languageSwitch/languageSwitch'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import LoginFormPanel from '@/components/auth/LoginFormPanel'

const Login = () => {
  const locale = useLocale()
  const searchParams = useSearchParams()
  const isRedirect = searchParams.get('next')
  const referralCodeFromUrl = searchParams.get('referralCode')
  const router = useRouter()
  const { token, loading } = useAuth()

  useEffect(() => {
    if (loading) return
    if (token) {
      router.replace(isRedirect || '/')
    }
  }, [isRedirect, loading, router, token])

  return (
    <motion.div
      className="min-h-screen flex relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <motion.div className="absolute top-4 right-4" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <LanguageSwitch />
      </motion.div>

      <motion.div
        className="hidden md:flex w-1/2 bg-[#2c1207] flex-col items-center justify-center text-center p-6"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <Link href="/">
          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }} className="max-w-xs cursor-pointer">
            <Image src={`/footer_logo_new_${locale}.png`} alt="Vaazhga Valamudan Logo" width={400} height={300} className="mt-6" />
          </motion.div>
        </Link>
      </motion.div>

      <motion.div
        className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-20"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
      >
        <motion.div
          className="w-full max-w-md"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
        >
          <LoginFormPanel nextPath={isRedirect} referralCodeFromUrl={referralCodeFromUrl} showHeader />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default Login
