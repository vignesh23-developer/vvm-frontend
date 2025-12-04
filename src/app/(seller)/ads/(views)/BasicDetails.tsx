'use client'

import { FormikProps, Field, ErrorMessage } from 'formik'
import { AdsCreationFormValues } from '../page'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'
import { useAdsCategories } from '../(hooks)/useAdsCategories'

interface Step1BasicDetailsProps {
  formik: FormikProps<AdsCreationFormValues>
}

export default function Step1BasicDetails({ formik }: Step1BasicDetailsProps) {
  const { values, errors, touched, handleChange, setFieldValue } = formik
  const { categories, isLoading: categoriesLoading } = useAdsCategories()

  const priceUnits = ['INR', 'USD', 'EUR', 'GBP']
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
          <FormikTextField isrequired type="text" placeholder="e.g., iPhone 14 Pro Max" label="Title" name="title" />
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
          {touched.description && errors.description && <p className="text-red-600 text-xs mt-1">{errors.description}</p>}
          <div className="text-xs text-gray-500 mt-1">{values.description.length}/500 characters</div>
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Category <span className="text-red-500">*</span>
          </label>
          {categoriesLoading ? (
            <div className="mt-3 flex items-center justify-center p-8">
              <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-[#7B1E1E]" />
              <span className="ml-2 text-sm text-gray-500">Loading categories...</span>
            </div>
          ) : (
            <select
              name="category_id"
              value={values.category_id || ''}
              onChange={handleChange}
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#7B1E1E] focus:outline-none"
            >
              <option value="">Select a category</option>
              {(categories ?? [])
                .filter((category: any) => Boolean(category?.isActive))
                .sort((a: any, b: any) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0))
                .map((category: any) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
            </select>
          )}
          {touched.category_id && errors.category_id && <p className="text-red-600 text-xs mt-1">{errors.category_id}</p>}
        </div>

        {/* Price and Price Unit */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
            <div className="sm:col-span-8">
              <div className="mb-4">
                <label htmlFor="price" className="block text-sm font-medium mb-1">
                  Price <span className="text-red-500">*</span>
                </label>
                <Field
                  id="price"
                  name="price"
                  type="number"
                  placeholder="Enter price"
                  className="w-full h-[42px] px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#7B1E1E] focus:outline-none"
                />
                <ErrorMessage name="price" component="p" className="text-red-500 text-sm mt-1" />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Price Unit</label>
              <div className="relative">
                <input
                  type="text"
                  value="INR"
                  disabled
                  className="w-full h-[42px] px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-gray-700 cursor-not-allowed"
                />
                <input type="hidden" name="price_unit" value="INR" />
              </div>
              {touched.price_unit && errors.price_unit && <p className="text-red-600 text-xs mt-1">{errors.price_unit}</p>}
            </div>
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

        {/* Toggle Switches */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <label htmlFor="is_negotiable" className="text-sm font-medium text-gray-700">
              Price is negotiable
            </label>
            <button
              type="button"
              onClick={() => setFieldValue('is_negotiable', !values.is_negotiable)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#7B1E1E] focus:ring-offset-2 ${
                values.is_negotiable ? 'bg-[#7B1E1E]' : 'bg-gray-200'
              }`}
              aria-pressed={values.is_negotiable}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  values.is_negotiable ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="is_published" className="text-sm font-medium text-gray-700">
              Publish immediately
            </label>
            <button
              type="button"
              onClick={() => setFieldValue('is_published', !values.is_published)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#7B1E1E] focus:ring-offset-2 ${
                values.is_published ? 'bg-[#7B1E1E]' : 'bg-gray-200'
              }`}
              aria-pressed={values.is_published}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  values.is_published ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="is_boosted" className="text-sm font-medium text-gray-700">
              Boost this ad (Premium feature)
            </label>
            <button
              type="button"
              onClick={() => setFieldValue('is_boosted', !values.is_boosted)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#7B1E1E] focus:ring-offset-2 ${
                values.is_boosted ? 'bg-[#7B1E1E]' : 'bg-gray-200'
              }`}
              aria-pressed={values.is_boosted}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  values.is_boosted ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
