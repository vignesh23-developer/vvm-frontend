'use client'

import { useState } from 'react'
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
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import { ResponseDTO } from '@/components/dto/response_dto'
import OTPInput from '@/components/ui/OTPInput/OTPInput'
import Button from '@/components/ui/CustomComponent/Button/Button'

interface SignupFormValues {
  firstName: string
  lastName: string
  phone: string
  email: string
  otp: string[]
}

export default function SignupPage() {
  const t = useTranslations()
  const { setUser, setToken } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const phone = searchParams.get('phone') || ''
  const handleResend = async () => {
    try {
      // call resend endpoint if needed, e.g. postMethod(appEndpoints.loginSendOtp, { phoneNumber: phone })
      // toast.success('OTP resent')
    } catch (err) {
      console.error('Resend OTP failed', err)
      toast.error('Failed to resend OTP')
    }
  }

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
    // console.log('Signup Payload:', payload)
    try {
      const response = (await postMethod<{
        accessToken?: string
        refreshToken?: string
        message?: string
        user?: any
      }>(appEndpoints.loginVerifyOtp, payload)) as ResponseDTO

      if (response.status === '200') {
        const token = response.data?.accessToken
        const userData = response.data?.user
        if (token) {
          setUser(userData)
          setToken(token)
          const successMessage = response.data?.message || response.message || 'OTP verified successfully'
          toast.success(successMessage)
          router.push('/')
        } else {
          toast.error(response.message || 'Missing access token in response')
        }
      }
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
        <Link href="/">
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
            {({ values, setFieldValue, errors, touched, isSubmitting }) => (
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
                  <OTPInput
                    length={6}
                    value={values.otp}
                    onChange={next => setFieldValue('otp', next)}
                    initialTime={120}
                    onResend={handleResend}
                    error={touched.otp && errors.otp ? errors.otp : undefined}
                  />
                </motion.div>

                {/* WhatsApp Button */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#2B1B12] text-white text-sm py-2 rounded-md flex items-center justify-center space-x-2 hover:bg-[#3d2616] disabled:opacity-60 cursor-pointer"
                  >
                    <span>{isSubmitting ? 'Submitting...' : t('Auth.whatapp_button')}</span>
                  </Button>
                </motion.div>

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
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="button"
                    className="w-full border border-gray-400 text-sm rounded-md py-2 flex items-center justify-center space-x-2 hover:bg-gray-50 cursor-pointer"
                  >
                    <MessageCircle size={20} />
                    <span>{t('Auth.continue_with_sms')}</span>
                  </Button>
                </motion.div>
              </Form>
            )}
          </Formik>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
