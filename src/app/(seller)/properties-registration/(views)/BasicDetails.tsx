'use client'
// Step1BasicDetails.tsx
import { FormikProps } from 'formik'

import { PropertyCategory } from '@/app/(seller)/properties-registration/(dto)/properties_registration_dto'
import { PropertyCreationFormValues } from '../page'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'
import { Dispatch, SetStateAction } from 'react'
import { FeatureMappingDTO } from '../(dto)/properties_registration_dto'
import { PropertyCategoryFeatureMappingResponse } from '../(hook)/properties_registration_hook'
import LucideIconRenderer from '@/components/ui/CustomComponent/LucideIconRenderer/LucideIconRenderer'

interface Step1BasicDetailsProps {
  formik: FormikProps<PropertyCreationFormValues>
  data: Array<PropertyCategory>
  setFeatureData: Dispatch<SetStateAction<Array<FeatureMappingDTO> | null>>
  onGetPropertyCategoryFeatureMapping: (id: string) => Promise<PropertyCategoryFeatureMappingResponse>
}

export default function Step1BasicDetails({ formik, data, onGetPropertyCategoryFeatureMapping, setFeatureData }: Step1BasicDetailsProps) {
  const { values, errors, touched, handleChange, setFieldValue } = formik

  async function onSelectPropertyHandler(id: string) {
    const result = await onGetPropertyCategoryFeatureMapping(id)

    if (!result?.error) {
      setFeatureData(result?.data?.mappings)
      setFieldValue('propertyType', id)
    } else {
      console.log('log on onSelectPropertyHandler error case', result?.message)
    }
  }

  return (
    <div className="w-full mt-8 p-6 bg-white shadow-md rounded-xl border border-gray-200 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Basic Property Details</h2>
        <p className="text-gray-600 text-sm mt-1">Fill in the basic information about your property</p>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <FormikTextField
            isrequired
            type="text"
            placeholder="e.g., Modern 3BHK Villa in Prime Location"
            label={'Property Title'}
            name={'propertyTitle'}
          />
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Property Type <span className="text-red-500">*</span>
          </label>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {data?.map((val, idx) => (
              <button
                key={idx}
                type="button"
                aria-pressed={values.propertyType === val?.id}
                onClick={async () => onSelectPropertyHandler(val?.id)}
                className={`flex items-center gap-2 rounded-lg border-2 px-3 py-2 transition
                  ${values.propertyType === val?.id ? 'border-[#2a1407] bg-red-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
              >
                {val?.icon && (
                  <div className="">
                    <LucideIconRenderer
                      iconName={val?.icon as any}
                      size={20}
                      color={values.propertyType === val?.id ? 'text-[#2a1407]' : 'text-gray-700'}
                    />
                  </div>
                )}
                <span className="text-sm font-medium">{val?.name}</span>
              </button>
            ))}
          </div>
          {touched.propertyType && errors.propertyType && <p className="text-red-600 text-xs mt-1">{errors.propertyType}</p>}
        </div>

        {/* Purpose */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Purpose <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 mt-3">
            {(['SALE', 'RENT', 'LEASE'] as const).map(p => (
              <button
                key={p}
                type="button"
                aria-pressed={values.purpose === p}
                onClick={() => setFieldValue('purpose', p)}
                className={`flex items-center gap-2 rounded-lg border-2 px-3 py-2 transition
                  ${values.purpose === p ? 'border-[#2a1407] bg-red-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <span className="">{p === 'SALE' ? '💰' : p === 'RENT' ? '🏠' : '📋'}</span>
                <span className="text-sm text-gray-700 font-medium">{p}</span>
              </button>
            ))}
          </div>
          {touched.purpose && errors.purpose && <p className="text-red-600 text-xs mt-1">{errors.purpose}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700">
            Property Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Describe your property in detail..."
            value={values.description}
            onChange={handleChange}
            rows={4}
            maxLength={500}
            aria-invalid={!!(errors.description && touched.description)}
            className={`mt-2 w-full px-4 py-3 border rounded-lg shadow-sm resize-none focus:ring-2 focus:ring-[#2a1407] focus:outline-none
              ${errors.description && touched.description ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
          />
          {touched.description && errors.description && <p className="text-red-600 text-xs mt-1">{errors.description}</p>}
          <div className="text-xs text-gray-500 mt-1">{values.description.length}/500 characters</div>
        </div>
      </div>
    </div>
  )
}
