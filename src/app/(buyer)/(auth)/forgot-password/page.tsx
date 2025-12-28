'use client'

import { motion } from 'framer-motion'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'
import { Formik, Form } from 'formik'
import { ArrowLeft, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { AuthSchema } from '@/utils/validations/auth/AuthValidationSchema'
import LanguageSwitch from '@/components/ui/CustomComponent/languageSwitch/languageSwitch'
import { useLocale, useTranslations } from 'next-intl'

interface AuthFormValues {
  phone: string
}

const ForgotPassword = () => {
  const t = useTranslations()
  const locale = useLocale()
  const initialValues: AuthFormValues = {
    phone: '',
  }

  const handleForgotPasswordSubmit = (values: any, setSubmitting: (isSubmitting: boolean) => void) => {
    // console.log('Form Submitted ✅', values)
    setTimeout(() => {
      setSubmitting(false)
    }, 1000)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex flex-col md:flex-row relative"
    >
      {/* Language Switch */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="absolute top-4 right-4">
        <LanguageSwitch />
      </motion.div>

      {/* Left Side - Logo Section */}
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

      {/* Right Side - Form Section */}
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
          {/* Back Button */}
          <Link href="/login" className="flex items-center text-sm font-semibold text-green-900 mb-4 hover:underline">
            <ArrowLeft size={20} className="mr-2" /> {t('Auth.back')}
          </Link>

          {/* Title */}
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl sm:text-3xl font-bold text-gray-800 leading-snug"
          >
            {t('Auth.forgot_password')}
          </motion.h2>

          <motion.p
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-500 mt-2 text-xs sm:text-sm"
          >
            {t('Auth.forgot_description')}
          </motion.p>

          {/* Formik Form */}
          <Formik
            initialValues={initialValues}
            validationSchema={AuthSchema(t)}
            onSubmit={(values, { setSubmitting }) => {
              handleForgotPasswordSubmit(values, setSubmitting)
            }}
          >
            {({ isSubmitting }) => (
              <Form className="mt-4 space-y-4">
                {/* Phone Number */}
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  <FormikTextField
                    label={t('form.phone_number.label')}
                    type="tel"
                    name="phone"
                    placeholder={t('form.phone_number.placeholder')}
                    className="w-full border border-gray-300 text-xs rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-900"
                  />
                </motion.div>

                {/* Reset Password Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#2B1B12] text-white text-sm sm:text-base py-2 rounded-md font-medium hover:bg-[#3d2616] disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? 'Sending OTP...' : t('Auth.reset_password')}
                </motion.button>

                {/* Divider */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center justify-center space-x-2"
                >
                  <div className="flex-1 border-t border-gray-300"></div>
                  <span className="text-gray-500 text-sm">OR</span>
                  <div className="flex-1 border-t border-gray-300"></div>
                </motion.div>

                {/* Continue with SMS */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  className="w-full border border-gray-400 text-sm sm:text-base rounded-md py-2 flex items-center justify-center space-x-2 hover:bg-gray-50 cursor-pointer"
                >
                  <MessageCircle size={20} />
                  <span>{t('Auth.continue_with_sms')}</span>
                </motion.button>
              </Form>
            )}
          </Formik>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default ForgotPassword
