'use client'

import { ChangeEvent } from 'react'

type PropertyType = 'Land' | 'Residential' | 'Commercial' | 'Plot'
type PurposeType = 'Sale' | 'Rent' | 'Lease'

type FormData = {
  propertyTitle: string
  propertyType: PropertyType | ''
  purpose: PurposeType | ''
  description: string
}

type FormErrors = Partial<Record<keyof FormData, string>>

interface Step1BasicDetailsProps {
  formData: FormData
  errors: FormErrors
  updateFormData: (field: keyof FormData, value: string) => void
}

export default function Step1BasicDetails({
  formData,
  errors,
  updateFormData,
}: Step1BasicDetailsProps) {
  const propertyTypes: PropertyType[] = [
    'Land',
    'Residential',
    'Commercial',
    'Plot',
  ]
  const purposes: PurposeType[] = ['Sale', 'Rent', 'Lease']

  return (
    <div className="w-full mt-8 p-6 bg-white shadow-md rounded-xl border border-gray-200 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Basic Property Details
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          Fill in the basic information about your property
        </p>
      </div>

      <form className="space-y-6" noValidate>
        {/* Title */}
        <div>
          <label
            htmlFor="propertyTitle"
            className="block text-sm font-semibold text-gray-700"
          >
            Property Title <span className="text-red-500">*</span>
          </label>
          <input
            id="propertyTitle"
            type="text"
            placeholder="e.g., Modern 3BHK Villa in Prime Location"
            value={formData.propertyTitle}
            onChange={e => updateFormData('propertyTitle', e.target.value)}
            aria-invalid={!!errors.propertyTitle}
            className={`mt-2 w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#7B1E1E] focus:outline-none
              ${
                errors.propertyTitle
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300'
              }`}
          />
          {errors.propertyTitle && (
            <p className="text-red-600 text-xs mt-1">{errors.propertyTitle}</p>
          )}
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Property Type <span className="text-red-500">*</span>
          </label>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {propertyTypes.map(type => (
              <button
                key={type}
                type="button"
                aria-pressed={formData.propertyType === type}
                onClick={() => updateFormData('propertyType', type)}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all
                  ${
                    formData.propertyType === type
                      ? 'border-[#7B1E1E] bg-red-50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <span className="text-2xl mb-1">
                  {type === 'Land'
                    ? '🌄'
                    : type === 'Residential'
                    ? '🏠'
                    : type === 'Commercial'
                    ? '🏢'
                    : '📐'}
                </span>
                <span className="text-sm font-medium">{type}</span>
              </button>
            ))}
          </div>
          {errors.propertyType && (
            <p className="text-red-600 text-xs mt-1">{errors.propertyType}</p>
          )}
        </div>

        {/* Purpose */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Purpose <span className="text-red-500">*</span>
          </label>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {purposes.map(p => (
              <button
                key={p}
                type="button"
                aria-pressed={formData.purpose === p}
                onClick={() => updateFormData('purpose', p)}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all
                  ${
                    formData.purpose === p
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
            <p className="text-red-600 text-xs mt-1">{errors.purpose}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-gray-700"
          >
            Property Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            placeholder="Describe your property in detail..."
            value={formData.description}
            onChange={e => updateFormData('description', e.target.value)}
            rows={4}
            maxLength={500}
            aria-invalid={!!errors.description}
            className={`mt-2 w-full px-4 py-3 border rounded-lg shadow-sm resize-none focus:ring-2 focus:ring-[#7B1E1E] focus:outline-none
              ${
                errors.description
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300'
              }`}
          />
          {errors.description && (
            <p className="text-red-600 text-xs mt-1">{errors.description}</p>
          )}
          <div className="text-xs text-gray-500 mt-1">
            {formData.description.length}/500 characters
          </div>
        </div>
      </form>
    </div>
  )
}
