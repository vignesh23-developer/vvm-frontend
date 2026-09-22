'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Formik, Form } from 'formik'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'
import FormikPasswordField from '@/components/ui/Formik/FormikPasswordField/FormikPasswordField'
import { AuthSchema } from '@/utils/validations/auth/AuthValidationSchema'
import { appEndpoints } from '@/services/endpoints'
import Button from '@/components/ui/CustomComponent/Button/Button'
import { useTranslations } from 'next-intl'
import { postMethod, getMethod } from '@/services/service'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { ResponseDTO } from '@/components/dto/response_dto'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'

export const OAUTH_RETURN_NEXT_KEY = 'oauthReturnNext'

interface AuthFormValues {
  emailOrPhone: string
  password: string
}

const detectInputType = (value: string): 'email' | 'phoneNumber' => {
  return value.includes('@') ? 'email' : 'phoneNumber'
}

export function resolveLoginNext(nextPath: string | null | undefined): string {
  if (nextPath && nextPath.trim().startsWith('/')) {
    return nextPath.trim()
  }
  return '/'
}

export interface LoginFormPanelProps {
  nextPath?: string | null
  referralCodeFromUrl?: string | null
  /** If set, called after successful credential login instead of navigating internally */
  onLoginSuccess?: (resolvedNext: string) => void
  /** Hide the hello / welcome heading (e.g. when the modal already has a title) */
  showHeader?: boolean
  /** Switch auth modal to signup mode */
  onSwitchToSignup?: () => void
  /** Opens forgot-password flow (e.g. close login modal and open forgot modal) */
  onForgotPasswordClick?: () => void
}

export default function LoginFormPanel({
  nextPath = null,
  referralCodeFromUrl = null,
  onLoginSuccess,
  showHeader = true,
  onSwitchToSignup,
  onForgotPasswordClick,
}: LoginFormPanelProps) {
  const t = useTranslations()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { setToken, setUser } = useAuth()
  const resolvedNext = () => resolveLoginNext(nextPath)

  const initialValues: AuthFormValues = { emailOrPhone: '', password: '' }

  const persistOAuthReturnNext = () => {
    if (typeof window === 'undefined') return
    try {
      sessionStorage.setItem(OAUTH_RETURN_NEXT_KEY, resolvedNext())
    } catch {
      /* ignore quota / private mode */
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true)
      persistOAuthReturnNext()
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

      if (referralCodeFromUrl) {
        params.referralCode = referralCodeFromUrl
      }

      const response = await getMethod<{ url: string }>(appEndpoints.googleLogin, params)

      if (response.status === '200' && !response.error && response.data?.url) {
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
    const next = resolvedNext()
    try {
      const inputType = detectInputType(values.emailOrPhone)
      const payload: {
        email?: string
        phoneNumber?: string
        password: string
      } = {
        password: values.password,
      }

      if (inputType === 'email') {
        payload.email = values.emailOrPhone
      } else {
        payload.phoneNumber = values.emailOrPhone
      }

      console.log('LOGIN API URL:', appEndpoints.login)
      console.log('LOGIN PAYLOAD:', payload)

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
          if (onLoginSuccess) {
            onLoginSuccess(next)
          } else {
            router.push(next)
          }
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

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  }

  return (
    <>
      {showHeader && (
        <>
          <motion.h2
            className="text-2xl font-bold text-[#2a1407]"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.05 }}
          >
            {t('Auth.hello')} <br />
            <span className="text-yellow-700">{t('Auth.welcome_back')}</span>
          </motion.h2>

          <motion.p
            className="text-gray-500 mt-2 text-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {t('Auth.login_description')}
          </motion.p>
        </>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={AuthSchema(t)}
        onSubmit={(values, { setSubmitting }) => {
          handleLoginSubmit(values, setSubmitting)
        }}
      >
        {({ isSubmitting }) => (
          <Form className={`space-y-4 ${showHeader ? 'mt-4' : ''}`}>
            <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.12 }}>
              <FormikTextField
                label="Email or Phone Number"
                type="text"
                name="emailOrPhone"
                placeholder="Enter your email or phone number"
                className="w-full min-w-0 border border-yellow-200 text-xs rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-400"
              />
            </motion.div>

            <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.16 }}>
              <FormikPasswordField
                label="Password"
                name="password"
                placeholder="Enter your password"
                className="w-full min-w-0 border border-yellow-200 text-xs rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-400"
              />
            </motion.div>

            <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
              <motion.div whileTap={{ scale: 0.97 }}>
                <Button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="w-full min-h-[44px] bg-[#2a1407] text-white text-sm py-2 rounded-md flex items-center justify-center space-x-2 hover:from-[#2a1407] hover:to-[#2a1407] disabled:opacity-60"
                >
                  <span>{isSubmitting || isLoading ? 'Logging in...' : t('Auth.login') || 'Login'}</span>
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              className="flex items-center justify-between text-xs"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.24 }}
            >
              <button
                type="button"
                onClick={() => onForgotPasswordClick?.()}
                className="text-green-900 hover:text-green-700 hover:underline font-medium"
              >
                {t('Auth.forgot_password')}
              </button>
              <button
                type="button"
                onClick={() => onSwitchToSignup?.()}
                className="text-green-900 hover:text-green-700 hover:underline font-medium"
              >
                Sign Up
              </button>
            </motion.div>

            <motion.div
              className="flex items-center justify-center space-x-2"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.28 }}
            >
              <div className="flex-1 border-t border-gray-300 min-w-0" />
              <span className="text-gray-500 text-sm shrink-0">OR</span>
              <div className="flex-1 border-t border-gray-300 min-w-0" />
            </motion.div>

            <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.32 }}>
              <motion.div whileTap={{ scale: 0.97 }}>
                <Button
                  type="button"
                  disabled={isSubmitting || isLoading}
                  onClick={handleGoogleLogin}
                  className="w-full min-h-[44px] border border-gray-300 text-sm py-2 rounded-md flex items-center justify-center space-x-2 hover:bg-gray-50 bg-white text-gray-700 disabled:opacity-60"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden>
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
    </>
  )
}
