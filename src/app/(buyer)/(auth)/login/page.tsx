'use client'

import { useEffect, useState } from 'react'
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
import { usePathname, useRouter } from 'next/navigation'
import { getLocalStorageItem } from '@/utils/local_storage/local_storage_handler'

interface AuthFormValues {
  phone: string
}

const Login = () => {
  const t = useTranslations()
  const [buttonType, setButtonType] = useState<'sms' | 'whatsapp'>('sms')
  const router = useRouter()
  const pathname = usePathname()
  const token = getLocalStorageItem('authToken')

  useEffect(() => {
    const publicRoutes = ['/', '/about', '/services', '/pricing', '/help-center', '/login', '/register']

    // If user not logged in AND tries to access a protected route
    if (!token && !publicRoutes.includes(pathname)) {
      router.push('/login')
    }

    // If user is logged in AND tries to access login/register, redirect to home
    if (token && ['/login', '/register'].includes(pathname)) {
      router.push('/')
    }
  }, [token, pathname, router])

  const initialValues: AuthFormValues = { phone: '' }

  const handleLoginSubmit = async (values: AuthFormValues, setSubmitting: (isSubmitting: boolean) => void, type: string) => {
    try {
      const payload = {
        phoneNumber: values.phone,
        otpTypes: [type === 'whatsapp' ? 'whatsapp_otp' : 'sms_otp'],
      }

      const response = await postMethod(appEndpoints.loginSendOtp, payload)

      const responseData = response.data as {
        message?: string
        data?: {
          message?: string
          isExistingUser?: boolean
        }
        isExistingUser?: boolean
      }

      const nestedData = responseData?.data
      const isExistingUser = nestedData?.isExistingUser ?? responseData?.isExistingUser

      const successMessage = nestedData?.message || responseData?.message || 'OTP sent successfully'

      toast.success(successMessage)

      if (typeof isExistingUser === 'boolean') {
        if (isExistingUser) {
          router.push(`/otp-verification?phone=${encodeURIComponent(values.phone)}`)
        } else {
          router.push(`/signup?phone=${encodeURIComponent(values.phone)}`)
        }
      }

      console.log('Button Clicked:', type, response)
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Failed to send OTP')
    } finally {
      setSubmitting(false)
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
        <Link href="/home">
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
            className="text-2xl font-bold text-gray-800"
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1 },
            }}
          >
            {t('Auth.hello')} <br />
            <span className="text-green-900">{t('Auth.welcome_back')}</span>
          </motion.h2>

          <motion.p className="text-gray-500 mt-2 text-xs" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
            {t('Auth.login_description')}
          </motion.p>

          <Formik
            initialValues={initialValues}
            validationSchema={AuthSchema(t)}
            onSubmit={(values, { setSubmitting }) => {
              handleLoginSubmit(values, setSubmitting, buttonType)
            }}
          >
            {({ isSubmitting }) => (
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
                    className="w-full border border-gray-300 text-xs rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-900"
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
                      type="submit"
                      disabled={isSubmitting}
                      onClick={() => setButtonType('whatsapp')}
                      className="w-full bg-[#2B1B12] text-white text-sm py-2 rounded-md flex items-center justify-center space-x-2 hover:bg-[#3d2616] disabled:opacity-60"
                    >
                      <span>{isSubmitting ? 'Verifying...' : t('Auth.whatapp_button')}</span>
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Login Link */}
                <motion.p className="text-center text-gray-600 text-xs" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                  {t('Auth.login_message')}{' '}
                  <a href="/signup" className="font-semibold text-green-900 hover:underline">
                    {t('Auth.signup')}
                  </a>
                </motion.p>

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
                      onClick={() => setButtonType('sms')}
                      className="w-full border border-gray-400 text-sm rounded-md py-2 flex items-center justify-center space-x-2 hover:bg-gray-50"
                    >
                      <MessageCircle size={20} />
                      <span>{t('Auth.continue_with_sms')}</span>
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
