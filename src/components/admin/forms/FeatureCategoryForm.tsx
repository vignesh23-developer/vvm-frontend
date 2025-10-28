'use client'

import { Formik, Form, FieldArray } from 'formik'
import { Trash2, GripVertical } from 'lucide-react'
import { useRouter } from 'next/navigation'
import * as Yup from 'yup'
import useSWR from 'swr'
import { useState } from 'react'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'
import FormikCheckboxField from '@/components/ui/Formik/FormikCheckboxField/FormikCheckboxField'
import FormikSelectField from '@/components/ui/Formik/FormikSelectField/FormikSelectField'
import { getMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'
import FormikIconPickerField from '@/components/ui/Formik/FormikIconPickerField/FormikIconPickerField'

/* ================================
   ✅ Interfaces
================================== */
export interface FeatureOption {
  id?: number
  name: string
  value: string
  icon: string
  sortOrder: number
  isActive: boolean
  featureCategoryId?: string
}

export interface FeatureCategory {
  id?: number
  code: string
  name: string
  description?: string
  featureGroupId?: string
  featureGroupName?: string
  featureGroupSortOrder?: string
  inputType:
    | 'single_select'
    | 'multi_select'
    | 'text'
    | 'numeric'
    | 'boolean'
    | 'units'
    | string
  isFilterable: boolean
  isMandatory: boolean
  sortOrder: number
  options: FeatureOption[] // Always required as array
}

export interface FeatureGroup {
  id: string
  name: string
}

const validationSchema = Yup.object({
  code: Yup.string().required('Code is required'),
  name: Yup.string().required('Name is required'),
  inputType: Yup.string().required('Input type is required'),
  // options: Yup.array()
  //   .of(
  //     Yup.object({
  //       name: Yup.string().required('Option name is required'),
  //       value: Yup.string().required('Option value is required'),
  //       sortOrder: Yup.number().required('Sort order is required'),
  //       isActive: Yup.boolean(),
  //     }),
  //   )
  //   .min(1, 'At least one option is required'),
})

export interface FeatureCategoryFormProps {
  initialValues: FeatureCategory
  onSubmit: (values: FeatureCategory) => Promise<void>
  submitLabel?: string
  isEdit?: boolean
}

const ensureOptionsArray = (
  options: FeatureOption[] | undefined | null,
): FeatureOption[] => {
  if (options === null || options === undefined) {
    return []
  }

  if (!Array.isArray(options)) {
    return []
  }

  return options
}

const createSafeInitialValues = (
  initialValues: FeatureCategoryFormProps['initialValues'],
): FeatureCategory => {
  const safeValues: FeatureCategory = {
    id: initialValues.id,
    code: initialValues.code || '',
    name: initialValues.name || '',
    description: initialValues.description || '',
    featureGroupId: initialValues.featureGroupId || '',
    inputType: initialValues.inputType || '',
    isFilterable: initialValues.isFilterable || false,
    isMandatory: initialValues.isMandatory || false,
    sortOrder: initialValues.sortOrder || 1,
    options: ensureOptionsArray(initialValues.options),
  }

  return safeValues
}

export default function FeatureCategoryForm({
  initialValues,
  onSubmit,
  submitLabel,
  isEdit = false,
}: FeatureCategoryFormProps) {
  const router = useRouter()

  // Ensure options is always an array using factory function
  const safeInitialValues = createSafeInitialValues(initialValues)

  // Drag and drop state - moved to component level
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  // Drag handlers - moved to component level
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  // Fetcher using our generic API helper
  const fetcher = async (url: string): Promise<FeatureGroup[]> => {
    try {
      const response = await getMethod<FeatureGroup[]>(url)
      console.log('Fetched feature group ResponseDTO:', response)

      if (response.error) {
        console.error(
          'API error while fetching feature groups:',
          response.message,
        )
        return []
      }

      // Safe extraction of data
      if (Array.isArray(response.data)) {
        return response.data
      }

      console.warn('Unexpected data format:', response.data)
      return []
    } catch (error) {
      console.error('Failed to fetch feature groups:', error)
      return []
    }
  }

  // ✅ Fetch Feature Groups
  const {
    data: featureGroups,
    error: groupError,
    isLoading,
  } = useSWR<FeatureGroup[]>(
    `${appEndpoints.getAllFeatureGroups}?activeOnly=true`,
    fetcher,
  )

  const featureGroupOptions =
    featureGroups?.map(group => ({
      value: group.id,
      label: group.name,
    })) || []

  const inputTypeOptions = [
    { value: 'single_select', label: 'Single Select' },
    { value: 'multi_select', label: 'Multi Select' },
    { value: 'text', label: 'Text' },
    { value: 'numeric', label: 'Numeric' },
    { value: 'boolean', label: 'Boolean' },
    { value: 'units', label: 'Units' },
  ]

  return (
    <Formik
      initialValues={safeInitialValues}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={onSubmit}
    >
      {({ values, isSubmitting }) => {
        // Additional safety check - if values is not properly initialized, show loading
        if (!values) {
          return (
            <div className="space-y-6">
              <div className="text-center py-8">
                <p className="text-gray-500">Loading form...</p>
              </div>
            </div>
          )
        }

        return (
          <Form className="space-y-6">
            {/* --- Basic Info --- */}

            <FormikTextField
              label="Code *"
              name="code"
              placeholder="e.g. BHK, CONFIG, TYPE"
              className="w-full border-0 bg-gray-100 rounded-md px-4 py-3"
            />

            <FormikTextField
              label="Feature Category Name *"
              name="name"
              placeholder="Enter feature category name"
              className="w-full border-0 bg-gray-100 rounded-md px-4 py-3"
            />

            <FormikTextField
              label="Description"
              name="description"
              as="textarea"
              placeholder="Enter description"
              className="w-full border-0 bg-gray-100 rounded-md px-4 py-3 h-36"
            />

            {/* ✅ Feature Group Select */}
            <FormikSelectField
              label="Feature Group"
              name="featureGroupId"
              options={featureGroupOptions}
              placeholder={
                isLoading
                  ? 'Loading...'
                  : groupError
                  ? 'Failed to load groups'
                  : 'Select a feature group'
              }
            />

            {/* Input Type */}
            <FormikSelectField
              label="Input Type"
              name="inputType"
              options={inputTypeOptions}
              placeholder="Select input type"
            />

            <FormikTextField
              label="Sort Order"
              name="sortOrder"
              type="number"
              placeholder="Enter sort order"
              className="w-full border-0 bg-gray-100 rounded-md px-4 py-3"
            />
            {!isEdit && (
              <>
                <FormikCheckboxField label="Filterable" name="isFilterable" />
                <FormikCheckboxField label="Mandatory" name="isMandatory" />
              </>
            )}

            {/* --- Dynamic Options Section --- */}
            {values &&
              values.options &&
              Array.isArray(values.options) &&
              (values.inputType === 'single_select' ||
                values.inputType === 'multi_select') && (
                <div className="border-t pt-6">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Feature Options
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Define the available options for this feature. Drag to
                      reorder.
                    </p>
                  </div>

                  <FieldArray name="options">
                    {({ push, remove, move }) => {
                      // Triple-check safety
                      if (
                        !values ||
                        !values.options ||
                        !Array.isArray(values.options)
                      ) {
                        return (
                          <div className="text-red-500 p-4 border border-red-200 rounded">
                            Error: Invalid form data structure. Please refresh
                            the page.
                          </div>
                        )
                      }

                      const optionsArray = values.options

                      // Handle drop logic
                      const handleDrop = (
                        e: React.DragEvent,
                        dropIndex: number,
                      ) => {
                        e.preventDefault()
                        if (
                          draggedIndex !== null &&
                          draggedIndex !== dropIndex
                        ) {
                          // Use Formik's move function to reorder items
                          move(draggedIndex, dropIndex)

                          // Update sort orders
                          setTimeout(() => {
                            optionsArray.forEach((_, idx) => {
                              values.options[idx].sortOrder = idx + 1
                            })
                          }, 0)
                        }
                        setDraggedIndex(null)
                      }

                      return (
                        <div className="space-y-3">
                          {/* Options Counter */}
                          <div className="flex justify-between items-center mb-4">
                            <div className="bg-gray-100 px-3 py-1 rounded-full">
                              <span className="text-xs font-medium text-gray-700">
                                {optionsArray.length} option
                                {optionsArray.length !== 1 ? 's' : ''}
                              </span>
                            </div>
                            {optionsArray.length > 0 && (
                              <p className="text-xs text-gray-600">
                                💡 Tip: Drag the grip handle to reorder options
                              </p>
                            )}
                          </div>

                          {/* Options List or Empty State */}
                          {optionsArray.length > 0 ? (
                            optionsArray.map((option, index) => (
                              <div
                                key={index}
                                draggable
                                onDragStart={e => handleDragStart(e, index)}
                                onDragOver={handleDragOver}
                                onDrop={e => handleDrop(e, index)}
                                onDragEnd={handleDragEnd}
                                className={`
                          flex items-center gap-4 border-2 p-4 rounded-lg transition-all duration-200
                          ${
                            draggedIndex === index
                              ? 'bg-gray-50 border-gray-400 shadow-lg scale-105'
                              : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                          }
                          cursor-move group
                        `}
                              >
                                {/* Drag Handle */}
                                <div className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                  <GripVertical size={20} />
                                </div>

                                {/* Order Number */}
                                <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-700">
                                  {index + 1}
                                </div>

                                {/* Option Name */}
                                <div className="flex-grow min-w-0">
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Option Name *
                                  </label>
                                  <FormikTextField
                                    label=""
                                    name={`options[${index}].name`}
                                    placeholder="Enter option name (e.g., 1 BHK, 2 BHK, Villa)"
                                    className="w-full border-0 bg-gray-100 rounded-md px-4 py-3"
                                  />
                                </div>

                                {/* Icon Picker */}
                                <div className="w-80">
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Choose an Icon
                                  </label>
                                  <FormikIconPickerField
                                    name={`options[${index}].icon`}
                                    label=""
                                    helpText=""
                                    placeholder="Select an icon"
                                    className="w-full"
                                  />
                                </div>

                                {/* Delete Button */}
                                <div className="flex-shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      remove(index)
                                      // Update sort orders after removal
                                      setTimeout(() => {
                                        values.options.forEach((_, idx) => {
                                          values.options[idx].sortOrder =
                                            idx + 1
                                        })
                                      }, 0)
                                    }}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors group"
                                    title="Remove option"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </div>
                            ))
                          ) : (
                            /* Empty State */
                            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                              <div className="max-w-sm mx-auto">
                                <svg
                                  className="w-12 h-12 mx-auto text-gray-400 mb-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1}
                                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                  />
                                </svg>
                                <h4 className="text-lg font-medium text-gray-600 mb-2">
                                  No options yet
                                </h4>
                                <p className="text-sm text-gray-500">
                                  Add your first option to get started. You can
                                  drag to reorder them later.
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Add Option Button */}
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 hover:bg-gray-50 transition-colors">
                            <button
                              type="button"
                              onClick={() =>
                                push({
                                  name: '',
                                  value: '',
                                  icon: '',
                                  sortOrder: optionsArray.length + 1,
                                  isActive: true,
                                })
                              }
                              className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors font-medium"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                              </svg>
                              Add New Option
                            </button>
                            <p className="mt-2 text-sm text-gray-600">
                              Drag to reorder • Options are automatically
                              activated
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Examples: "1 BHK", "2 BHK", "Villa", "Apartment"
                              or "North", "South", "East", "West"
                            </p>
                          </div>
                        </div>
                      )
                    }}
                  </FieldArray>
                </div>
              )}

            {/* --- Action Buttons --- */}
            <div className="flex justify-end gap-4 pt-6">
              <button
                type="button"
                onClick={() => router.push('/admin/dashboard/feature-category')}
                className="px-6 py-2 rounded-md bg-gray-200 hover:bg-gray-300 cursor-pointer text-gray-800 font-medium transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 rounded-md text-white font-medium transition ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-black hover:bg-gray-800 cursor-pointer'
                }`}
              >
                {isSubmitting
                  ? isEdit
                    ? 'Updating...'
                    : 'Creating...'
                  : submitLabel ||
                    (isEdit
                      ? 'Update Feature Category'
                      : 'Create Feature Category')}
              </button>
            </div>
          </Form>
        )
      }}
    </Formik>
  )
}
