'use client'

import { useState, useEffect } from 'react'
import { Formik, Form, FieldArray } from 'formik'
import { useTranslations } from 'next-intl'
import { MessageCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { appEndpoints } from '@/services/endpoints'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'
import LanguageSwitch from '@/components/ui/CustomComponent/languageSwitch/languageSwitch'
import { SignupSchema } from '@/utils/validations/auth/AuthValidationSchema'
import { postMethod } from '@/services/service'
import toast from 'react-hot-toast'
import { useRouter, useSearchParams } from 'next/navigation'
import { setLocalStorageItem } from '@/utils/local_storage/local_storage_handler'
import { LOCAL_STORAGE_NAME } from '@/utils/local_storage/local_storage_constant'

interface SignupFormValues {
  firstName: string
  lastName: string
  phone: string
  email: string
  otp: string[]
}

export default function SignupPage() {
  const t = useTranslations()
  const router = useRouter()
  const searchParams = useSearchParams()
  const phone = searchParams.get('phone') || ''
  const [timeLeft, setTimeLeft] = useState(120) // 2 minutes

  useEffect(() => {
    if (timeLeft <= 0) return
    const timer = setInterval(() => setTimeLeft(s => s - 1), 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  const handleResend = () => {
    if (timeLeft > 0) return
    console.log('Resending OTP...')
    setTimeLeft(120)
  }

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  const canResend = timeLeft <= 0

  const [buttonType, setButtonType] = useState<'sms' | 'whatsapp'>('sms')

  const initialValues: SignupFormValues = {
    firstName: '',
    lastName: '',
    phone: phone,
    email: '',
    otp: ['', '', '', '', '', ''],
  }

  const handleSignupSubmit = async (values: SignupFormValues, setSubmitting: (isSubmitting: boolean) => void, buttonType: 'sms' | 'whatsapp') => {
    const otpValue = values.otp.join('')
    console.log('Formik Submitted:', { ...values, otpValue, buttonType })

    const payload = {
      phoneNumber: phone,
      otp: otpValue,
      user: {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
      },
      // otpType: buttonType === 'whatsapp' ? 'whatsapp_otp' : 'sms_otp',
    }
    console.log('Signup Payload:', payload)
    try {
      const response = await postMethod<{
        accessToken?: string
        refreshToken?: string
        message?: string
        user?: any
      }>(appEndpoints.loginVerifyOtp, payload)

      const token = response.data?.accessToken
      const userData = response.data?.user
      if (token) {
        setLocalStorageItem(LOCAL_STORAGE_NAME.authToken, token)
        setLocalStorageItem(LOCAL_STORAGE_NAME.userData, userData || '')
      }

      const successMessage = response.data?.message || response.message || 'OTP verified successfully'
      toast.success(successMessage)

      router.push('/')
    } catch (error) {
      console.error('Signup Error:', error)
      toast.error('Registration failed')
    } finally {
      setSubmitting(false)
    }
  }
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  }

  return (
    <motion.div className="min-h-screen flex relative" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {/* Language Switch */}
      <motion.div className="absolute top-4 right-4" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <LanguageSwitch />
      </motion.div>

      {/* Left Section - Logo */}
      <motion.div
        className="hidden md:flex w-1/2 bg-[#2c1207] flex-col items-center justify-center text-center p-6"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Link href="/home">
          <motion.div className="max-w-xs hover:cursor-pointer" whileHover={{ scale: 1.05 }}>
            <Image src="/footer_logo.png" alt="Vaazhga Valamudan Logo" width={400} height={300} className="mt-6" />
          </motion.div>
        </Link>
      </motion.div>

      {/* Right Section - Signup Form */}
      <motion.div
        className="w-full md:w-1/2 flex items-center justify-center p-10 sm:p-16 md:p-20"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div className="w-full max-w-md" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5 }}>
          <motion.h2
            className="text-2xl font-bold text-gray-800"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {t('Auth.signup')} <br />
            <span className="text-green-900">{t('Auth.to_get_started')}</span>
          </motion.h2>

          <motion.p
            className="text-gray-500 mt-2 text-xs"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {t('Auth.signup_description')}
          </motion.p>

          <Formik
            initialValues={initialValues}
            validationSchema={SignupSchema(t)}
            onSubmit={(values, { setSubmitting }) => {
              handleSignupSubmit(values, setSubmitting, buttonType)
            }}
          >
            {({ values, isSubmitting }) => (
              <Form className="mt-4 space-y-4">
                {/* Input Fields */}
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { staggerChildren: 0.1 },
                    },
                  }}
                >
                  <FormikTextField
                    label={t('form.first_name.label')}
                    type="text"
                    name="firstName"
                    placeholder={t('form.first_name.placeholder')}
                    className="w-full border border-gray-300 text-xs rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-900"
                  />

                  <FormikTextField
                    label={t('form.last_name.label')}
                    type="text"
                    name="lastName"
                    placeholder={t('form.last_name.placeholder')}
                    className="w-full border border-gray-300 text-xs rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-900"
                  />
                  <FormikTextField
                    label={t('form.email.label')}
                    type="email"
                    name="email"
                    placeholder={t('form.email.placeholder')}
                    className="w-full border border-gray-300 text-xs rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-900"
                  />
                </motion.div>

                {/* OTP */}
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                  <FieldArray name="otp">
                    {arrayHelpers => (
                      <>
                        <label className="block text-sm font-medium mb-1">{t('Auth.otp_verification')}</label>
                        <div className="flex justify-between mt-4 mb-4">
                          {values.otp.map((digit, index) => (
                            <motion.input
                              key={index}
                              id={`otp-${index}`}
                              type="text"
                              maxLength={1}
                              value={digit}
                              onChange={e => {
                                const value = e.target.value
                                if (/^[0-9]?$/.test(value)) {
                                  arrayHelpers.replace(index, value)
                                  if (value && index < values.otp.length - 1) {
                                    const nextInput = document.getElementById(`otp-${index + 1}`)
                                    nextInput?.focus()
                                  }
                                }
                              }}
                              className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-900"
                              whileFocus={{ scale: 1.1 }}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </FieldArray>
                </motion.div>
                {/* Resend OTP */}
                <motion.p
                  whileHover={canResend ? { scale: 1.02, color: '#14532d' } : {}}
                  onClick={handleResend}
                  className={`text-right mt-4 text-xs transition cursor-pointer
        ${canResend ? 'text-green-700 hover:underline' : 'text-gray-400 cursor-not-allowed'}
      `}
                >
                  {canResend ? t('Auth.resend_otp') : `${t('Auth.resend_in')} ${formatTime(timeLeft)}`}
                </motion.p>
                {/* WhatsApp Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-[#2B1B12] text-white text-sm py-2 rounded-md flex items-center justify-center space-x-2 hover:bg-[#3d2616] disabled:opacity-60 cursor-pointer"
                >
                  <span>{isSubmitting ? 'Submitting...' : t('Auth.whatapp_button')}</span>
                </motion.button>

                {/* Login Link */}
                <motion.p className="text-center text-gray-600 text-xs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                  {t('Auth.signup_message')}{' '}
                  <a href="/login" className="font-semibold text-green-900">
                    {t('Auth.login')}
                  </a>
                </motion.p>

                {/* Divider */}
                <motion.div
                  className="flex items-center justify-center space-x-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="flex-1 border-t border-gray-300"></div>
                  <span className="text-gray-500 text-sm">OR</span>
                  <div className="flex-1 border-t border-gray-300"></div>
                </motion.div>

                {/* Continue with SMS */}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full border border-gray-400 text-sm rounded-md py-2 flex items-center justify-center space-x-2 hover:bg-gray-50 cursor-pointer"
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
