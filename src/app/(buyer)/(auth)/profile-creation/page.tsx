'use client'

import { useState } from 'react'
import { Formik, Form } from 'formik'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'
import Image from 'next/image'
import { ProfileCreationSchema } from '@/utils/validations/auth/AuthValidationSchema'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

interface ProfileCreationFormValues {
  email: string
  address: string
  landMark: string
  postalCode: string
}

function ProfileCreation() {
  const t = useTranslations()
  const initialValues: ProfileCreationFormValues = {
    email: '',
    address: '',
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
          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-800 leading-snug">
            {t('Auth.profile_creation')}
          </h2>
          <p className="text-gray-500 text-xs mt-2 text-xs">
            {t('Auth.profile_description')}
          </p>
          {/* Formik Form */}
          <Formik
            initialValues={initialValues}
            validationSchema={ProfileCreationSchema(t)}
            onSubmit={(values, { setSubmitting }) => {
              handleProfileCreationSubmit(values, setSubmitting)
            }}
          >
            {({ isSubmitting }) => (
              <Form className="mt-4 space-y-4">
                {/* Email */}
                <div>
                  <FormikTextField
                    label={t('form.email.label')}
                    type="email"
                    name="email"
                    placeholder={t('form.email.placeholder')}
                    className="w-full border border-gray-300 text-xs rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-900"
                  />
                </div>
                <div>
                  <FormikTextField
                    label={t('form.address.label')}
                    type="text"
                    name="address"
                    placeholder={t('form.address.placeholder')}
                    className="w-full border border-gray-300 text-xs rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-900"
                  />
                </div>
                <div>
                  <FormikTextField
                    label={t('form.land_mark.label')}
                    type="text"
                    name="landMark"
                    placeholder={t('form.land_mark.placeholder')}
                    className="w-full border border-gray-300 text-xs rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-900"
                  />
                </div>
                <div>
                  <FormikTextField
                    label={t('form.post_code.label')}
                    type="text"
                    name="postalCode"
                    placeholder={t('form.post_code.placeholder')}
                    className="w-full border border-gray-300 text-xs rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-900"
                  />
                </div>

                {/* Reset Password Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#2B1B12] text-white text-sm py-2 rounded-md flex items-center justify-center space-x-2 hover:bg-[#3d2616] cursor-pointer"
                >
                  {isSubmitting ? 'Submitting...' : t('Auth.submit')}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default ProfileCreation
