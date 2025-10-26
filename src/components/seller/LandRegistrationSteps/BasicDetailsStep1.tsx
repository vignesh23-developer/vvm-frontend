import React from 'react'
import FormikTextField from '../../ui/Formik/FormikTextField/FormikTextField'
import { useFormikContext } from 'formik'
import { usePropertyCategories } from '@/hooks/CustomHooks/usePropertyCategories'

const BasicDetailsStep1 = () => {
  const { values, errors, setFieldValue } = useFormikContext<any>()

  const { categories, error, isLoading } = usePropertyCategories()

  const listing_type: ('Sale' | 'Rent' | 'Lease')[] = ['Sale', 'Rent', 'Lease']

  console.log('Formik Values:', values)
  return (
    <div className="w-full mt-8 p-6 bg-white shadow-md rounded-xl border border-gray-200 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Basic Property Details
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          Fill in the basic information about your property
        </p>
      </div>

      {/* Title */}
      <div>
        <FormikTextField
          type="text"
          label="Property Title"
          name="propertyTitle"
          placeholder="e.g., Modern 3BHK Villa in Prime Location"
          className={`mt-2 w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#7B1E1E] focus:outline-none`}
        />
      </div>

      {/* Property Type */}
      <div className="mt-6">
        <label className="block text-sm font-semibold text-gray-700">
          Property Type <span className="text-red-500">*</span>
        </label>
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {categories.map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFieldValue('property_category_id', item.id)}
              aria-pressed={values.property_category_id === item.id}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all
                ${
                  values.property_category_id === item.id
                    ? 'border-[#7B1E1E] bg-red-50 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
            >
              <span className="text-sm font-medium">{item.name}</span>
            </button>
          ))}
        </div>
        {errors.property_category_id && (
          <p className="text-red-600 text-xs mt-1">
            {errors.property_category_id as string}
          </p>
        )}
      </div>

      {/* Purpose */}
      <div className="mt-6">
        <label className="block text-sm font-semibold text-gray-700">
          Listing Type <span className="text-red-500">*</span>
        </label>
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {listing_type.map(p => (
            <button
              key={p}
              type="button"
              aria-pressed={values.purpose === p}
              onClick={() => setFieldValue('purpose', p)}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all
                ${
                  values.purpose === p
                    ? 'border-[#7B1E1E] bg-red-50 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
            >
              <span className="text-2xl mb-1">
                {p === 'Sale' ? '💰' : p === 'Rent' ? '🏠' : '📋'}
              </span>
              <span className="text-sm font-medium">{p}</span>
            </button>
          ))}
        </div>
        {errors.purpose && (
          <p className="text-red-600 text-xs mt-1">
            {errors.purpose as string}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="mt-6">
        <FormikTextField
          as="textarea"
          label="Property Description"
          name="description"
          placeholder="Describe your property in detail..."
          maxLength={500}
          rows={4}
          className={`mt-2 w-full px-4 py-3 border rounded-lg shadow-sm resize-none focus:ring-2 focus:ring-[#7B1E1E] focus:outline-none
            ${
              errors.description
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300'
            }`}
        />
        <div className="text-xs text-gray-500 mt-1">
          {values.description.length}/500 characters
        </div>
      </div>
    </div>
  )
}

export default BasicDetailsStep1
