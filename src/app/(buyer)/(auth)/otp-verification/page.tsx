'use client'

import { Formik, Form, type FormikHelpers } from 'formik'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useGlobalContext } from '@/hooks/GlobalContext/GlobalContext'
import OTPInput from '@/components/ui/OTPInput/OTPInput'
import LanguageSwitch from '@/components/ui/CustomComponent/languageSwitch/languageSwitch'
import toast from 'react-hot-toast'
import { appEndpoints } from '@/services/endpoints'
import { postMethod } from '@/services/service'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import { OtpSchema } from '@/utils/validations/auth/AuthValidationSchema'
import Button from '@/components/ui/CustomComponent/Button/Button'

export default function OtpVerification() {
  const t = useTranslations()
  const { globalValue, reset } = useGlobalContext()
  const { setUser, setToken, token, loading } = useAuth()
  const router = useRouter()

  // Redirect if already logged in or missing phone number
  useEffect(() => {
    if (loading) return

    // If user is already logged in, OTP page should not be accessible.
    if (token) {
      router.replace('/')
      return
    }

    // If user isn't logged in and no phone is present, OTP flow is invalid.
    // if (!globalValue?.phoneNumber) {
    //   router.replace('/login')
    //   return
    // }
    // globalValue?.phoneNumber,
  }, [loading, router, token])

  type OtpValues = {
    otp: string[]
  }

  const initialValues: OtpValues = {
    otp: ['', '', '', '', '', ''],
  }

  // Handle Submit
  const handleSubmit = async (values: OtpValues, { setSubmitting }: FormikHelpers<OtpValues>) => {
    try {
      if (!globalValue?.phoneNumber) {
        toast.error('Missing phone number. Please click back to the login process.')
        return
      }

      const otpValue = values.otp.join('')

      if (otpValue.length !== 6) {
        toast.error('Please enter the 6-digit OTP')
        return
      }

      const payload = {
        phoneNumber: globalValue?.phoneNumber,
        otp: otpValue,
      }

      const response = await postMethod<{
        accessToken?: string
        refreshToken?: string
        message?: string
        user?: any
      }>(appEndpoints.loginVerifyOtp, payload)

      // console.log(response, 'response 93')
      if (response.error) {
        toast.error(response.message || 'OTP verification failed')
        return
      }

      if (response?.status === '200') {
        const token = response.data?.accessToken
        const userData = response.data?.user
        // console.log('user', response.data)
        if (token) {
          setUser(userData || null)
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
          toast.error(response.message || 'OTP verification failed: Missing token')
        }
      }
    } catch (error) {
      console.error('OTP verification failed:', error)
      toast.error('Unable to verify OTP right now. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // ✨ Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1, duration: 0.5 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  }

  if (loading || token) {
    return null
  }

  return (
    <motion.div className="min-h-screen flex relative bg-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      {/* Language Switch */}
      <div className="absolute top-4 right-4">
        <LanguageSwitch />
      </div>

      {/* Left Section - Logo */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden md:flex w-1/2 bg-[#2c1207] flex-col items-center justify-center p-6"
      >
        <Link href="/">
          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 200 }} className="max-w-xs cursor-pointer">
            <Image src="/footer_logo_new.PNG" alt="Vaazhga Valamudan Logo" width={400} height={300} className="mt-6" />
          </motion.div>
        </Link>
      </motion.div>

      {/* Right Section - OTP Form */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full md:w-1/2 flex items-start justify-center p-10 sm:p-16 md:p-20"
      >
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="w-full max-w-md">
          {/* Back Button */}
          <motion.div variants={itemVariants}>
            <Link href="/login" className="flex items-center text-sm font-semibold text-green-900 mb-2 hover:underline">
              <ArrowLeft size={20} className="mr-2" /> {t('Auth.back')}
            </Link>
          </motion.div>

          {/* Title & Description */}
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-bold text-gray-800 leading-snug">{t('Auth.otp_verification')}</h2>
            <p className="text-gray-500 mt-2 text-xs">{t('Auth.otp_description')}</p>
          </motion.div>

          {/* Formik Form */}
          <Formik initialValues={initialValues} validationSchema={OtpSchema} onSubmit={handleSubmit}>
            {({ values, setFieldValue, errors, touched, isSubmitting }) => (
              <Form className="mt-6 space-y-4">
                {/* OTP Inputs (reusable component) */}
                <motion.div variants={containerVariants}>
                  <OTPInput
                    length={6}
                    value={values.otp}
                    onChange={next => setFieldValue('otp', next)}
                    initialTime={120}
                    reSendData={globalValue}
                    error={touched.otp && errors.otp ? errors.otp : undefined}
                  />
                </motion.div>

                {/* Verify Button */}
                <motion.div variants={itemVariants} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#2B1B12] text-white text-sm py-2 rounded-md flex items-center justify-center space-x-2 hover:bg-[#3d2616] disabled:opacity-60 cursor-pointer"
                  >
                    {isSubmitting ? 'Verifying...' : t('Auth.verify')}
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
