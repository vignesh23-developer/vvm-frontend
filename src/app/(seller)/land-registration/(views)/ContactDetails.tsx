'use client'

// Step1ContactDetails.tsx
import { FormikProps } from 'formik'
import { PropertyCreationFormValues } from '../page'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'

interface Step3ContactDetailsProps {
  formik: FormikProps<PropertyCreationFormValues>
}

export default function Step3ContactDetails({ formik }: Step3ContactDetailsProps) {
  const { values, errors, touched, handleChange, setFieldValue } = formik

  return (
    <div className="w-full mt-8 p-6 bg-white shadow-md rounded-xl border border-gray-200 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Contact Details</h2>
        <p className="text-gray-600 text-sm mt-1">Enter your basic personal information.</p>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <FormikTextField isrequired type="text" placeholder="Enter your name" label={'Contact Name'} name={'contactName'} />
        </div>

        {/* Phone  */}
        <div>
          <FormikTextField isrequired type="tel" placeholder="Enter your contact number" label={'Contact Number'} name={'contactNumber'} />
        </div>

        {/* Email */}
        <div>
          <FormikTextField isrequired type="email" placeholder="Enter your email address" label={'Contact Email'} name={'contactEmail'} />
        </div>
      </div>
    </div>
  )
}
