'use client'

import { useState } from 'react'
import { Formik, Form } from 'formik'
import { motion } from 'framer-motion'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'
import Image from 'next/image'
import { ProfileCreationSchema } from '@/utils/validations/auth/AuthValidationSchema'
import LanguageSwitch from '@/components/ui/CustomComponent/languageSwitch/languageSwitch'
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

  const handleProfileCreationSubmit = (values: any, setSubmitting: (isSubmitting: boolean) => void) => {
    console.log('Form Submitted ', values)
    setTimeout(() => {
      setSubmitting(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Language Switch */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageSwitch />
      </div>

      {/* Left Side (Logo + Animation) */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="hidden md:flex w-1/2 bg-[#2c1207] flex-col items-center justify-center text-center p-6"
      >
        <Link href="/">
          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 200 }} className="max-w-xs cursor-pointer">
            <Image src="/footer_logo_new.PNG" alt="Vaazhga Valamudan Logo" width={400} height={300} className="mt-6" />
          </motion.div>
        </Link>
      </motion.div>

      {/* Right Side (Form) */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-full md:w-1/2 flex items-start justify-center p-10 md:p-20"
      >
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="w-full max-w-md"
        >
          {/* Title */}
          <motion.h2
            className="text-2xl font-bold text-gray-800 leading-snug"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {t('Auth.profile_creation')}
          </motion.h2>
          <motion.p className="text-gray-500 text-xs mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            {t('Auth.profile_description')}
          </motion.p>

          {/* 🧩 Formik Form */}
          <Formik
            initialValues={initialValues}
            validationSchema={ProfileCreationSchema(t)}
            onSubmit={(values, { setSubmitting }) => {
              handleProfileCreationSubmit(values, setSubmitting)
            }}
          >
            {({ isSubmitting }) => (
              <Form className="mt-6 space-y-4">
                {/* Animated Form Fields */}
                {[
                  { name: 'email', label: 'form.email', type: 'email' },
                  { name: 'address', label: 'form.address', type: 'text' },
                  { name: 'landMark', label: 'form.land_mark', type: 'text' },
                  { name: 'postalCode', label: 'form.post_code', type: 'text' },
                ].map((field, index) => (
                  <motion.div key={field.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 * index }}>
                    <FormikTextField
                      label={t(`${field.label}.label`)}
                      type={field.type}
                      name={field.name}
                      placeholder={t(`${field.label}.placeholder`)}
                      className="w-full border border-gray-300 text-xs rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-900"
                    />
                  </motion.div>
                ))}

                {/* Animated Submit Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={isSubmitting}
                  className="w-full bg-[#2B1B12] text-white text-sm py-2 rounded-md flex items-center justify-center space-x-2 hover:bg-[#3d2616] transition"
                >
                  {isSubmitting ? 'Submitting...' : t('Auth.submit')}
                </motion.button>
              </Form>
            )}
          </Formik>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default ProfileCreation
