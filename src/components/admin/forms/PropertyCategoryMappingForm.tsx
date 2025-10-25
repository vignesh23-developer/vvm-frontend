'use client'

import { Formik, Form, FieldArray } from 'formik'
import * as Yup from 'yup'
import FormikSelectField from '@/components/ui/Formik/FormikSelectField/FormikSelectField'
import FormikCheckboxField from '@/components/ui/Formik/FormikCheckboxField/FormikCheckboxField'

/* ----------------------------------
   ✅ Interfaces
---------------------------------- */
export interface FeatureMapping {
  feature_category_id: string
  feature_category_name: string
  is_mandatory: boolean
  is_filterable: boolean
  sort_order: number
  is_active: boolean
}

export interface FormValues {
  property_category_id: string
  property_category_name: string
  mappings: FeatureMapping[]
}

export interface PropertyCategoryMappingFormProps {
  initialValues: FormValues
  /** Optional — Change button label dynamically */
  submitLabel?: string
  /** Optional — Change button state for add/edit */
  isEdit?: boolean
  /** Submit handler */
  onSubmit: (values: FormValues) => Promise<void>
}
/* ----------------------------------
   ✅ Validation Schema
---------------------------------- */
const propertyMappingSchema = Yup.object({
  property_category_id: Yup.string().required('Property category is required'),
  property_category_name: Yup.string().required('Category name is required'),
  mappings: Yup.array().of(
    Yup.object().shape({
      feature_category_id: Yup.string().required(),
      feature_category_name: Yup.string().required(),
      is_mandatory: Yup.boolean(),
      is_filterable: Yup.boolean(),
      sort_order: Yup.number().required(),
      is_active: Yup.boolean(),
    }),
  ),
})

/* ----------------------------------
   ✅ Property Category Options
---------------------------------- */
const propertyCategoryOptions = [
  { value: 'flat-apartment', label: 'Flat/Apartment' },
  { value: 'land-plot', label: 'Land/Plot' },
  { value: 'independent-house', label: 'Independent House' },
  { value: 'villa', label: 'Villa' },
]

/* ----------------------------------
   ✅ Component
---------------------------------- */
export default function PropertyCategoryMappingForm({
  initialValues,
  submitLabel,
  isEdit,
  onSubmit,
}: PropertyCategoryMappingFormProps) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={propertyMappingSchema}
      onSubmit={onSubmit}
    >
      {({ values, handleChange, isSubmitting }) => (
        <Form className="space-y-8">
          {/* Select Property Category */}
          <FormikSelectField
            label="Select Property Category"
            name="property_category_id"
            options={propertyCategoryOptions}
            placeholder="Select category"
          />

          {/* Feature Mappings */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Feature Mappings
            </h3>

            <FieldArray name="mappings">
              {({ remove, push }) => (
                <div className="space-y-4">
                  {values.mappings.map((map, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                    >
                      <div className="grid grid-cols-6 gap-4 items-center">
                        <div className="col-span-2">
                          <label className="text-sm font-medium text-gray-700">
                            Feature Name
                          </label>
                          <input
                            type="text"
                            name={`mappings[${index}].feature_category_name`}
                            value={map.feature_category_name}
                            onChange={handleChange}
                            className="w-full mt-1 border-gray-300 rounded-md focus:ring-black focus:border-black"
                          />
                        </div>

                        <FormikCheckboxField
                          label="Mandatory"
                          name={`mappings[${index}].is_mandatory`}
                        />
                        <FormikCheckboxField
                          label="Filterable"
                          name={`mappings[${index}].is_filterable`}
                        />
                        <FormikCheckboxField
                          label="Active"
                          name={`mappings[${index}].is_active`}
                        />
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="text-red-500 text-sm mt-6"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() =>
                      push({
                        feature_category_id: '',
                        feature_category_name: '',
                        is_mandatory: false,
                        is_filterable: false,
                        sort_order: values.mappings.length + 1,
                        is_active: true,
                      })
                    }
                    className="mt-3 px-4 py-2 bg-gray-200 rounded-md text-sm hover:bg-gray-300"
                  >
                    + Add Mapping
                  </button>
                </div>
              )}
            </FieldArray>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 rounded-md text-white font-medium ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-black hover:bg-gray-800'
              }`}
            >
              {isSubmitting
                ? isEdit
                  ? 'Updating...'
                  : 'Creating...'
                : submitLabel ||
                  (isEdit
                    ? 'Update Property Category Mapping'
                    : 'Create Property Category Mapping')}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}
