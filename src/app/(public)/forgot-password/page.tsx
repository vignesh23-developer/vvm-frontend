'use client'

import FormikTextField from '@/components/Formik/FormikTextField/FormikTextField'
import CustomImage from '@/components/CustomImage/CustomImage'
import { Formik, Form } from 'formik'
import { MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { AuthSchema } from '@/utils/validations/auth/AuthValidationSchema'
// import { FaWhatsapp } from "react-icons/fa";

interface AuthFormValues {
  phone: string
}

const ForgotPassword = () => {
  const initialValues: AuthFormValues = {
    phone: '',
  }

  const handleForgotPasswordSubmit = (
    values: any,
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
      <div className="hidden md:flex w-1/2 bg-[#2c1207] flex-col items-center justify-center text-center p-6">
        <div className="max-w-xs">
          <CustomImage
            src="/footer_logo.png"
            alt="Vaazhga Valamudan Logo"
            width={300}
            height={300}
            className="mx-auto"
          />
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Link
            href="/login"
            className="flex items-center text-sm font-semibold text-green-900 mb-6 hover:underline"
          >
            {/* <FaArrowLeft className="mr-2" /> Back */}
          </Link>

          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-800 leading-snug">
            Forgot Your <br /> Password?
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            We’ll Help You Find Your Way Back
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
              <Form className="mt-6 space-y-4">
                {/* Phone Number */}
                <div>
                  <FormikTextField
                    label="Phone Number"
                    type="tel"
                    name="phone"
                    placeholder="Enter your Phone Number"
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-900"
                  />
                  <p className="flex items-center text-gray-500 text-xs mt-2">
                    Check WhatsApp – we’ll send your OTP there
                  </p>
                </div>

                {/* Reset Password Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#2B1B12] text-white py-2 rounded-md font-medium hover:bg-[#3d2616] disabled:opacity-60"
                >
                  {isSubmitting ? 'Sending OTP...' : 'Reset Password'}
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
                  className="w-full border border-gray-400 rounded-md py-2 flex items-center justify-center space-x-2 hover:bg-gray-50"
                >
                  <span>
                    <MessageCircle />
                  </span>
                  <span>Continue with SMS</span>
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
