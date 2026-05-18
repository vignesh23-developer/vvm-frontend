'use client'

import { useEffect, useState } from 'react'
import { Formik, Form } from 'formik'
import { useLocale, useTranslations } from 'next-intl'
import { ArrowLeft, MessageCircle, Phone } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { appEndpoints } from '@/services/endpoints'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'
import FormikPasswordField from '@/components/ui/Formik/FormikPasswordField/FormikPasswordField'
import LanguageSwitch from '@/components/ui/CustomComponent/languageSwitch/languageSwitch'
import { SignupSchema } from '@/utils/validations/auth/AuthValidationSchema'
import { postMethod, getMethod } from '@/services/service'
import toast from 'react-hot-toast'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import { ResponseDTO } from '@/components/dto/response_dto'
import OTPInput from '@/components/ui/OTPInput/OTPInput'
import Button from '@/components/ui/CustomComponent/Button/Button'
import { useGlobalContext } from '@/hooks/GlobalContext/GlobalContext'
import { useLoginModal } from '@/components/auth/LoginModalProvider'

interface SignupFormValues {
  firstName: string
  lastName: string
  phone: string
  email: string
  password: string
  confirmPassword: string
  otp: string[]
}

export default function SignupPage() {
  const t = useTranslations()
  const locale = useLocale()
  const { globalValue, reset } = useGlobalContext()
  const { setUser, setToken, token, loading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [sendingOtpType, setSendingOtpType] = useState<'sms_otp' | 'whatsapp_otp' | null>(null)
  const router = useRouter()
  const { openLoginModal } = useLoginModal()
  const searchParams = useSearchParams()
  const nextUrl = searchParams.get('next') || globalValue?.isRedirect || null
  const googleIdFromUrl = searchParams.get('googleId')
  const emailFromUrl = searchParams.get('email')
  const referralCodeFromUrl = searchParams.get('referralCode')

  // Extract name from email if Google OAuth (email format: firstname.lastname@gmail.com or firstname_lastname@gmail.com)
  const extractNameFromEmail = (email: string | null): { firstName: string; lastName: string } => {
    if (!email) return { firstName: '', lastName: '' }

    const emailPrefix = email.split('@')[0]
    // Try to split by dot or underscore
    const parts = emailPrefix.split(/[._]/)

    if (parts.length >= 2) {
      // Capitalize first letter of each part
      const firstName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase()
      const lastName = parts
        .slice(1)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(' ')
      return { firstName, lastName }
    } else {
      // Single part - use as firstName
      const firstName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1).toLowerCase()
      return { firstName, lastName: '' }
    }
  }

  const { firstName: prefillFirstName, lastName: prefillLastName } =
    googleIdFromUrl && emailFromUrl ? extractNameFromEmail(emailFromUrl) : { firstName: '', lastName: '' }

  // Redirect if already logged in or missing phone number
  useEffect(() => {
    if (loading) return

    // If user is already logged in, don't show signup page.
    if (token) {
      router.replace(nextUrl || '/')
      return
    }

    // Signup OTP flow depends on phoneNumber coming from the login step.
    // if (!globalValue?.phoneNumber) {
    //   router.replace('/login')
    // }
    // globalValue?.phoneNumber,
  }, [loading, nextUrl, router, token])

  const initialValues: SignupFormValues = {
    firstName: prefillFirstName,
    lastName: prefillLastName,
    phone: globalValue?.phoneNumber || '',
    email: emailFromUrl || '', // Pre-fill email if from Google
    password: '',
    confirmPassword: '',
    otp: ['', '', '', '', '', ''],
  }

  if (loading || token) {
    return null
  }

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true)
      // Generate device info for web
      const deviceId = `web:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const params: {
        deviceType: string
        deviceId: string
        platform: string
        referralCode?: string
      } = {
        deviceType: 'web',
        deviceId,
        platform: 'web',
      }

      // Include referralCode if present in URL
      if (referralCodeFromUrl) {
        params.referralCode = referralCodeFromUrl
      }

      const response = await getMethod<{ url: string }>(appEndpoints.googleLogin, params)

      if (response.status === '200' && !response.error && response.data?.url) {
        // Redirect to Google OAuth URL
        window.location.href = response.data.url
      } else {
        toast.error('Failed to initiate Google login')
        setIsGoogleLoading(false)
      }
    } catch (error) {
      console.error('Google login error:', error)
      toast.error('Failed to initiate Google login')
      setIsGoogleLoading(false)
    }
  }

  const handleSendOtp = async (phoneNumber: string, otpType: 'sms_otp' | 'whatsapp_otp' = 'sms_otp') => {
    if (!phoneNumber || phoneNumber.trim() === '') {
      toast.error('Please enter a phone number')
      return
    }

    try {
      console.debug('[Signup] handleSendOtp start', { phoneNumber, otpType, sendingOtpType })
      // mark which channel is being sent so only that button is disabled
      setSendingOtpType(otpType)
      setIsSendingOtp(true)

      const payload: { phoneNumber: string; otpType?: string } = {
        phoneNumber: phoneNumber.trim(),
      }
      if (otpType) payload.otpType = otpType

      const response = await postMethod<{ message: string }>(appEndpoints.registerSendOtp, payload)

      if (response.status === '200' && !response.error) {
        const methodLabel = otpType === 'whatsapp_otp' ? 'via WhatsApp' : 'via SMS'
        toast.success(response.data?.message || `OTP sent successfully ${methodLabel}`)
      } else {
        toast.error(response.message || 'Failed to send OTP')
      }
    } catch (error: any) {
      console.error('Send OTP error:', error)
      toast.error(error?.response?.data?.message || 'Failed to send OTP')
    } finally {
      setIsSendingOtp(false)
      setSendingOtpType(null)
      console.debug('[Signup] handleSendOtp end', { sendingOtpType })
    }
  }

  const handleSignupSubmit = async (values: SignupFormValues, setSubmitting: (isSubmitting: boolean) => void) => {
    const otpValue = values.otp.join('')

    const payload: {
      phoneNumber: string
      otp: string
      email?: string
      firstName: string
      lastName: string
      password?: string
      googleId?: string
      referralCode?: string
    } = {
      phoneNumber: values.phone,
      otp: otpValue,
      firstName: values.firstName,
      lastName: values.lastName,
    }

    // Include email and password only if not using Google OAuth
    if (!googleIdFromUrl) {
      payload.email = values.email
      payload.password = values.password
    } else {
      // For Google OAuth, include googleId and email from URL
      payload.googleId = googleIdFromUrl
      payload.email = emailFromUrl || values.email
    }

    // Include referralCode if present (from URL or Google OAuth flow)
    if (referralCodeFromUrl) {
      payload.referralCode = referralCodeFromUrl
    }

    try {
      const response = (await postMethod<{
        id?: string
        email?: string
        firstName?: string
        lastName?: string
        phoneNumber?: string
        message?: string
      }>(appEndpoints.signUp, payload)) as ResponseDTO

      if (response.status === '201' || response.status === '200') {
        const successMessage = response.message || 'Registration successful'
        toast.success(successMessage)
        // Redirect to login page after successful registration
        router.push('/')
        reset()
      } else {
        toast.error(response.message || 'Registration failed')
      }
    } catch (error: any) {
      console.error('Signup Error:', error)
      toast.error(error?.response?.data?.message || 'Registration failed')
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
            <Image src={`/footer_logo_new_${locale}.png`} alt="Vaazhga Valamudan Logo" width={400} height={300} className="mt-6" />
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
            <button
              type="button"
              onClick={() => openLoginModal({ next: nextUrl && nextUrl.startsWith('/') ? nextUrl : '/' })}
              className="flex items-center text-sm font-semibold text-green-900 mb-2 hover:underline"
            >
              <ArrowLeft size={20} className="mr-2" /> {t('Auth.back')}
            </button>
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
            validationSchema={SignupSchema(t, googleIdFromUrl)}
            onSubmit={(values, { setSubmitting }) => {
              handleSignupSubmit(values, setSubmitting)
            }}
          >
            {({ values, setFieldValue, errors, touched, isSubmitting }) =>
              (() => {
                const isPhoneValid = Boolean(values.phone?.trim())
                const isSending = Boolean(sendingOtpType)

                return (
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
                        label={t('form.phone_number.label')}
                        type="tel"
                        name="phone"
                        placeholder={t('form.phone_number.placeholder')}
                        className="w-full border border-yellow-200 text-xs rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-400"
                      />

                      {/* Email field - hide if Google OAuth, otherwise show */}
                      {!googleIdFromUrl && (
                        <FormikTextField
                          label={t('form.email.label')}
                          type="email"
                          name="email"
                          placeholder={t('form.email.placeholder')}
                          className="w-full border border-yellow-200 text-xs rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-400"
                        />
                      )}

                      {/* Show read-only email if Google OAuth */}
                      {googleIdFromUrl && emailFromUrl && (
                        <div className="mb-4">
                          <label className="block text-sm font-medium mb-1 text-gray-700">{t('form.email.label')}</label>
                          <div className="relative">
                            <input
                              type="email"
                              value={emailFromUrl}
                              readOnly
                              className="w-full border border-yellow-200 text-xs rounded-md px-4 py-2 pl-10 bg-gray-50 text-gray-600 cursor-not-allowed"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path
                                  fill="#4285F4"
                                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                  fill="#34A853"
                                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                  fill="#FBBC05"
                                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                  fill="#EA4335"
                                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                              </svg>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 flex items-center">
                            <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                              <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                            Verified by Google
                          </p>
                        </div>
                      )}

                      {/* Password fields - hide if Google OAuth */}
                      {!googleIdFromUrl && (
                        <>
                          <FormikPasswordField
                            label="Password"
                            name="password"
                            placeholder="Enter your password"
                            className="w-full border border-yellow-200 text-xs rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-400"
                          />

                          <FormikPasswordField
                            label="Confirm Password"
                            name="confirmPassword"
                            placeholder="Confirm your password"
                            className="w-full border border-yellow-200 text-xs rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-400"
                          />
                        </>
                      )}
                    </motion.div>

                    {/* Send OTP Button */}
                    <motion.div
                      className="flex flex-col sm:flex-row justify-between gap-4"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.55 }}
                    >
                      {/* WhatsApp OTP */}
                      <Button
                        type="button"
                        onClick={() => handleSendOtp(values.phone, 'whatsapp_otp')}
                        disabled={isSending || !isPhoneValid}
                        className="
      flex-1 flex items-center justify-center gap-2
      rounded-md border border-yellow-300
      bg-gradient-to-r from-yellow-50 to-yellow-100/60
      px-3 py-2 text-sm font-medium text-[#2a1407]
      transition-all duration-200
      hover:bg-yellow-100 hover:shadow-sm
      active:scale-[0.98]
      disabled:cursor-not-allowed disabled:opacity-60
    "
                      >
                        <Phone size={18} />
                        <span>{sendingOtpType === 'whatsapp_otp' ? 'Sending OTP...' : t('Auth.whatapp_button')}</span>
                      </Button>

                      {/* Divider */}
                      <div className="hidden sm:flex items-center w-12">
                        <div className="w-full border-t border-gray-300" />
                        <span className="px-2 text-xs text-gray-500">OR</span>
                        <div className="w-full border-t border-gray-300" />
                      </div>

                      {/* SMS OTP */}
                      <Button
                        type="button"
                        onClick={() => handleSendOtp(values.phone, 'sms_otp')}
                        disabled={isSending || !isPhoneValid}
                        className="
      flex-1 flex items-center justify-center gap-2
      rounded-md border border-yellow-300
      bg-gradient-to-r from-yellow-50 to-yellow-100/60
      px-3 py-2 text-sm font-medium text-[#2a1407]
      transition-all duration-200
      hover:bg-yellow-100 hover:shadow-sm
      active:scale-[0.98]
      disabled:cursor-not-allowed disabled:opacity-60
    "
                      >
                        <MessageCircle size={18} />
                        <span>{sendingOtpType === 'sms_otp' ? 'Sending OTP...' : t('Auth.continue_with_sms')}</span>
                      </Button>
                    </motion.div>

                    {/* OTP */}
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                      <OTPInput
                        length={6}
                        value={values.otp}
                        onChange={next => setFieldValue('otp', next)}
                        initialTime={120}
                        reSendData={{
                          phoneNumber: values.phone,
                          otpTypes: ['sms_otp', 'whatsapp_otp'],
                          useRegistrationEndpoint: true,
                        }}
                        error={touched.otp && errors.otp ? errors.otp : undefined}
                      />
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#2a1407] text-white text-sm py-2 rounded-md flex items-center justify-center space-x-2 hover:from-[#2a1407] hover:to-[#2a1407] disabled:opacity-60 cursor-pointer"
                      >
                        <span>{isSubmitting ? 'Submitting...' : t('Auth.submit')}</span>
                      </Button>
                    </motion.div>

                    {/* Divider and Google Login Button - Hide if Google OAuth is already in progress */}
                    {!googleIdFromUrl && !emailFromUrl && (
                      <>
                        {/* Divider */}
                        <motion.div
                          className="flex items-center justify-center space-x-2"
                          variants={{
                            hidden: { y: 20, opacity: 0 },
                            visible: { y: 0, opacity: 1 },
                          }}
                        >
                          <div className="flex-1 border-t border-gray-300"></div>
                          <span className="text-gray-500 text-sm">OR</span>
                          <div className="flex-1 border-t border-gray-300"></div>
                        </motion.div>

                        {/* Google Login Button */}
                        <motion.div
                          variants={{
                            hidden: { y: 20, opacity: 0 },
                            visible: { y: 0, opacity: 1 },
                          }}
                        >
                          <motion.div whileTap={{ scale: 0.97 }}>
                            <Button
                              type="button"
                              disabled={isSubmitting || isGoogleLoading}
                              onClick={handleGoogleLogin}
                              className="w-full border border-gray-300 text-sm py-2 rounded-md flex items-center justify-center space-x-2 hover:bg-gray-50 bg-white text-gray-700 disabled:opacity-60"
                            >
                              <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                  fill="#4285F4"
                                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                  fill="#34A853"
                                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                  fill="#FBBC05"
                                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                  fill="#EA4335"
                                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                              </svg>
                              <span>{isGoogleLoading ? 'Redirecting...' : 'Continue with Google'}</span>
                            </Button>
                          </motion.div>
                        </motion.div>
                      </>
                    )}

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

                    {/* Already have an account? Sign in */}
                    <motion.div className="text-center mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                      <p className="text-gray-600 text-sm">
                        Already have an account?{' '}
                        <button
                          type="button"
                          onClick={() => openLoginModal({ next: nextUrl && nextUrl.startsWith('/') ? nextUrl : '/' })}
                          className="font-semibold text-green-900 hover:text-green-700 hover:underline"
                        >
                          Sign in
                        </button>
                      </p>
                    </motion.div>
                  </Form>
                )
              })()
            }
          </Formik>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
