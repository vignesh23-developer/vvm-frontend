'use client'

import FormikTextField from '@/components/Formik/FormikTextField/FormikTextField'
import CustomImage from '@/components/CustomImage/CustomImage'
import { Formik, Form } from 'formik'
import { MessageCircle } from 'lucide-react'
import { SignupSchema } from '@/utils/validations/auth/AuthValidationSchema'

interface SignupFormValues {
  fullName: string
  phone: string
  referral: string
}

export default function SignupPage() {
  const initialValues: SignupFormValues = {
    fullName: '',
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
            Sign Up <br />
            <span className="text-green-900">to Get Started</span>
          </h2>
          <p className="text-gray-500 mt-1 text-sm">
            Start Your Property Journey With Us
          </p>

          <Formik
            initialValues={initialValues}
            validationSchema={SignupSchema}
            onSubmit={(values, { setSubmitting }) => {
              handleSignupSubmit(values, setSubmitting)
            }}
          >
            {({ isSubmitting }) => (
              <Form className="mt-6 space-y-4">
                {/* Full Name */}
                <div>
                  <FormikTextField
                    label="Full Name"
                    type="text"
                    name="fullName"
                    placeholder="Eg : John Doe"
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-900"
                  />
                </div>

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

                {/* Referral ID */}
                <div>
                  <FormikTextField
                    label="Referral Id"
                    type="text"
                    name="referral"
                    placeholder="Enter your Referral Id"
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-900"
                  />
                </div>

                {/* WhatsApp Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#2B1B12] text-white py-2 rounded-md flex items-center justify-center space-x-2 hover:bg-[#3d2616] disabled:opacity-60"
                >
                  <span>
                    {isSubmitting ? 'Submitting...' : 'Verify Via WhatsApp'}
                  </span>
                </button>

                {/* Login Link */}
                <p className="text-center text-gray-600 text-sm">
                  Already have an account?{' '}
                  <a href="/login" className="font-semibold text-green-900">
                    Log in
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
