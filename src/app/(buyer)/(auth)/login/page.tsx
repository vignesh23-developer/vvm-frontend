'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'
import FormikPasswordField from '@/components/ui/Formik/FormikPasswordField/FormikPasswordField'
import { Formik, Form } from 'formik'
import Link from 'next/link'
import { AuthSchema } from '@/utils/validations/auth/AuthValidationSchema'
import { appEndpoints } from '@/services/endpoints'
import Image from 'next/image'
import Button from '@/components/ui/CustomComponent/Button/Button'
import { useLocale, useTranslations } from 'next-intl'
import LanguageSwitch from '@/components/ui/CustomComponent/languageSwitch/languageSwitch'
import { postMethod, getMethod } from '@/services/service'
import toast from 'react-hot-toast'
import { useRouter, useSearchParams } from 'next/navigation'
import { ResponseDTO } from '@/components/dto/response_dto'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'

interface AuthFormValues {
  emailOrPhone: string
  password: string
}

// Helper function to detect input type
const detectInputType = (value: string): 'email' | 'phoneNumber' => {
  return value.includes('@') ? 'email' : 'phoneNumber'
}

const Login = () => {
  const t = useTranslations()
  const locale = useLocale()
  const searchParams = useSearchParams()
  const isRedirect = searchParams.get('next')
  const referralCodeFromUrl = searchParams.get('referralCode')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { token, loading, setToken, setUser } = useAuth()

  // Redirect if already logged in
  useEffect(() => {
    if (loading) return

    // If user is already logged in, don't show login page.
    if (token) {
      router.replace(isRedirect || '/')
    }
  }, [isRedirect, loading, router, token])

  const initialValues: AuthFormValues = { emailOrPhone: '', password: '' }

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true)
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
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Google login error:', error)
      toast.error('Failed to initiate Google login')
      setIsLoading(false)
    }
  }

  const handleLoginSubmit = async (values: AuthFormValues, setSubmitting: (isSubmitting: boolean) => void) => {
    setIsLoading(true)
    setSubmitting(true)
    try {
      const inputType = detectInputType(values.emailOrPhone)
      const payload: {
        email?: string
        phoneNumber?: string
        password: string
      } = {
        password: values.password,
      }

      // Set email or phoneNumber based on input type
      if (inputType === 'email') {
        payload.email = values.emailOrPhone
      } else {
        payload.phoneNumber = values.emailOrPhone
      }

      const response = (await postMethod(appEndpoints.login, payload)) as ResponseDTO<{
        accessToken?: string
        refreshToken?: string
        expiresIn?: number
        user?: any
      }>

      if (response.status === '200' && !response.error) {
        const responseData = response.data
        const accessToken = responseData?.accessToken
        const userData = responseData?.user

        if (accessToken && userData) {
          setToken(accessToken)
          setUser(userData)
          toast.success('Login successful')
          router.push(isRedirect || '/')
        } else {
          toast.error(response.message || 'Login failed: Missing token or user data')
        }
      } else {
        toast.error(response.message || 'Invalid credentials')
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Failed to login. Please try again.')
    } finally {
      setIsLoading(false)
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
        <Link href="/">
          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }} className="max-w-xs cursor-pointer">
            <Image src={`/footer_logo_new_${locale}.png`} alt="Vaazhga Valamudan Logo" width={400} height={300} className="mt-6" />
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
              handleLoginSubmit(values, setSubmitting)
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
                    label="Email or Phone Number"
                    type="text"
                    name="emailOrPhone"
                    placeholder="Enter your email or phone number"
                    className="w-full border border-yellow-200 text-xs rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-400"
                  />
                </motion.div>

                <motion.div
                  variants={{
                    hidden: { y: 20, opacity: 0 },
                    visible: { y: 0, opacity: 1 },
                  }}
                >
                  <FormikPasswordField
                    label="Password"
                    name="password"
                    placeholder="Enter your password"
                    className="w-full border border-yellow-200 text-xs rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-400"
                  />
                </motion.div>

                {/* Login Button */}
                <motion.div
                  variants={{
                    hidden: { y: 20, opacity: 0 },
                    visible: { y: 0, opacity: 1 },
                  }}
                >
                  <motion.div whileTap={{ scale: 0.97 }}>
                    <Button
                      type="submit"
                      disabled={isSubmitting || isLoading}
                      className="w-full bg-[#2a1407] text-white text-sm py-2 rounded-md flex items-center justify-center space-x-2 hover:from-[#2a1407] hover:to-[#2a1407] disabled:opacity-60"
                    >
                      <span>{isSubmitting || isLoading ? 'Logging in...' : t('Auth.login') || 'Login'}</span>
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Forgot Password and Signup Links */}
                <motion.div
                  className="flex items-center justify-end text-xs"
                  variants={{
                    hidden: { y: 20, opacity: 0 },
                    visible: { y: 0, opacity: 1 },
                  }}
                >
                  {/* <Link
                    href="/forgot-password"
                    className="text-green-900 hover:text-green-700 hover:underline font-medium"
                  >
                    Forgot Password?
                  </Link> */}
                  <Link href="/signup" className="text-green-900 hover:text-green-700 hover:underline font-medium">
                    Sign Up
                  </Link>
                </motion.div>

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
                      disabled={isSubmitting || isLoading}
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
                      <span>{isLoading ? 'Redirecting...' : 'Continue with Google'}</span>
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
