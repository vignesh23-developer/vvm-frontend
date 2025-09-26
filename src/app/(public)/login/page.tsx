'use client'

import FormikTextField from '@/components/Formik/FormikTextField/FormikTextField'
import { Formik, Form } from 'formik'
import { MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { AuthSchema } from '@/utils/validations/auth/AuthValidationSchema'
import Image from 'next/image'
import Button from '@/components/CustomComponent/Button/Button'
// import { FaWhatsapp } from "react-icons/fa";
import { useTranslations } from 'next-intl'

interface AuthFormValues {
  phone: string
}

const Login = () => {
  const t = useTranslations()
  const initialValues: AuthFormValues = {
    phone: '',
  }

  const handleLoginSubmit = (
    values: AuthFormValues,
    setSubmitting: (isSubmitting: boolean) => void,
  ) => {
    console.log('Form Submitted ✅', values)
    // 👉 Call API here (e.g. send OTP)
    setTimeout(() => {
      setSubmitting(false)
    }, 1000)
  }
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Logo Section */}
      {/* <LogoSection /> */}
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
            {t('Auth.hello')} <br />
            <span className="text-green-900">{t('Auth.welcome_back')}</span>
          </h2>
          <p className="text-gray-500 mt-2 text-xs">
            {t('Auth.login_description')}
          </p>

          <Formik
            initialValues={initialValues}
            validationSchema={AuthSchema(t)}
            onSubmit={(values, { setSubmitting }) => {
              handleLoginSubmit(values, setSubmitting)
            }}
          >
            {({ isSubmitting }) => (
              <Form className="mt-4 space-y-4">
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

                {/* Forgot Password Link */}
                <div className="flex justify-end">
                  <Link
                    href="/forgot-password"
                    className="font-semibold text-black-600 text-right hover:underline text-xs"
                  >
                    {t('Auth.forgot_password')}
                  </Link>
                </div>

                {/* WhatsApp Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={() => {
                    console.log('Login Clicked')
                  }}
                  className="w-full bg-[#2B1B12] text-white text-sm py-2 rounded-md flex items-center justify-center space-x-2 hover:bg-[#3d2616] cursor-pointer disabled:opacity-60"
                >
                  <span>
                    {isSubmitting ? 'Verifying...' : t('Auth.whatapp_button')}
                  </span>
                </Button>

                {/* Login Link */}
                <p className="text-center text-gray-600 text-xs">
                  {t('Auth.login_message')}{' '}
                  <a
                    href="/signup"
                    className="font-semibold text-green-900 hover:underline"
                  >
                    {t('Auth.signup')}
                  </a>
                </p>

                {/* Divider */}
                <div className="flex items-center justify-center space-x-2">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <span className="text-gray-500 text-sm">OR</span>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>

                {/* Continue with SMS */}
                <Button
                  type="button"
                  onClick={() => {
                    console.log('SMS Clicked')
                  }}
                  className="w-full border border-gray-400 text-sm rounded-md py-2 flex items-center justify-center space-x-2 hover:bg-gray-50 cursor-pointer"
                >
                  <span>
                    <MessageCircle size={20} />
                  </span>
                  <span>{t('Auth.continue_with_sms')}</span>
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default Login
