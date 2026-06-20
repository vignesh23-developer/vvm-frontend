'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import LanguageSwitch from '@/components/ui/CustomComponent/languageSwitch/languageSwitch'
import { useLocale } from 'next-intl'
import { useLoginModal } from '@/components/auth/LoginModalProvider'
import ForgotPasswordFormPanel from '@/components/auth/ForgotPasswordFormPanel'

const ForgotPassword = () => {
  const locale = useLocale()
  const { openLoginModal } = useLoginModal()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex flex-col md:flex-row relative"
    >
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="absolute top-4 right-4">
        <LanguageSwitch />
      </motion.div>

      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden md:flex w-full md:w-1/2 bg-[#2c1207] flex-col items-center justify-center p-6"
      >
        <Link href="/">
          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }} className="max-w-xs hover:cursor-pointer">
            <Image src={`/footer_logo_new_${locale}.png`} alt="Vaazhga Valamudan Logo" width={400} height={300} className="mt-6" priority />
          </motion.div>
        </Link>
      </motion.div>

      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full md:w-1/2 flex items-center justify-center px-6 sm:px-10 md:px-16 lg:px-20 py-12"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="w-full max-w-md"
        >
          <ForgotPasswordFormPanel
            showHeader
            isActive
            onBackToLogin={() => openLoginModal()}
            onResetSuccess={() => openLoginModal()}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default ForgotPassword
