'use client'

import React from 'react'
import FormikTextField from '../../ui/Formik/FormikTextField/FormikTextField'
import FormikSelectField from '@/components/ui/Formik/FormikSelectField/FormikSelectField'
import { Form, useFormikContext } from 'formik'
const LocationPriceStep2 = () => {
  const { values, errors, setFieldValue } = useFormikContext<any>()
  const districtOptions = [
    { value: 'Coimbatore', label: 'Coimbatore' },
    { value: 'Chennai', label: 'Chennai' },
    { value: 'Madurai', label: 'Madurai' },
  ]
  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-6">Location &amp; Pricing</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* District */}
        <div>
          <FormikSelectField
            label="District"
            name="district"
            options={districtOptions}
            className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Town/City */}
        <div>
          <FormikTextField
            type="text"
            label="Town/City"
            name="city"
            placeholder="Enter town or city"
            className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Complete Address */}
      <div className="mb-4">
        <FormikTextField
          as="textarea"
          label="Complete Address"
          name="address"
          placeholder="Enter complete address"
          rows={3}
          className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* Price */}
        <div>
          <div className="flex items-center rounded-md">
            <span className="px-3 text-gray-500">₹</span>
            <FormikTextField
              type="number"
              label="Price"
              name="price"
              placeholder="Enter price"
              className="w-full rounded-r-md p-2 focus:ring-2 border border-gray-300 focus:ring-blue-500 focus:outline-none mt-2"
            />
          </div>
        </div>

        {/* Property Size */}
        <div>
          <div className="flex gap-2 items-center">
            <FormikTextField
              type="text"
              label="Property Size"
              name="size"
              placeholder="Enter property size"
              className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none mt-2"
            />
            <FormikSelectField
              label="Unit"
              name="size_unit"
              options={[
                { value: 'Sqft', label: 'Sqft' },
                { value: 'Sqm', label: 'Sqm' },
                { value: 'Acre', label: 'Acre' },
              ]}
              className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none mt-2"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default LocationPriceStep2
