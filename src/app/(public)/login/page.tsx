'use client'

import FormikTextField from '@/components/Formik/FormikTextField/FormikTextField'
import { Formik, Form } from 'formik'
import { MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { AuthSchema } from '@/utils/validations/auth/AuthValidationSchema'
import CustomImage from '@/components/CustomImage/CustomImage'
// import { FaWhatsapp } from "react-icons/fa";

interface AuthFormValues {
  phone: string
}

const Login = () => {
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
          <h2 className="text-2xl font-bold text-gray-800">
            Hello <br />
            <span className="text-green-900">Welcome Back</span>
          </h2>
          <p className="text-gray-500 mt-1 text-sm">
            Login to Unlock Smarter Moves
          </p>

          <Formik
            initialValues={initialValues}
            validationSchema={AuthSchema}
            onSubmit={(values, { setSubmitting }) => {
              handleLoginSubmit(values, setSubmitting)
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
                </div>

                {/* Forgot Password Link */}
                <div className="flex justify-end mb-2">
                  <Link
                    href="/forget-password"
                    className="font-semibold text-black-600 text-right hover:underline text-sm"
                  >
                    Forgot your password?
                  </Link>
                </div>

                {/* WhatsApp Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#2B1B12] text-white py-2 rounded-md flex items-center justify-center space-x-2 hover:bg-[#3d2616] disabled:opacity-60"
                >
                  <span>
                    {isSubmitting ? 'Verifying...' : "Verify Via What's app"}
                  </span>
                </button>

                {/* Login Link */}
                <p className="text-center text-gray-600 text-sm">
                  Don’t have an account?{' '}
                  <a href="/signup" className="font-semibold text-green-900">
                    Sign Up
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

export default Login
