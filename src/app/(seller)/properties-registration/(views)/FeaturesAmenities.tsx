'use client'

import { FormikProps } from 'formik'
import { Dispatch, SetStateAction } from 'react'
import { FeatureMappingDTO, FeaturePayloadDTO } from '../(dto)/properties_registration_dto'
import { PropertyCreationFormValues } from '../page'
import LucideIconRenderer from '@/components/ui/CustomComponent/LucideIconRenderer/LucideIconRenderer'
import { a, input } from 'framer-motion/client'

interface Step4FeaturesAmenitiesProps {
  amenities: FeatureMappingDTO[]
  formik: FormikProps<PropertyCreationFormValues>
  setInputFeatureData: Dispatch<SetStateAction<FeaturePayloadDTO[] | null>>
  inputFeatureData: FeaturePayloadDTO[] | null
  hasInitialFeatureValues: boolean
}

export default function Step4FeaturesAmenities({
  amenities,
  formik,
  setInputFeatureData,
  inputFeatureData,
  hasInitialFeatureValues,
}: Step4FeaturesAmenitiesProps) {
  const baseEntries = (inputFeatureData ?? []) as FeaturePayloadDTO[]
  // console.log('Feature Entries:', inputFeatureData, amenities)
  const featureEntries = hasInitialFeatureValues ? ((formik.values.features ?? []) as FeaturePayloadDTO[]) : baseEntries
  const syncFeatureData = (next: FeaturePayloadDTO[]) => {
    setInputFeatureData(next)
    formik.setFieldValue('features', next)
  }

  const updateFeatureData = (categoryId: string | undefined, groupId: string | undefined, update: Partial<FeaturePayloadDTO>, inputType?: string) => {
    if (!categoryId) {
      return
    }

    const existingData = featureEntries
    const existingIndex = existingData.findIndex(d => d.feature_category_id === categoryId)

    if (existingIndex >= 0) {
      const existing = existingData[existingIndex]

      const updatedEntry = new FeaturePayloadDTO({
        feature_category_id: existing.feature_category_id,
        feature_group_id: existing.feature_group_id ?? groupId,
        value_text: inputType === 'text' ? update.value_text ?? existing.value_text : existing.value_text,
        value_number: inputType === 'numeric' ? update.value_number ?? existing.value_number : existing.value_number,
        value_boolean: inputType === 'boolean' ? update.value_boolean ?? existing.value_boolean : existing.value_boolean,
        option_ids: update.option_ids ? [...update.option_ids] : [...(existing.option_ids ?? [])],
        is_mandator: existing.is_mandator ?? update.is_mandator ?? false,
      })

      const shouldRemove =
        (inputType === 'text' && (!updatedEntry.value_text || updatedEntry.value_text === 'EMPTY')) ||
        (inputType === 'numeric' && updatedEntry.value_number === undefined) ||
        (inputType === 'boolean' && updatedEntry.value_boolean === undefined) ||
        (Array.isArray(updatedEntry.option_ids) && updatedEntry.option_ids.length === 0 && !inputType)

      if (shouldRemove) {
        const filtered = existingData.filter((_, index) => index !== existingIndex)
        syncFeatureData(filtered)
      } else {
        const next = existingData.map((item, index) => (index === existingIndex ? updatedEntry : item))
        syncFeatureData(next)
      }
    } else {
      const newEntry = new FeaturePayloadDTO({
        feature_category_id: categoryId,
        feature_group_id: groupId,
        value_text: update.value_text,
        value_number: update.value_number,
        value_boolean: update.value_boolean,
        option_ids: update.option_ids ? [...update.option_ids] : [],
        is_mandator: update.is_mandator ?? false,
      })
      syncFeatureData([...existingData, newEntry])
    }
  }

  //  Group amenities by feature_group_id
  const groupedAmenities = Object.values(
    amenities.reduce((acc, item) => {
      const groupId = item.feature_group_id
      if (!groupId) {
        return acc
      }

      if (!acc[groupId]) {
        acc[groupId] = {
          groupName: item.feature_group_name,
          groupId,
          categories: [] as FeatureMappingDTO[],
        }
      }
      acc[groupId].categories.push(item)
      return acc
    }, {} as Record<string, { groupName: string; groupId: string; categories: FeatureMappingDTO[] }>),
  )

  // console.log('Grouped Amenities:', groupedAmenities, amenities)

  // 2 Render input field per category
  const renderInputField = (feature: FeatureMappingDTO) => {
    const { feature_category_name, feature_category_id, feature_group_id, input_type, is_mandatory, options } = feature

    // TEXT / NUMERIC
    if (input_type?.includes('text') || input_type?.includes('numeric')) {
      return (
        <div key={feature_category_id} className="mb-4">
          <label className="block text-sm font-medium mb-1">
            {feature_category_name} {is_mandatory && <span className="text-red-500">*</span>}
          </label>
          {(() => {
            const existing = featureEntries.find(f => f.feature_category_id === feature_category_id)
            const valueProp = input_type.includes('text') ? existing?.value_text ?? '' : existing?.value_number ?? ''

            return (
              <input
                type={input_type.includes('text') ? 'text' : 'number'}
                placeholder={`Enter ${feature_category_name}`}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={valueProp as any}
                onChange={e => {
                  const value = e.currentTarget.value
                  if (input_type.includes('text')) {
                    updateFeatureData(
                      feature_category_id ?? undefined,
                      feature_group_id ?? undefined,
                      { value_text: value, is_mandator: is_mandatory },
                      'text',
                    )
                  } else {
                    const n = e.currentTarget.value === '' ? undefined : Number(value)
                    updateFeatureData(
                      feature_category_id ?? undefined,
                      feature_group_id ?? undefined,
                      { value_number: n, is_mandator: is_mandatory },
                      'numeric',
                    )
                  }
                }}
              />
            )
          })()}
        </div>
      )
    }

    // BOOLEAN
    if (input_type?.includes('boolean')) {
      const rawValue = featureEntries.find(f => f.feature_category_id === feature_category_id)?.value_boolean
      const checked = typeof rawValue === 'string' ? rawValue === 'true' : !!rawValue
      return (
        <label key={feature_category_id} className="flex items-center space-x-4 cursor-pointer mb-4">
          <input
            type="checkbox"
            checked={checked}
            className="sr-only peer"
            onChange={e => {
              updateFeatureData(
                feature_category_id ?? undefined,
                feature_group_id ?? undefined,
                {
                  value_boolean: String(e.currentTarget.checked),
                  is_mandator: is_mandatory,
                },
                'boolean',
              )
            }}
          />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r from-yellow-500 to-yellow-600 "></div>
          {feature_category_name} {is_mandatory && <span className="text-red-500">*</span>}
        </label>
      )
    }

    // SINGLE / MULTI SELECT
    if (input_type?.includes('single_select') || input_type?.includes('multi_select')) {
      const isMulti = input_type.includes('multi_select')

      // safely get selected option IDs for this category
      const selectedOptions = featureEntries.find(f => f.feature_category_id === feature_category_id)?.option_ids ?? []

      return (
        <div key={feature_category_id} className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">
            {feature_category_name} {is_mandatory && <span className="text-red-500">*</span>}
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 mt-3">
            {options?.map(opt => {
              const selected = selectedOptions.includes(opt.id)

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    let newOptionIds: string[] = []

                    if (isMulti) {
                      // Toggle for multi-select: add or remove this option
                      newOptionIds = selected
                        ? selectedOptions.filter(id => id !== opt.id) // remove unselected
                        : [...selectedOptions, opt.id] // add selected
                    } else {
                      // Toggle for single-select: either select or clear all
                      newOptionIds = selected ? [] : [opt.id]
                    }

                    // Filter out if no option is selected → remove this category from data
                    if (newOptionIds.length === 0) {
                      const filtered = featureEntries.filter(f => f.feature_category_id !== feature_category_id)
                      syncFeatureData(filtered)
                    } else {
                      // Otherwise update or insert normally
                      updateFeatureData(feature_category_id, feature_group_id ?? '', {
                        option_ids: [...newOptionIds],
                        is_mandator: is_mandatory,
                      })
                    }
                  }}
                  className={`flex items-center gap-2 rounded-lg border-2 px-3 py-2 transition ${
                    selected ? 'border-[#2a1407] bg-red-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {opt.icon && (
                    <div className="">
                      <LucideIconRenderer iconName={opt.icon} size={20} color={selected ? 'text-[#2a1407]' : 'text-gray-700'} />
                    </div>
                  )}
                  <span className="text-sm text-gray-700 font-medium">{opt.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      )
    }

    return null
  }

  // 3️⃣ Render grouped amenities
  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Features & Amenities</h2>
        <p className="text-gray-600 text-sm">Select Amenities</p>
      </div>

      {groupedAmenities.map(group => (
        <div key={group.groupId} className="mb-8">
          <h3 className="text-lg font-semibold mb-4">{group.groupName}</h3>
          <div className="flex flex-col space-y-4.5">{group.categories.map(renderInputField)}</div>
          {group !== groupedAmenities[groupedAmenities.length - 1] && <hr className="my-6 border-t-1 border-[#2a1407] rounded-full" />}
        </div>
      ))}
    </div>
  )
}
