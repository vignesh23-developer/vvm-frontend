'use client'

import { FormikProps } from 'formik'
import { AdsCreationFormValues } from '../page'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'

interface Step3ContactProps {
  formik: FormikProps<AdsCreationFormValues>
}

export default function Step3Contact({ formik }: Step3ContactProps) {
  const { values, errors, touched } = formik

  return (
    <div className="w-full mt-8 p-6 bg-white shadow-md rounded-xl border border-gray-200 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Contact Details</h2>
        <p className="text-gray-600 text-sm mt-1">
          Provide your contact information so buyers can reach you
        </p>
      </div>

      <div className="space-y-6">
        {/* Contact Name */}
        <div>
          <FormikTextField
            isrequired
            type="text"
            placeholder="e.g., John Doe"
            label="Contact Name"
            name="contact_name"
          />
        </div>

        {/* Contact Phone */}
        <div>
          <FormikTextField
            isrequired
            type="tel"
            placeholder="e.g., +1234567890"
            label="Contact Phone"
            name="contact_phone"
          />
          <p className="text-xs text-gray-500 mt-1">
            Include country code for international numbers (e.g., +1 for USA)
          </p>
        </div>

        {/* Contact Email */}
        <div>
          <FormikTextField
            isrequired
            type="email"
            placeholder="e.g., john@example.com"
            label="Contact Email"
            name="contact_email"
          />
        </div>

        {/* Info Box */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-green-900 mb-2">Privacy & Safety Tips</h3>
          <ul className="text-sm text-green-700 space-y-1">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Your contact information will only be visible to interested buyers</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>We recommend meeting in public places for transactions</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Never share sensitive financial information via email or phone</span>
            </li>
          </ul>
        </div>

        {/* Review Summary */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Review Your Ad</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Title:</span>
              <span className="font-medium text-gray-900">{values.title || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Price:</span>
              <span className="font-medium text-gray-900">
                {values.price ? `${values.price_unit} ${values.price}` : '-'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Location:</span>
              <span className="font-medium text-gray-900">
                {values.city && values.state ? `${values.city}, ${values.state}` : '-'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Negotiable:</span>
              <span className="font-medium text-gray-900">{values.is_negotiable ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
