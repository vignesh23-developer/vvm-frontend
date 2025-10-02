'use client'

import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'
import { Formik, Form } from 'formik'
import { ArrowLeft, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { AuthSchema } from '@/utils/validations/auth/AuthValidationSchema'
import { useTranslations } from 'next-intl'

interface AuthFormValues {
  phone: string
}

const ForgotPassword = () => {
  const t = useTranslations('Auth')
  const initialValues: AuthFormValues = {
    phone: '',
  }

  const handleForgotPasswordSubmit = (
    values: any,
    setSubmitting: (isSubmitting: boolean) => void,
  ) => {
    console.log('Form Submitted ✅', values)
    setTimeout(() => {
      setSubmitting(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Logo Section */}
      <div className="hidden md:flex w-full md:w-1/2 bg-[#2c1207] flex-col items-center justify-center p-6">
        <Link href="/home">
          <div className="max-w-xs hover:cursor-pointer">
            <Image
              src="/footer_logo.png"
              alt="Vaazhga Valamudan Logo"
              width={400}
              height={300}
              className="mt-6 hover:scale-105 transition"
              priority
            />
          </div>
        </Link>
      </div>

      {/* Right Side - Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 sm:px-10 md:px-16 lg:px-20 py-12">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Link
            href="/login"
            className="flex items-center text-sm font-semibold text-green-900 mb-4 hover:underline"
          >
            <ArrowLeft size={20} className="mr-2" /> {t('back')}
          </Link>

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-snug">
            {t('forgot_password')}
          </h2>
          <p className="text-gray-500 mt-2 text-xs sm:text-sm">
            {t('forgot_description')}
          </p>

          {/* Formik Form */}
          <Formik
            initialValues={initialValues}
            validationSchema={AuthSchema}
            onSubmit={(values, { setSubmitting }) => {
              handleForgotPasswordSubmit(values, setSubmitting)
            }}
          >
            {({ isSubmitting }) => (
              <Form className="mt-6 space-y-5">
                {/* Phone Number */}
                <div>
                  <FormikTextField
                    label="Phone Number"
                    type="tel"
                    name="phone"
                    placeholder="Enter your Phone Number"
                    className="w-full border border-gray-300 text-xs sm:text-sm rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-900"
                  />
                  <p className="flex items-center text-gray-500 text-xs mt-2">
                    {t('forgot_message')}
                  </p>
                </div>

                {/* Reset Password Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#2B1B12] text-white text-sm sm:text-base py-2 rounded-md font-medium hover:bg-[#3d2616] disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? 'Sending OTP...' : t('reset_password')}
                </button>

                {/* Divider */}
                <div className="flex items-center justify-center space-x-2">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <span className="text-gray-500 text-sm">OR</span>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>

                {/* Continue with SMS */}
                <button
                  type="button"
                  className="w-full border border-gray-400 text-sm sm:text-base rounded-md py-2 flex items-center justify-center space-x-2 hover:bg-gray-50 cursor-pointer"
                >
                  <MessageCircle size={20} />
                  <span>{t('continue_with_sms')}</span>
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
