'use client'

import { Formik, Form, Field } from 'formik'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'
import LanguageSwitch from '@/components/ui/CustomComponent/languageSwitch/languageSwitch'
import * as Yup from 'yup'

export default function OtpVerification() {
  const t = useTranslations()

  // ✅ Validation Schema
  const OtpSchema = Yup.object().shape({
    otp: Yup.array()
      .of(
        Yup.string()
          .matches(/^[0-9]$/, 'Must be a number')
          .required('Required'),
      )
      .min(6, 'Enter all 6 digits')
      .max(6, 'Invalid OTP'),
  })

  // ✅ Initial Values
  const initialValues = {
    otp: ['', '', '', '', '', ''],
  }

  // ✅ Handle Submit
  const handleSubmit = (values: typeof initialValues) => {
    const otpValue = values.otp.join('')
    console.log('OTP submitted:', otpValue)
  }

  // ✅ Handle Change and Auto Focus
  const handleOtpChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    values: string[],
    setFieldValue: (field: string, value: any) => void,
  ) => {
    const value = e.target.value
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...values]
      newOtp[index] = value
      setFieldValue('otp', newOtp)

      // Auto move to next
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`)
        nextInput?.focus()
      }
    }
  }

  return (
    <div className="min-h-screen flex relative">
      <div className="absolute top-4 right-4">
        <LanguageSwitch />
      </div>

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

      {/* Right Side - OTP Form */}
      <div className="w-full md:w-1/2 flex items-start justify-center p-20">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Link
            href="/forgot-password"
            className="flex items-center text-sm font-semibold text-green-900 mb-2 hover:underline"
          >
            <ArrowLeft size={20} className="mr-2" /> {t('Auth.back')}
          </Link>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-800 leading-snug">
            {t('Auth.otp_verification')}
          </h2>
          <p className="text-gray-500 mt-2 text-xs">
            {t('Auth.otp_description')}
          </p>

          {/* ✅ Formik Form */}
          <Formik
            initialValues={initialValues}
            validationSchema={OtpSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, errors, touched }) => (
              <Form className="mt-6 space-y-4">
                {/* OTP Input Fields */}
                <div className="flex justify-between mb-4">
                  {values.otp.map((digit, index) => (
                    <Field key={index} name={`otp[${index}]`}>
                      {() => (
                        <input
                          id={`otp-${index}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={e =>
                            handleOtpChange(e, index, values.otp, setFieldValue)
                          }
                          className="w-14 h-14 text-center text-xl font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-900"
                        />
                      )}
                    </Field>
                  ))}
                </div>

                {/* Error Message */}
                {errors.otp && touched.otp ? (
                  <p className="text-red-500 text-xs">
                    {(errors.otp as string) || ''}
                  </p>
                ) : null}

                {/* Verify Button */}
                <button
                  type="submit"
                  className="w-full bg-[#2B1B12] text-white text-sm py-2 rounded-md font-medium hover:bg-[#3d2616]"
                >
                  {t('Auth.verify')}
                </button>

                {/* Resend Link */}
                <p className="text-right mt-4 text-xs text-gray-600 hover:underline cursor-pointer">
                  {t('Auth.resend_otp')}
                </p>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}
