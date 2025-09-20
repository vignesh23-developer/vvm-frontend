'use client'

import { useState } from 'react'
import { Formik, Form } from 'formik'
import FormikTextField from '@/components/Formik/FormikTextField/FormikTextField'
import CustomImage from '@/components/CustomImage/CustomImage'
import { ProfileCreationSchema } from '@/utils/validations/auth/AuthValidationSchema'
// import { FaWhatsapp } from "react-icons/fa";

interface ProfileCreationFormValues {
  firstName: string
  lastName: string
  phone: string
  email: string
  address1: string
  address2: string
  landMark: string
  postalCode: string
}

function ProfileCreation() {
  const initialValues: ProfileCreationFormValues = {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address1: '',
    address2: '',
    landMark: '',
    postalCode: '',
  }

  const [checking, setChecking] = useState(false)

  const handleChange = () => {
    setChecking(true)
  }

  console.log(checking)

  const handleProfileCreationSubmit = (
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
            width={300}
            height={300}
            alt="Vaazhga Valamudan Logo"
            className="mx-auto"
          />
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-800 leading-snug">
            Introduce Yourself to <br /> the Platform
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            The right first impression starts with your profile.
          </p>
          {/* Formik Form */}
          <Formik
            initialValues={initialValues}
            validationSchema={ProfileCreationSchema}
            onSubmit={(values, { setSubmitting }) => {
              handleProfileCreationSubmit(values, setSubmitting)
            }}
          >
            {({ isSubmitting }) => (
              <Form className="mt-6 space-y-4">
                {!checking && (
                  <>
                    <div>
                      <FormikTextField
                        label="First Name"
                        type="text"
                        name="firstName"
                        placeholder="Enter your First Name"
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-900"
                      />
                    </div>
                    <div>
                      <FormikTextField
                        label="Last Name"
                        type="text"
                        name="lastName"
                        placeholder="Enter your Last Name"
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-900"
                      />
                    </div>
                    <div>
                      <FormikTextField
                        label="Phone Number"
                        type="tel"
                        name="phone"
                        placeholder="Enter your Phone Number"
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-900"
                      />
                    </div>
                    <div>
                      <FormikTextField
                        label="Email"
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-900"
                      />
                    </div>

                    {/* Reset Password Button */}
                    <button
                      type="button"
                      onClick={handleChange}
                      className="w-full bg-[#2B1B12] text-white py-3 rounded-md font-medium hover:bg-[#3d2616]"
                    >
                      Next
                    </button>
                  </>
                )}
                {checking && (
                  <>
                    <div>
                      <FormikTextField
                        label="Address 1"
                        type="text"
                        name="address1"
                        placeholder="Enter your Address 1"
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-900"
                      />
                    </div>

                    <div>
                      <FormikTextField
                        label="Address 2"
                        type="text"
                        name="address2"
                        placeholder="Enter your Address 2"
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-900"
                      />
                    </div>
                    <div>
                      <FormikTextField
                        label="Land Mark"
                        type="text"
                        name="landMark"
                        placeholder="Enter your Land Mark"
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-900"
                      />
                    </div>
                    <div>
                      <FormikTextField
                        label="Postal Code"
                        type="text"
                        name="postalCode"
                        placeholder="Enter your Postal Code"
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-900"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#2B1B12] text-white py-2 rounded-md flex items-center justify-center space-x-2 hover:bg-[#3d2616]"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>

                    <div className="flex items-center justify-center space-x-2">
                      <div className="flex-1 border-t border-gray-300"></div>
                      <span className="text-gray-500 text-sm">OR</span>
                      <div className="flex-1 border-t border-gray-300"></div>
                    </div>

                    <button
                      type="button"
                      className="w-full border border-gray-400 rounded-md py-2 flex items-center justify-center space-x-2 hover:bg-gray-50"
                    >
                      <span>Skip</span>
                    </button>
                  </>
                )}
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default ProfileCreation
