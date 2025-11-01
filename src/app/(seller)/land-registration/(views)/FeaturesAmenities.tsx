import { FormikProps } from 'formik'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { FeatureMappingDTO, FeaturePayloadDTO } from '../(dto)/land_registration_dto'
import { Plus } from 'lucide-react'
import { PropertyCreationFormValues } from '../page'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'
import toast from 'react-hot-toast'

interface Step4FeaturesAmenitiesProps {
  amenities: FeatureMappingDTO[]
  formik: FormikProps<PropertyCreationFormValues>
  setInputFeatureData: Dispatch<SetStateAction<Array<FeaturePayloadDTO> | null>>
  inputFeatureData: FeaturePayloadDTO[] | null
}

export default function Step4FeaturesAmenities({ amenities, formik, setInputFeatureData, inputFeatureData }: Step4FeaturesAmenitiesProps) {
  const { values, errors, touched, handleChange, setFieldValue } = formik

  const toggleFeatureMappingDTO = (id: string) => {
    const currentSelection = formik.values.option_ids || []
    const updatedSelection = currentSelection.includes(id) ? currentSelection.filter(featureId => featureId !== id) : [...currentSelection, id]

    formik.setFieldValue('option_ids', updatedSelection)
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Features & Amenities</h2>
        <p className="text-gray-600 text-sm">Select Amenities</p>
      </div>
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8"> */}
      <div className="flex flex-col space-y-4.5 mb-8">
        {amenities.map((val, idx) => {
          if (val?.input_type?.includes('text') || val?.input_type?.includes('numeric') || val?.input_type?.includes('Unit')) {
            return (
              <div key={idx} className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  {val?.feature_category_name} {val?.is_mandatory && <span className="text-red-500">*</span>}
                </label>
                <input
                  placeholder={`Enter ${val?.feature_category_name}`}
                  type={val?.input_type?.includes('text') ? 'text' : 'number'}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  onChange={e => {
                    const value = e.currentTarget.value ?? 'EMPTY'
                    const categoryId = val?.feature_category_id
                    const groupId = val?.feature_group_id
                    const inputType = val?.input_type

                    // Prepare new payload array (or merge with existing state)
                    let newData: FeaturePayloadDTO[] = []

                    // Ensure we have a safe array to work with for existing data
                    const existingData = inputFeatureData ?? []

                    if (inputType?.includes('text')) {
                      const existingIndex = existingData.findIndex(fin => fin.feature_category_id === categoryId)

                      if (existingIndex >= 0) {
                        // EDIT case: update existing
                        const existing = existingData[existingIndex]
                        // Create updated entry (avoid mutating original state directly)
                        if (value === 'EMPTY' || !value || value === '') {
                          newData = existingData.filter((item, idx) => !(idx === existingIndex))
                        } else {
                          newData = existingData.map((item, idx) =>
                            idx === existingIndex
                              ? new FeaturePayloadDTO({
                                  feature_category_id: item.feature_category_id,
                                  feature_group_id: item.feature_group_id,
                                  value_text: value,
                                  is_mandator: item.is_mandator,
                                })
                              : item,
                          )
                        }
                      } else {
                        // ADD case: no existing entry
                        newData = [
                          ...existingData,
                          new FeaturePayloadDTO({
                            feature_category_id: categoryId,
                            feature_group_id: groupId,
                            value_text: value,
                            is_mandator: val?.is_mandatory,
                          }),
                        ]
                      }
                    } else if (inputType?.includes('numeric')) {
                      const numberValue = Number.parseInt(value) || 0

                      const existingIndex = existingData.findIndex(fin => fin.feature_category_id === categoryId)

                      if (existingIndex >= 0) {
                        if (value === 'EMPTY' || !value || value === '') {
                          newData = existingData.filter((item, idx) => !(idx === existingIndex))
                        } else {
                          newData = existingData.map((item, idx) =>
                            idx === existingIndex
                              ? new FeaturePayloadDTO({
                                  feature_category_id: item.feature_category_id,
                                  feature_group_id: item.feature_group_id,
                                  value_number: numberValue,
                                  is_mandator: item?.is_mandator,
                                })
                              : item,
                          )
                        }
                      } else {
                        newData = [
                          ...existingData,
                          new FeaturePayloadDTO({
                            feature_category_id: categoryId,
                            feature_group_id: groupId,
                            value_number: numberValue,
                            is_mandator: val?.is_mandatory,
                          }),
                        ]
                      }
                    } else {
                      // Handle other input types, if any
                      newData = existingData
                    }

                    setInputFeatureData(newData)
                    console.log('final values:', newData)
                  }}
                />
              </div>
            )
          } else if (val?.input_type?.includes('boolean')) {
            return (
              <label key={idx} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="localpropertyPhoto.is_primary"
                  // checked={}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="text-gray-800">{val?.feature_category_name}</span>
              </label>
            )
          } else if (val?.input_type?.includes('single_select')) {
            return (
              <div key={idx}>
                <label className="block text-sm font-semibold text-gray-700">
                  {val?.feature_category_name} {val?.is_mandatory && <span className="text-red-500">*</span>}
                </label>
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {val?.options?.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      aria-pressed={values.propertyType === opt.id}
                      onClick={async () => {
                        console.log('is clickiing')

                        const value = opt?.id
                        const categoryId = val?.feature_category_id
                        const groupId = val?.feature_group_id
                        console.log('is clickiing', value, 'sss', categoryId, groupId)

                        if (categoryId == null || value == null) {
                          return
                        }

                        const existingData = inputFeatureData ?? []
                        const existingIndex = existingData.findIndex(fin => fin.feature_category_id === categoryId)

                        let newData: FeaturePayloadDTO[] = []

                        if (existingIndex >= 0) {
                          // EDIT existing entry: set option_ids to single selected id
                          newData = existingData.map((item, idx) =>
                            idx === existingIndex
                              ? new FeaturePayloadDTO({
                                  feature_category_id: item.feature_category_id,
                                  feature_group_id: item.feature_group_id,
                                  option_ids: [value], // single selection
                                  is_mandator: item.is_mandator,
                                })
                              : item,
                          )
                        } else {
                          // ADD new entry
                          newData = [
                            ...existingData,
                            new FeaturePayloadDTO({
                              feature_category_id: categoryId,
                              feature_group_id: groupId,
                              option_ids: [value],
                              is_mandator: val?.is_mandatory,
                            }),
                          ]
                        }

                        setInputFeatureData(newData)
                        console.log('single select newData:', newData)
                      }}
                      className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                        inputFeatureData?.find(fil => fil?.feature_category_id.includes(val.feature_category_id))?.option_ids.includes(opt?.id)
                          ? 'border-[#7B1E1E] bg-red-50 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-sm font-medium">{opt.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )
          } else if (val?.input_type?.includes('multi_select')) {
            return (
              <div key={idx}>
                <label className="block text-sm font-semibold text-gray-700">
                  Property Type <span className="text-red-500">*</span>
                </label>
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {val?.options?.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      aria-pressed={values.propertyType === opt.id}
                      onClick={async () => {
                        console.log('is clickiing')

                        const value = opt?.id
                        const categoryId = val?.feature_category_id
                        const groupId = val?.feature_group_id
                        console.log('is clickiing', value, 'sss', categoryId, groupId)

                        if (categoryId == null || value == null) {
                          return
                        }

                        const existingData = inputFeatureData ?? []
                        const existingIndex = existingData.findIndex(fin => fin.feature_category_id === categoryId)

                        let newData: FeaturePayloadDTO[] = []

                        if (existingIndex >= 0) {
                          newData = existingData.map((item, idx) =>
                            idx === existingIndex
                              ? new FeaturePayloadDTO({
                                  feature_category_id: item.feature_category_id,
                                  feature_group_id: item.feature_group_id,
                                  option_ids: item.option_ids.includes(opt?.id)
                                    ? item.option_ids.filter(ids => !ids.includes(opt?.id))
                                    : [...item.option_ids, value],
                                  is_mandator: item.is_mandator,
                                })
                              : item,
                          )
                        } else {
                          // ADD new entry
                          newData = [
                            ...existingData,
                            new FeaturePayloadDTO({
                              feature_category_id: categoryId,
                              feature_group_id: groupId,
                              option_ids: [value],
                              is_mandator: val?.is_mandatory,
                            }),
                          ]
                        }

                        setInputFeatureData(newData)
                        console.log('single select newData:', newData)
                      }}
                      className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all
                  ${
                    inputFeatureData?.find(fil => fil.feature_category_id.includes(val?.feature_category_id))?.option_ids.includes(opt?.id)
                      ? 'border-[#7B1E1E] bg-red-50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                    >
                      <span className="text-sm font-medium">{opt.name}</span>
                    </button>
                  ))}
                </div>
                {touched.propertyType && errors.propertyType && <p className="text-red-600 text-xs mt-1">{errors.propertyType}</p>}
              </div>
            )
          }

          return <></>
        })}
      </div>
      {/* // SINGLE_SELECT = 'single_select', // MULTI_SELECT = 'multi_select', // NUMERIC = 'numeric', // TEXT = 'text', // BOOLEAN = 'boolean', // UNITS */}
      {/* = 'units' */}
      {/* //  <button
        //       type="button"
        //       key={idx}
        //       onClick={() => toggleFeatureMappingDTO(val?.feature_category_id)}
        //       className={`px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
        //         values?.option_ids?.includes(val?.feature_category_id)
        //           ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
        //           : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
        //       }`}
        //     >
        //       {val.feature_category_name}
        //     </button> */}
      {/* <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Features</h3>

        {showInput ? (
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={customFeature}
              onChange={e => setCustomFeature(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') addCustomFeature()
                if (e.key === 'Escape') {
                  setShowInput(false)
                  setCustomFeature('')
                }
              }}
              placeholder="Enter custom feature"
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              onClick={addCustomFeature}
              disabled={!customFeature.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              Add
            </button>
            <button
              onClick={() => {
                setShowInput(false)
                setCustomFeature('')
              }}
              className="px-4 py-3 border-2 border-gray-200 text-gray-600 rounded-lg hover:border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowInput(true)}
            className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition w-full sm:w-auto"
          >
            <span>Add custom feature</span>
            <div className="ml-auto w-8 h-8 bg-red-600 rounded-md flex items-center justify-center text-white">
              <Plus size={16} />
            </div>
          </button>
        )}
      </div> */}
      {/* {formik?.values?.option_ids?.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-blue-700 text-sm">{formik.values.option_ids.length} amenities selected</div>
      )} */}
    </div>
  )
}
