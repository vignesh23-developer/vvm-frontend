'use client'

import { useEffect } from 'react'
import { FormikProps } from 'formik'
import { AdsCreationFormValues } from '../page'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'
import { getLocalStorageItem } from '@/utils/local_storage/local_storage_handler'
import { LOCAL_STORAGE_NAME } from '@/utils/local_storage/local_storage_constant'

interface Step3ContactProps {
  formik: FormikProps<AdsCreationFormValues>
}

interface UserData {
  firstName?: string
  lastName?: string
  phoneNumber?: string
  email?: string
}

export default function Step3Contact({ formik }: Step3ContactProps) {
  const { setFieldValue } = formik

  useEffect(() => {
    const userData: UserData | null = getLocalStorageItem(LOCAL_STORAGE_NAME.userData)
    if (userData) {
      const fullName = `${userData.firstName ?? ''} ${userData.lastName ?? ''}`.trim()
      setFieldValue('contact_name', fullName)
      setFieldValue('contact_phone', userData.phoneNumber ?? '')
      setFieldValue('contact_email', userData.email ?? '')
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
