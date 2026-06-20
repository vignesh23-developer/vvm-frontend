'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Formik, Form, type FormikHelpers } from 'formik'
import { ArrowLeft, MessageCircle } from 'lucide-react'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'
import FormikPasswordField from '@/components/ui/Formik/FormikPasswordField/FormikPasswordField'
import OTPInput from '@/components/ui/OTPInput/OTPInput'
import Button from '@/components/ui/CustomComponent/Button/Button'
import {
  ForgotPasswordResetSchema,
  ForgotPasswordSchema,
} from '@/utils/validations/auth/AuthValidationSchema'
import { appEndpoints } from '@/services/endpoints'
import { patchMethod, postMethod } from '@/services/service'
import { ResponseDTO } from '@/components/dto/response_dto'
import { useTranslations } from 'next-intl'
import toast from 'react-hot-toast'

type ForgotPasswordStep = 'phone' | 'reset'

interface ForgotPasswordPhoneValues {
  phone: string
}

interface ForgotPasswordResetValues {
  otp: string[]
  newPassword: string
  confirmPassword: string
}

export interface ForgotPasswordFormPanelProps {
  /** When false, title/description are omitted (modal supplies title) */
  showHeader?: boolean
  /** Step 1: return to login. Step 2: return to phone entry. */
  onBackToLogin?: () => void
  /** Called after password reset succeeds */
  onResetSuccess?: () => void
  /** When false, resets to phone step (e.g. modal closed) */
  isActive?: boolean
}

export default function ForgotPasswordFormPanel({
  showHeader = true,
  onBackToLogin,
  onResetSuccess,
  isActive = true,
}: ForgotPasswordFormPanelProps) {
  const t = useTranslations()
  const [step, setStep] = useState<ForgotPasswordStep>('phone')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isSendingOtp, setIsSendingOtp] = useState(false)

  useEffect(() => {
    if (!isActive) {
      setStep('phone')
      setPhoneNumber('')
      setIsSendingOtp(false)
    }
  }, [isActive])

  const phoneInitialValues: ForgotPasswordPhoneValues = { phone: phoneNumber || '' }
  const resetInitialValues: ForgotPasswordResetValues = {
    otp: ['', '', '', '', '', ''],
    newPassword: '',
    confirmPassword: '',
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 },
  }

  const sendResetOtp = useCallback(async (phone: string): Promise<boolean> => {
    const trimmed = phone.trim()
    if (!trimmed) {
      toast.error(t('form.phone_number.error.required'))
      return false
    }

    setIsSendingOtp(true)
    try {
      const response = (await postMethod<{ message?: string }>(appEndpoints.forgetPassword, {
        phoneNumber: trimmed,
      })) as ResponseDTO<{ message?: string }>

      if (response.status === '200' && !response.error) {
        toast.success(response.data?.message || response.message || 'OTP sent successfully')
        setPhoneNumber(trimmed)
        setStep('reset')
        return true
      }

      toast.error(response.message || 'Failed to send OTP')
      return false
    } catch (error) {
      console.error('Forgot password OTP error:', error)
      toast.error('Failed to send OTP. Please try again.')
      return false
    } finally {
      setIsSendingOtp(false)
    }
  }, [t])

  const handleBack = () => {
    if (step === 'reset') {
      setStep('phone')
      return
    }
    onBackToLogin?.()
  }

  const handleResetSubmit = async (
    values: ForgotPasswordResetValues,
    { setSubmitting }: FormikHelpers<ForgotPasswordResetValues>,
  ) => {
    const otpValue = values.otp.join('')
    if (otpValue.length !== 6) {
      toast.error('Please enter the 6-digit OTP')
      setSubmitting(false)
      return
    }

    if (!phoneNumber) {
      toast.error('Missing phone number. Please go back and try again.')
      setSubmitting(false)
      return
    }

    try {
      const response = (await patchMethod<{ message?: string }>(appEndpoints.resetPassword, {
        phoneNumber,
        otp: otpValue,
        newPassword: values.newPassword,
      })) as ResponseDTO<{ message?: string }>

      if (response.status === '200' && !response.error) {
        toast.success(response.data?.message || response.message || 'Password reset successfully')
        setStep('phone')
        setPhoneNumber('')
        onResetSuccess?.()
        return
      }

      toast.error(response.message || 'Failed to reset password')
    } catch (error) {
      console.error('Reset password error:', error)
      toast.error('Failed to reset password. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const stepTitle =
    step === 'phone' ? t('Auth.forgot_password') : t('Auth.reset_password')
  const stepDescription =
    step === 'phone' ? t('Auth.forgot_description') : t('Auth.otp_description')

  return (
    <>
      {onBackToLogin && (
        <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.05 }}>
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center text-sm font-semibold text-green-900 mb-4 hover:underline w-full text-left"
          >
            <ArrowLeft size={20} className="mr-2" /> {t('Auth.back')}
          </button>
        </motion.div>
      )}

      {showHeader && (
        <>
          <motion.h2
            className="text-2xl sm:text-3xl font-bold text-gray-800 leading-snug"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {stepTitle}
          </motion.h2>
          <motion.p
            className="text-gray-500 mt-2 text-xs sm:text-sm"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            {stepDescription}
          </motion.p>
        </>
      )}

      {!showHeader && (
        <motion.p
          className="text-gray-500 mb-4 text-xs sm:text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {stepDescription}
        </motion.p>
      )}

      {step === 'phone' && (
        <Formik
          key={`phone-${phoneNumber}`}
          initialValues={phoneInitialValues}
          enableReinitialize
          validationSchema={ForgotPasswordSchema(t)}
          onSubmit={async (values, { setSubmitting }) => {
            await sendResetOtp(values.phone)
            setSubmitting(false)
          }}
        >
          {({ isSubmitting, values }) => (
            <Form className={`space-y-4 ${showHeader ? 'mt-4' : ''}`}>
              <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
                <FormikTextField
                  label={t('form.phone_number.label')}
                  type="tel"
                  name="phone"
                  placeholder={t('form.phone_number.placeholder')}
                  className="w-full min-w-0 border border-gray-300 text-xs rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-900"
                />
              </motion.div>

              <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.24 }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={isSubmitting || isSendingOtp}
                  className="w-full min-h-[44px] bg-[#2B1B12] text-white text-sm sm:text-base py-2 rounded-md font-medium hover:bg-[#3d2616] disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting || isSendingOtp ? 'Sending OTP...' : t('Auth.reset_password')}
                </motion.button>
              </motion.div>

              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.28 }}
                className="flex items-center justify-center space-x-2"
              >
                <motion.div className="flex-1 border-t border-gray-300 min-w-0" />
                <span className="text-gray-500 text-sm shrink-0">OR</span>
                <motion.div className="flex-1 border-t border-gray-300 min-w-0" />
              </motion.div>

              <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.32 }}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  disabled={isSendingOtp || isSubmitting}
                  onClick={() => sendResetOtp(values.phone)}
                  className="w-full min-h-[44px] border border-gray-400 text-sm sm:text-base rounded-md py-2 flex items-center justify-center space-x-2 hover:bg-gray-50 cursor-pointer disabled:opacity-60"
                >
                  <MessageCircle size={20} className="shrink-0" />
                  <span>{isSendingOtp ? 'Sending OTP...' : t('Auth.continue_with_sms')}</span>
                </motion.button>
              </motion.div>
            </Form>
          )}
        </Formik>
      )}

      {step === 'reset' && phoneNumber && (
        <Formik
          initialValues={resetInitialValues}
          validationSchema={ForgotPasswordResetSchema(t)}
          onSubmit={handleResetSubmit}
        >
          {({ values, setFieldValue, errors, touched, isSubmitting }) => (
            <Form className={`space-y-4 ${showHeader ? 'mt-4' : ''}`}>
              <motion.p
                className="text-xs text-gray-600"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.18 }}
              >
                {t('form.phone_number.label')}: <span className="font-medium">{phoneNumber}</span>
              </motion.p>

              <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
                <OTPInput
                  length={6}
                  value={values.otp}
                  onChange={next => setFieldValue('otp', next)}
                  initialTime={120}
                  reSendData={{
                    phoneNumber,
                    useForgotPasswordEndpoint: true,
                  }}
                  error={touched.otp && errors.otp ? errors.otp : undefined}
                />
              </motion.div>

              <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.24 }}>
                <FormikPasswordField
                  label="New password"
                  name="newPassword"
                  placeholder="Enter new password"
                  className="w-full min-w-0 border border-gray-300 text-xs rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-green-900"
                />
              </motion.div>

              <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.28 }}>
                <FormikPasswordField
                  label="Confirm password"
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  className="w-full min-w-0 border border-gray-300 text-xs rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-green-900"
                />
              </motion.div>

              <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.32 }}>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full min-h-[44px] bg-[#2B1B12] text-white text-sm sm:text-base py-2 rounded-md font-medium hover:bg-[#3d2616] disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? 'Resetting...' : t('Auth.reset_password')}
                </Button>
              </motion.div>
            </Form>
          )}
        </Formik>
      )}
    </>
  )
}
