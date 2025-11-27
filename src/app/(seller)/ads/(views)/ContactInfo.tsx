'use client'

import { useEffect } from 'react'
import { FormikProps } from 'formik'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import { AdsCreationFormValues } from '../page'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'

interface Step3ContactProps {
  formik: FormikProps<AdsCreationFormValues>
}

export default function Step3Contact({ formik }: Step3ContactProps) {
  const { user, token } = useAuth()
  const { setFieldValue } = formik

  useEffect(() => {
    if (user) {
      const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
      setFieldValue('contact_name', fullName)
      setFieldValue('contact_phone', user.phoneNumber ?? '')
      setFieldValue('contact_email', user.email ?? '')
    }
  }, [setFieldValue])

  return (
    <div className="w-full mt-8 p-6 bg-white shadow-md rounded-xl border border-gray-200 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Contact Details</h2>
        <p className="text-gray-600 text-sm mt-1">Enter your basic personal information.</p>
      </div>

      <div className="space-y-6">
        <FormikTextField isrequired type="text" placeholder="Enter your name" label="Contact Name" name="contact_name" />
        <FormikTextField isrequired type="tel" placeholder="Enter your contact number" label="Contact Number" name="contact_phone" />
        <FormikTextField isrequired type="email" placeholder="Enter your email address" label="Contact Email" name="contact_email" />
      </div>
    </div>
  )
}
