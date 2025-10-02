'use client'

import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'
import Image from 'next/image'
import { Formik, Form } from 'formik'
import { MessageCircle } from 'lucide-react'
import { SignupSchema } from '@/utils/validations/auth/AuthValidationSchema'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

interface SignupFormValues {
  firstName: string
  lastName: string
  phone: string
  referral: string
}

export default function SignupPage() {
  const t = useTranslations()
  const initialValues: SignupFormValues = {
    firstName: '',
    lastName: '',
    phone: '',
    referral: '',
  }
  const handleSignupSubmit = (
    value: SignupFormValues,
    setSubmitting: (isSubmitting: boolean) => void,
  ) => {
    console.log('form submitting', value)
    setTimeout(() => {
      setSubmitting(false)
    }, 1000)
  }
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Logo Section */}
      <div className="hidden md:flex w-1/2 bg-[#2c1207] flex-col items-center justify-center text-center p-6">
        <Link href="/home">
          <div className="max-w-xs hover:cursor-pointer">
            <Image
              src="/footer_logo.png"
              alt="Vaazhga Valamudan Logo"
              width={400}
              height={300}
              className="mt-6 hover:scale-105 transition"
            />
          </div>
        </Link>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full md:w-1/2 flex items-start justify-center p-20">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800">
            {t('Auth.signup')} <br />
            <span className="text-green-900">{t('Auth.to_get_started')}</span>
          </h2>
          <p className="text-gray-500 mt-2 text-xs">
            {t('Auth.signup_description')}
          </p>

          <Formik
            initialValues={initialValues}
            validationSchema={SignupSchema(t)}
            onSubmit={(values, { setSubmitting }) => {
              handleSignupSubmit(values, setSubmitting)
            }}
          >
            {({ isSubmitting }) => (
              <Form className="mt-4 space-y-4">
                {/* First Name */}
                <div>
                  <FormikTextField
                    label={t('form.first_name.label')}
                    type="text"
                    name="firstName"
                    placeholder={t('form.first_name.placeholder')}
                    className="w-full border border-gray-300 text-xs rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-900"
                  />
                </div>
                {/* Last Name */}
                <div>
                  <FormikTextField
                    label={t('form.last_name.label')}
                    type="text"
                    name="lastName"
                    placeholder={t('form.last_name.placeholder')}
                    className="w-full border border-gray-300 text-xs rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-900"
                  />
                </div>
                {/* Phone Number */}
                <div>
                  <FormikTextField
                    label={t('form.phone_number.label')}
                    type="tel"
                    name="phone"
                    placeholder={t('form.phone_number.placeholder')}
                    className="w-full border border-gray-300 text-xs rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-900"
                  />
                </div>
                {/* Referral ID */}
                <div>
                  <FormikTextField
                    label={t('form.referral_id.label')}
                    type="text"
                    name="referral"
                    placeholder={t('form.referral_id.placeholder')}
                    className="w-full border border-gray-300 text-xs rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-900"
                  />
                </div>
                {/* WhatsApp Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#2B1B12] text-white text-sm py-2 rounded-md flex items-center justify-center space-x-2 hover:bg-[#3d2616] disabled:opacity-60 cursor-pointer"
                >
                  <span>
                    {isSubmitting ? 'Submitting...' : t('Auth.whatapp_button')}
                  </span>
                </button>
                {/* Login Link */}
                <p className="text-center text-gray-600 text-xs">
                  {t('Auth.signup_message')}{' '}
                  <a href="/login" className="font-semibold text-green-900">
                    {t('Auth.login')}
                  </a>
                </p>
                {/* Divider */}
                <div className="flex items-center justify-center space-x-2">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <span className="text-gray-500 text-sm">OR</span>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>
                {/* Continue with SMS */}
                <button
                  type="button"
                  className="w-full border border-gray-400 text-sm rounded-md py-2 flex items-center justify-center space-x-2 hover:bg-gray-50 cursor-pointer"
                >
                  <span>
                    <MessageCircle size={20} />
                  </span>
                  <span>{t('Auth.continue_with_sms')}</span>
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}
