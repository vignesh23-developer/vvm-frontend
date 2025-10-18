'use client'

import { Formik, Form, Field } from 'formik'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
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

      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`)
        nextInput?.focus()
      }
    }
  }

  // ✨ Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1, duration: 0.5 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  }

  return (
    <motion.div
      className="min-h-screen flex relative bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Language Switch */}
      <div className="absolute top-4 right-4">
        <LanguageSwitch />
      </div>

      {/* Left Section - Logo */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden md:flex w-1/2 bg-[#2c1207] flex-col items-center justify-center p-6"
      >
        <Link href="/home">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="max-w-xs cursor-pointer"
          >
            <Image
              src="/footer_logo.png"
              alt="Vaazhga Valamudan Logo"
              width={400}
              height={300}
              className="mt-6"
            />
          </motion.div>
        </Link>
      </motion.div>

      {/* Right Section - OTP Form */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full md:w-1/2 flex items-start justify-center p-10 sm:p-16 md:p-20"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="w-full max-w-md"
        >
          {/* Back Button */}
          <motion.div variants={itemVariants}>
            <Link
              href="/forgot-password"
              className="flex items-center text-sm font-semibold text-green-900 mb-2 hover:underline"
            >
              <ArrowLeft size={20} className="mr-2" /> {t('Auth.back')}
            </Link>
          </motion.div>

          {/* Title & Description */}
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-bold text-gray-800 leading-snug">
              {t('Auth.otp_verification')}
            </h2>
            <p className="text-gray-500 mt-2 text-xs">
              {t('Auth.otp_description')}
            </p>
          </motion.div>

          {/* ✅ Formik Form */}
          <Formik
            initialValues={initialValues}
            validationSchema={OtpSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, errors, touched }) => (
              <Form className="mt-6 space-y-4">
                {/* OTP Inputs */}
                <motion.div
                  variants={containerVariants}
                  className="flex justify-between mb-4"
                >
                  {values.otp.map((digit, index) => (
                    <motion.div key={index} variants={itemVariants}>
                      <Field name={`otp[${index}]`}>
                        {() => (
                          <input
                            id={`otp-${index}`}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={e =>
                              handleOtpChange(
                                e,
                                index,
                                values.otp,
                                setFieldValue,
                              )
                            }
                            className="w-14 h-14 text-center text-xl font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-900"
                          />
                        )}
                      </Field>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Error Message */}
                <motion.div variants={itemVariants}>
                  {errors.otp && touched.otp ? (
                    <p className="text-red-500 text-xs mt-1">
                      {(errors.otp as string) || ''}
                    </p>
                  ) : null}
                </motion.div>

                {/* Verify Button */}
                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full bg-[#2B1B12] text-white text-sm py-2 rounded-md font-medium hover:bg-[#3d2616] transition"
                >
                  {t('Auth.verify')}
                </motion.button>

                {/* Resend OTP */}
                <motion.p
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, color: '#14532d' }}
                  className="text-right mt-4 text-xs text-gray-600 hover:underline cursor-pointer"
                >
                  {t('Auth.resend_otp')}
                </motion.p>
              </Form>
            )}
          </Formik>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
