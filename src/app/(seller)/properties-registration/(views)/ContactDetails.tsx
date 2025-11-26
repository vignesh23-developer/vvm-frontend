'use client'

import { useEffect } from 'react'
import { FormikProps } from 'formik'
import { PropertyCreationFormValues } from '../page'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'

interface Step3ContactDetailsProps {
  formik: FormikProps<PropertyCreationFormValues>
}

export default function Step3ContactDetails({ formik }: Step3ContactDetailsProps) {
  const { setFieldValue } = formik
  const { user, token } = useAuth()

  useEffect(() => {
    if (user) {
      setFieldValue('contactName', `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim())
      setFieldValue('contactNumber', user.phoneNumber ?? '')
      setFieldValue('contactEmail', user.email ?? '')
    }
  }, [setFieldValue])

  return (
    <div className="w-full mt-8 p-6 bg-white shadow-md rounded-xl border border-gray-200 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Contact Details</h2>
        <p className="text-gray-600 text-sm mt-1">Enter your basic personal information.</p>
      </div>

      <div className="space-y-6">
        <FormikTextField isrequired type="text" placeholder="Enter your name" label="Contact Name" name="contactName" />
        <FormikTextField isrequired type="tel" placeholder="Enter your contact number" label="Contact Number" name="contactNumber" />
        <FormikTextField isrequired type="email" placeholder="Enter your email address" label="Contact Email" name="contactEmail" />
      </div>
    </div>
  )
}
