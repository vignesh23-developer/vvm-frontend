'use client'

import { useEffect, useState } from 'react'
import { Formik, Form } from 'formik'
import { useTranslations } from 'next-intl'
import { ArrowLeft } from 'lucide-react'
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
import { useGlobalContext } from '@/hooks/GlobalContext/GlobalContext'

interface SignupFormValues {
  firstName: string
  lastName: string
  phone: string
  email: string
  otp: string[]
}

export default function SignupPage() {
  const t = useTranslations()
  const { globalValue, reset } = useGlobalContext()
  const { setUser, setToken, token, loading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextUrl = searchParams.get('next') || globalValue?.isRedirect || null

  // Redirect if already logged in or missing phone number
  useEffect(() => {
    if (loading) return

    // If user is already logged in, don't show signup page.
    if (token) {
      router.replace(nextUrl || '/')
      return
    }

    // Signup OTP flow depends on phoneNumber coming from the login step.
    if (!globalValue?.phoneNumber) {
      router.replace('/login')
    }
  }, [globalValue?.phoneNumber, loading, nextUrl, router, token])

  const [buttonType, setButtonType] = useState<'sms' | 'whatsapp'>('sms')

  const initialValues: SignupFormValues = {
    firstName: '',
    lastName: '',
    phone: globalValue?.phoneNumber || '',
    email: '',
    otp: ['', '', '', '', '', ''],
  }

  if (loading || token || !globalValue?.phoneNumber) {
    return null
  }

  const handleSignupSubmit = async (values: SignupFormValues, setSubmitting: (isSubmitting: boolean) => void, buttonType: 'sms' | 'whatsapp') => {
    const otpValue = values.otp.join('')
    // console.log('Formik Submitted:', { ...values, otpValue, buttonType })

    const payload = {
      phoneNumber: globalValue?.phoneNumber,
      otp: otpValue,
      user: {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
      },
      // otpTypes: globalValue?.otpTypes || 'SMS',
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
          if (globalValue?.isRedirect) {
            router.push(globalValue.isRedirect)
          } else {
            router.push('/')
          }
          reset()
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
            <Image src="/footer_logo_new.PNG" alt="Vaazhga Valamudan Logo" width={400} height={300} className="mt-6" />
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
          {/* Back Button */}
          <motion.div variants={itemVariants}>
            <Link href="/login" className="flex items-center text-sm font-semibold text-green-900 mb-2 hover:underline">
              <ArrowLeft size={20} className="mr-2" /> {t('Auth.back')}
            </Link>
          </motion.div>
          <motion.h2
            className="text-2xl font-bold text-[#2a1407]"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {t('Auth.signup')} <br />
            <span className="text-yellow-700">{t('Auth.to_get_started')}</span>
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
                    className="w-full border border-yellow-200 text-xs rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-400"
                  />

                  <FormikTextField
                    label={t('form.last_name.label')}
                    type="text"
                    name="lastName"
                    placeholder={t('form.last_name.placeholder')}
                    className="w-full border border-yellow-200 text-xs rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-400"
                  />
                  <FormikTextField
                    label={t('form.email.label')}
                    type="email"
                    name="email"
                    placeholder={t('form.email.placeholder')}
                    className="w-full border border-yellow-200 text-xs rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-400"
                  />
                </motion.div>

                {/* OTP */}
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                  <OTPInput
                    length={6}
                    value={values.otp}
                    onChange={next => setFieldValue('otp', next)}
                    initialTime={120}
                    reSendData={globalValue}
                    error={touched.otp && errors.otp ? errors.otp : undefined}
                  />
                </motion.div>

                {/* WhatsApp Button */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#2a1407] text-white text-sm py-2 rounded-md flex items-center justify-center space-x-2 hover:from-[#2a1407] hover:to-[#2a1407] disabled:opacity-60 cursor-pointer"
                  >
                    <span>{isSubmitting ? 'Submitting...' : t('Auth.submit')}</span>
                  </Button>
                </motion.div>

                {/* Login Link */}
                {/* <motion.p className="text-center text-gray-600 text-xs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                  {t('Auth.signup_message')}{' '}
                  <a href="/login" className="font-semibold text-yellow-700 hover:text-yellow-800">
                    {t('Auth.login')}
                  </a>
                </motion.p> */}

                {/* Divider */}
                {/* <motion.div
                  className="flex items-center justify-center space-x-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="flex-1 border-t border-gray-300"></div>
                  <span className="text-gray-500 text-sm">OR</span>
                  <div className="flex-1 border-t border-gray-300"></div>
                </motion.div> */}

                {/* Continue with SMS */}
                {/* <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="button"
                    className="w-full border border-yellow-300 text-sm rounded-md py-2 flex items-center justify-center space-x-2 hover:bg-yellow-50 bg-gradient-to-r from-yellow-50 to-yellow-100/50 text-[#2a1407] cursor-pointer"
                  >
                    <MessageCircle size={20} />
                    <span>{t('Auth.continue_with_sms')}</span>
                  </Button>
                </motion.div> */}
              </Form>
            )}
          </Formik>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
