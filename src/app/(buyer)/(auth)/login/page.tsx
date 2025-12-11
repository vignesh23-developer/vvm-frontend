'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'
import { Formik, Form } from 'formik'
import { MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { AuthSchema } from '@/utils/validations/auth/AuthValidationSchema'
import { appEndpoints } from '@/services/endpoints'
import Image from 'next/image'
import Button from '@/components/ui/CustomComponent/Button/Button'
import { useTranslations } from 'next-intl'
import LanguageSwitch from '@/components/ui/CustomComponent/languageSwitch/languageSwitch'
import { postMethod } from '@/services/service'
import toast from 'react-hot-toast'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ResponseDTO } from '@/components/dto/response_dto'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import { useGlobalContext } from '@/hooks/GlobalContext/GlobalContext'
interface AuthFormValues {
  phone: string
}

const Login = () => {
  const t = useTranslations()
  const { setGlobalValue } = useGlobalContext()
  const searchParams = useSearchParams()
  const isRedirect = searchParams.get('next')
  const submitChannelRef = useRef<'sms' | 'whatsapp'>('sms')
  const [isLoading, setIsLoading] = useState(false)
  const [activeChannel, setActiveChannel] = useState<'sms' | 'whatsapp' | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const { token } = useAuth()

  console.log('Current pathname:', pathname, isRedirect)

  // useEffect(() => {
  //   const publicRoutes = ['/', '/about', '/services', '/pricing', '/help-center', '/login', '/register']

  //   // If user not logged in AND tries to access a protected route
  //   if (!token && !publicRoutes.includes(pathname)) {
  //     router.push('/login')
  //   }

  //   // If user is logged in AND tries to access login/register, redirect to home
  //   if (token && ['/login', '/register'].includes(pathname)) {
  //     router.push('/')
  //   }
  // }, [token, pathname, router])

  const initialValues: AuthFormValues = { phone: '' }

  const handleLoginSubmit = async (values: AuthFormValues, setSubmitting: (isSubmitting: boolean) => void, channel: 'sms' | 'whatsapp') => {
    setIsLoading(true)
    setSubmitting(true)
    try {
      const payload: {
        phoneNumber: string
        otpTypes: string[]
        isRedirect?: string
      } = {
        phoneNumber: values.phone,
        otpTypes: [channel === 'whatsapp' ? 'whatsapp_otp' : 'sms_otp'],
      }

      const response = (await postMethod(appEndpoints.loginSendOtp, payload)) as ResponseDTO

      // console.log('Login response:', response)

      if (response.status === '200') {
        const responseData = response.data as {
          message?: string
          data?: {
            message?: string
            isExistingUser?: boolean
          }
          isExistingUser?: boolean
        }
        if (responseData.isExistingUser) {
          // router.push(`/otp-verification?phone=${encodeURIComponent(values.phone)}`)
          payload['isRedirect'] = isRedirect ? isRedirect : ''
          setGlobalValue(payload)
          router.push(`/otp-verification`)
        } else {
          // router.push(`/signup?phone=${encodeURIComponent(values.phone)}`)
          payload['isRedirect'] = isRedirect ? isRedirect : ''
          setGlobalValue(payload)
          router.push(`/signup`)
        }
        const successMessage = responseData?.message || responseData?.data?.message || 'OTP sent successfully'
        toast.success(successMessage)
      } else {
        toast.error(response.message || 'Failed to send OTP')
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Failed to send OTP')
    } finally {
      setIsLoading(false)
      setSubmitting(false)
      setActiveChannel(null)
    }
  }

  return (
    <motion.div
      className="min-h-screen flex relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Language Switch */}
      <motion.div className="absolute top-4 right-4" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <LanguageSwitch />
      </motion.div>

      {/* Left Side - Logo Section */}
      <motion.div
        className="hidden md:flex w-1/2 bg-[#2c1207] flex-col items-center justify-center text-center p-6"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <Link href="/">
          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }} className="max-w-xs cursor-pointer">
            <Image src="/footer_logo.png" alt="Vaazhga Valamudan Logo" width={400} height={300} className="mt-6" />
          </motion.div>
        </Link>
      </motion.div>

      {/* Right Side - Login Form */}
      <motion.div
        className="w-full md:w-1/2 flex items-center justify-center p-20"
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
          <motion.h2
            className="text-2xl font-bold text-[#2a1407]"
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1 },
            }}
          >
            {t('Auth.hello')} <br />
            <span className="text-yellow-700">{t('Auth.welcome_back')}</span>
          </motion.h2>

          <motion.p className="text-gray-500 mt-2 text-xs" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
            {t('Auth.login_description')}
          </motion.p>

          <Formik
            initialValues={initialValues}
            validationSchema={AuthSchema(t)}
            onSubmit={(values, { setSubmitting }) => {
              handleLoginSubmit(values, setSubmitting, submitChannelRef.current)
            }}
          >
            {({ isSubmitting, submitForm }) => (
              <Form className="mt-4 space-y-4">
                <motion.div
                  variants={{
                    hidden: { y: 20, opacity: 0 },
                    visible: { y: 0, opacity: 1 },
                  }}
                >
                  <FormikTextField
                    label={t('form.phone_number.label')}
                    type="tel"
                    name="phone"
                    placeholder={t('form.phone_number.placeholder')}
                    className="w-full border border-yellow-200 text-xs rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-400"
                  />
                </motion.div>

                {/* WhatsApp Button */}
                <motion.div
                  variants={{
                    hidden: { y: 20, opacity: 0 },
                    visible: { y: 0, opacity: 1 },
                  }}
                >
                  <motion.div whileTap={{ scale: 0.97 }}>
                    <Button
                      type="button"
                      disabled={isSubmitting || isLoading}
                      onClick={() => {
                        submitChannelRef.current = 'whatsapp'
                        setActiveChannel('whatsapp')
                        void submitForm()
                      }}
                      className="w-full bg-[#2a1407] text-white text-sm py-2 rounded-md flex items-center justify-center space-x-2 hover:from-[#3b1804] hover:to-[#2a1407] disabled:opacity-60"
                    >
                      <span>{(isSubmitting || isLoading) && activeChannel === 'whatsapp' ? 'Verifying...' : t('Auth.whatapp_button')}</span>
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Login Link */}
                {/* <motion.p className="text-center text-gray-600 text-xs" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                  {t('Auth.login_message')}{' '}
                  <a href="/signup" className="font-semibold text-green-900 hover:underline">
                    {t('Auth.signup')}
                  </a>
                </motion.p> */}

                {/* Divider */}
                <motion.div className="flex items-center justify-center space-x-2" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                  <div className="flex-1 border-t border-gray-300"></div>
                  <span className="text-gray-500 text-sm">OR</span>
                  <div className="flex-1 border-t border-gray-300"></div>
                </motion.div>

                {/* Continue with SMS */}
                <motion.div
                  variants={{
                    hidden: { y: 20, opacity: 0 },
                    visible: { y: 0, opacity: 1 },
                  }}
                >
                  <motion.div whileTap={{ scale: 0.97 }}>
                    <Button
                      type="button"
                      disabled={isSubmitting || isLoading}
                      onClick={() => {
                        submitChannelRef.current = 'sms'
                        setActiveChannel('sms')
                        void submitForm()
                      }}
                      className="w-full border border-yellow-300 text-sm rounded-md py-2 flex items-center justify-center space-x-2 hover:bg-yellow-50 bg-gradient-to-r from-yellow-50 to-yellow-100/50 text-[#2a1407]"
                    >
                      <MessageCircle size={20} />
                      <span>{(isSubmitting || isLoading) && activeChannel === 'sms' ? 'Verifying...' : t('Auth.continue_with_sms')}</span>
                    </Button>
                  </motion.div>
                </motion.div>
              </Form>
            )}
          </Formik>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default Login
