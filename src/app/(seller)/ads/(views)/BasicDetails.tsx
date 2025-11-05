'use client'

import { FormikProps } from 'formik'
import { AdsCreationFormValues } from '../page'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'
import { v4 as uuidv4 } from 'uuid'
import { useMemo } from 'react'

interface Step1BasicDetailsProps {
  formik: FormikProps<AdsCreationFormValues>
}

export default function Step1BasicDetails({ formik }: Step1BasicDetailsProps) {
  const { values, errors, touched, handleChange, setFieldValue } = formik
  // Mock categories - replace with actual API call
   // Generate categories once
  const categories = useMemo(
    () => [
      { id: uuidv4(), name: 'Electronics' },
      { id: uuidv4(), name: 'Vehicles' },
      { id: uuidv4(), name: 'Furniture' },
      { id: uuidv4(), name: 'Clothing' },
      { id: uuidv4(), name: 'Books' },
      { id: uuidv4(), name: 'Sports & Outdoors' },
    ],
    [] // only run once
  );

  const priceUnits = ['USD', 'EUR', 'GBP', 'INR']
  const statusOptions = ['AVAILABLE', 'SOLD', 'PENDING']

  return (
    <div className="w-full mt-8 p-6 bg-white shadow-md rounded-xl border border-gray-200 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Basic Details</h2>
        <p className="text-gray-600 text-sm mt-1">Fill in the basic information about your ad</p>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <FormikTextField
            isrequired
            type="text"
            placeholder="e.g., iPhone 14 Pro Max"
            label="Title"
            name="title"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Describe your item in detail..."
            value={values.description}
            onChange={handleChange}
            rows={4}
            maxLength={500}
            aria-invalid={!!(errors.description && touched.description)}
            className={`mt-2 w-full px-4 py-3 border rounded-lg shadow-sm resize-none focus:ring-2 focus:ring-[#7B1E1E] focus:outline-none
              ${errors.description && touched.description ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
          />
          {touched.description && errors.description && (
            <p className="text-red-600 text-xs mt-1">{errors.description}</p>
          )}
          <div className="text-xs text-gray-500 mt-1">{values.description.length}/500 characters</div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Category <span className="text-red-500">*</span>
          </label>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {categories.map(category => (
              <button
                key={category.id}
                type="button"
                aria-pressed={values.category_id === category.id}
                onClick={() => setFieldValue('category_id', category.id)}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all
                  ${
                    values.category_id === category.id
                      ? 'border-[#7B1E1E] bg-red-50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <span className="text-sm font-medium">{category.name}</span>
              </button>
            ))}
          </div>
          {touched.category_id && errors.category_id && (
            <p className="text-red-600 text-xs mt-1">{errors.category_id}</p>
          )}
        </div>

        {/* Price and Price Unit */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <FormikTextField
              isrequired
              type="number"
              placeholder="Enter price"
              label="Price"
              name="price"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Price Unit <span className="text-red-500">*</span>
            </label>
            <select
              name="price_unit"
              value={values.price_unit}
              onChange={handleChange}
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#7B1E1E] focus:outline-none"
            >
              {priceUnits.map(unit => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
            {touched.price_unit && errors.price_unit && (
              <p className="text-red-600 text-xs mt-1">{errors.price_unit}</p>
            )}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">Status</label>
          <select
            name="status"
            value={values.status}
            onChange={handleChange}
            className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#7B1E1E] focus:outline-none"
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Checkboxes */}
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              id="is_negotiable"
              name="is_negotiable"
              type="checkbox"
              checked={values.is_negotiable}
              onChange={handleChange}
              className="w-4 h-4 text-[#7B1E1E] bg-white border-gray-300 rounded focus:ring-[#7B1E1E] focus:ring-2"
            />
            <label htmlFor="is_negotiable" className="ml-3 text-sm text-gray-700">
              Price is negotiable
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="is_published"
              name="is_published"
              type="checkbox"
              checked={values.is_published}
              onChange={handleChange}
              className="w-4 h-4 text-[#7B1E1E] bg-white border-gray-300 rounded focus:ring-[#7B1E1E] focus:ring-2"
            />
            <label htmlFor="is_published" className="ml-3 text-sm text-gray-700">
              Publish immediately
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="is_boosted"
              name="is_boosted"
              type="checkbox"
              checked={values.is_boosted}
              onChange={handleChange}
              className="w-4 h-4 text-[#7B1E1E] bg-white border-gray-300 rounded focus:ring-[#7B1E1E] focus:ring-2"
            />
            <label htmlFor="is_boosted" className="ml-3 text-sm text-gray-700">
              Boost this ad (Premium feature)
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
