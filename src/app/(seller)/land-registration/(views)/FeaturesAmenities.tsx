'use client'

import { FormikProps } from 'formik'
import { Dispatch, SetStateAction } from 'react'
import { FeatureMappingDTO, FeaturePayloadDTO } from '../(dto)/land_registration_dto'
import { PropertyCreationFormValues } from '../page'

interface Step4FeaturesAmenitiesProps {
  amenities: FeatureMappingDTO[]
  formik: FormikProps<PropertyCreationFormValues>
  setInputFeatureData: Dispatch<SetStateAction<FeaturePayloadDTO[] | null>>
  inputFeatureData: FeaturePayloadDTO[] | null
}

export default function Step4FeaturesAmenities({ amenities, formik, setInputFeatureData, inputFeatureData }: Step4FeaturesAmenitiesProps) {
  const { values, errors, touched } = formik

  const updateFeatureData = (categoryId: string | undefined, groupId: string | undefined, update: Partial<FeaturePayloadDTO>, inputType?: string) => {
    setInputFeatureData((prevData): any => {
      const existingData = prevData ?? []
      const existingIndex = existingData.findIndex(d => d.feature_category_id === categoryId)

      if (existingIndex >= 0) {
        const existing = existingData[existingIndex]

        const updatedEntry: FeaturePayloadDTO = new FeaturePayloadDTO({
          feature_category_id: existing.feature_category_id,
          feature_group_id: existing.feature_group_id,
          value_text: inputType === 'text' ? update.value_text ?? existing.value_text : undefined,
          value_number: inputType === 'numeric' ? update.value_number ?? existing.value_number : undefined,
          option_ids: update.option_ids ? [...update.option_ids] : [...(existing.option_ids ?? [])],
          is_mandator: existing.is_mandator,
        })

        // Remove if empty, else update immutably
        if (
          (inputType === 'text' && (!updatedEntry.value_text || updatedEntry.value_text === 'EMPTY')) ||
          (inputType === 'numeric' && updatedEntry.value_number === undefined)
        ) {
          return existingData.filter((_, i) => i !== existingIndex)
        } else {
          // Return a NEW array + NEW object (forces re-render)
          const newArr = existingData.map((d, i) => (i === existingIndex ? updatedEntry : { ...d }))
          return [...newArr]
        }
      } else {
        // Add new
        const newEntry = new FeaturePayloadDTO({
          feature_category_id: categoryId,
          feature_group_id: groupId,
          value_text: update.value_text,
          value_number: update.value_number,
          option_ids: update.option_ids ? [...update.option_ids] : [],
          is_mandator: update.is_mandator,
        })
        return [...existingData, newEntry]
      }
    })
  }

  // 1️⃣ Group amenities by feature_group_id
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

  // 2️⃣ Render input field per category
  const renderInputField = (feature: FeatureMappingDTO) => {
    const { feature_category_name, feature_category_id, feature_group_id, input_type, is_mandatory, options } = feature

    // TEXT / NUMERIC
    if (input_type?.includes('text') || input_type?.includes('numeric')) {
      return (
        <div key={feature_category_id} className="mb-4">
          <label className="block text-sm font-medium mb-1">
            {feature_category_name} {is_mandatory && <span className="text-red-500">*</span>}
          </label>
          <input
            type={input_type.includes('text') ? 'text' : 'number'}
            placeholder={`Enter ${feature_category_name}`}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            onChange={e => {
              const value = e.currentTarget.value
              if (input_type.includes('text')) {
                updateFeatureData(feature_category_id ?? undefined, feature_group_id ?? undefined, { value_text: value }, 'text')
              } else {
                updateFeatureData(feature_category_id ?? undefined, feature_group_id ?? undefined, { value_number: Number(value) }, 'numeric')
              }
            }}
          />
        </div>
      )
    }

    // BOOLEAN
    if (input_type?.includes('boolean')) {
      const checked = inputFeatureData?.find(f => f.feature_category_id === feature_category_id)?.option_ids?.[0] === 'true'
      return (
        <label key={feature_category_id} className="flex items-center space-x-2 cursor-pointer mb-4">
          <input
            type="checkbox"
            checked={checked}
            className="sr-only peer"
            onChange={e => {
              updateFeatureData(feature_category_id ?? undefined, feature_group_id ?? undefined, { option_ids: [String(e.target.checked)] })
            }}
          />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          <span className="text-gray-800">{feature_category_name}</span>
        </label>
      )
    }

    // SINGLE / MULTI SELECT
    if (input_type?.includes('single_select') || input_type?.includes('multi_select')) {
      const isMulti = input_type.includes('multi_select')

      // safely get selected option IDs for this category
      const selectedOptions = inputFeatureData?.find(f => f.feature_category_id === feature_category_id)?.option_ids ?? []

      return (
        <div key={feature_category_id} className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">
            {feature_category_name} {is_mandatory && <span className="text-red-500">*</span>}
          </label>

          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
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
                      setInputFeatureData(prev => (prev ?? []).filter(f => f.feature_category_id !== feature_category_id))
                    } else {
                      // Otherwise update or insert normally
                      updateFeatureData(feature_category_id, feature_group_id ?? '', {
                        option_ids: [...newOptionIds],
                      })
                    }
                  }}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                    selected ? 'border-[#7B1E1E] bg-red-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-sm font-medium">{opt.name}</span>
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
        </div>
      ))}
    </div>
  )
}
