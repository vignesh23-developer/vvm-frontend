// 'use client'

// import { Formik, Form, FieldArray } from 'formik'
// import * as Yup from 'yup'
// import FormikSelectField from '@/components/ui/Formik/FormikSelectField/FormikSelectField'
// import FormikCheckboxField from '@/components/ui/Formik/FormikCheckboxField/FormikCheckboxField'

// /* ----------------------------------
//    ✅ Interfaces
// ---------------------------------- */
// export interface FeatureMapping {
//   feature_category_id: string
//   feature_category_name: string
//   is_mandatory: boolean
//   is_filterable: boolean
//   sort_order: number
//   is_active: boolean
// }

// export interface FormValues {
//   property_category_id: string
//   property_category_name: string
//   mappings: FeatureMapping[]
// }

// export interface PropertyCategoryMappingFormProps {
//   initialValues: FormValues
//   /** Optional — Change button label dynamically */
//   submitLabel?: string
//   /** Optional — Change button state for add/edit */
//   isEdit?: boolean
//   /** Submit handler */
//   onSubmit: (values: FormValues) => Promise<void>
// }
// /* ----------------------------------
//    ✅ Validation Schema
// ---------------------------------- */
// const propertyMappingSchema = Yup.object({
//   property_category_id: Yup.string().required('Property category is required'),
//   property_category_name: Yup.string().required('Category name is required'),
//   mappings: Yup.array().of(
//     Yup.object().shape({
//       feature_category_id: Yup.string().required(),
//       feature_category_name: Yup.string().required(),
//       is_mandatory: Yup.boolean(),
//       is_filterable: Yup.boolean(),
//       sort_order: Yup.number().required(),
//       is_active: Yup.boolean(),
//     }),
//   ),
// })

// /* ----------------------------------
//    ✅ Property Category Options
// ---------------------------------- */
// const propertyCategoryOptions = [
//   { value: 'flat-apartment', label: 'Flat/Apartment' },
//   { value: 'land-plot', label: 'Land/Plot' },
//   { value: 'independent-house', label: 'Independent House' },
//   { value: 'villa', label: 'Villa' },
// ]

// /* ----------------------------------
//    ✅ Component
// ---------------------------------- */
// export default function PropertyCategoryMappingForm({
//   initialValues,
//   submitLabel,
//   isEdit,
//   onSubmit,
// }: PropertyCategoryMappingFormProps) {
//   return (
//     <Formik
//       initialValues={initialValues}
//       validationSchema={propertyMappingSchema}
//       onSubmit={onSubmit}
//     >
//       {({ values, handleChange, isSubmitting }) => (
//         <Form className="space-y-8">
//           {/* Select Property Category */}
//           <FormikSelectField
//             label="Select Property Category"
//             name="property_category_id"
//             options={propertyCategoryOptions}
//             placeholder="Select category"
//           />

//           {/* Feature Mappings */}
//           <div className="border-t pt-6">
//             <h3 className="text-lg font-semibold text-gray-800 mb-3">
//               Feature Mappings
//             </h3>

//             <FieldArray name="mappings">
//               {({ remove, push }) => (
//                 <div className="space-y-4">
//                   {values.mappings.map((map, index) => (
//                     <div
//                       key={index}
//                       className="border border-gray-200 rounded-lg p-4 bg-gray-50"
//                     >
//                       <div className="grid grid-cols-6 gap-4 items-center">
//                         <div className="col-span-2">
//                           <label className="text-sm font-medium text-gray-700">
//                             Feature Name
//                           </label>
//                           <input
//                             type="text"
//                             name={`mappings[${index}].feature_category_name`}
//                             value={map.feature_category_name}
//                             onChange={handleChange}
//                             className="w-full mt-1 border-gray-300 rounded-md focus:ring-black focus:border-black"
//                           />
//                         </div>

//                         <FormikCheckboxField
//                           label="Mandatory"
//                           name={`mappings[${index}].is_mandatory`}
//                         />
//                         <FormikCheckboxField
//                           label="Filterable"
//                           name={`mappings[${index}].is_filterable`}
//                         />
//                         <FormikCheckboxField
//                           label="Active"
//                           name={`mappings[${index}].is_active`}
//                         />
//                         <button
//                           type="button"
//                           onClick={() => remove(index)}
//                           className="text-red-500 text-sm mt-6"
//                         >
//                           Remove
//                         </button>
//                       </div>
//                     </div>
//                   ))}

//                   <button
//                     type="button"
//                     onClick={() =>
//                       push({
//                         feature_category_id: '',
//                         feature_category_name: '',
//                         is_mandatory: false,
//                         is_filterable: false,
//                         sort_order: values.mappings.length + 1,
//                         is_active: true,
//                       })
//                     }
//                     className="mt-3 px-4 py-2 bg-gray-200 rounded-md text-sm hover:bg-gray-300"
//                   >
//                     + Add Mapping
//                   </button>
//                 </div>
//               )}
//             </FieldArray>
//           </div>

//           {/* Buttons */}
//           <div className="flex justify-end gap-4 pt-6">
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className={`px-6 py-2 rounded-md text-white font-medium ${
//                 isSubmitting
//                   ? 'bg-gray-400 cursor-not-allowed'
//                   : 'bg-black hover:bg-gray-800'
//               }`}
//             >
//               {isSubmitting
//                 ? isEdit
//                   ? 'Updating...'
//                   : 'Creating...'
//                 : submitLabel ||
//                   (isEdit
//                     ? 'Update Property Category Mapping'
//                     : 'Create Property Category Mapping')}
//             </button>
//           </div>
//         </Form>
//       )}
//     </Formik>
//   )
// }
'use client'

import { useState } from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { postMethod } from '@/services/service'
import { appEnpoints } from '@/services/endpoints'
import { ChevronDown, ChevronRight } from 'lucide-react'
import type {
  Feature,
  PropertyCategory,
} from '../../../app/admin/dashboard/category-mappings/add/[id]/page'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'

interface FieldItem {
  name: string
  mandatory?: boolean
  checked: boolean
}

type FieldGroups = Record<'area' | 'building' | 'property', FieldItem[]>

export interface FormValues {
  propertyCategory: string
  features: Feature[]
  fields: FieldGroups
}

interface Props {
  propertyCategory?: PropertyCategory
  features: Feature[]
  onSuccess: () => void
}

const PropertyCategoryMappingForm = ({
  propertyCategory,
  features,
  onSuccess,
}: Props) => {
  const [collapsed, setCollapsed] = useState({
    area: false,
    building: false,
    property: false,
  })

  const toggleCollapse = (key: keyof typeof collapsed) =>
    setCollapsed(prev => ({ ...prev, [key]: !prev[key] }))

  const validationSchema = Yup.object({
    propertyCategory: Yup.string().required('Please select a category'),
  })

  const initialValues: FormValues = {
    propertyCategory: propertyCategory?.name || '',
    features: features,
    fields: {
      area: [
        { name: 'Carpet Area', mandatory: true, checked: true },
        { name: 'Built-up Area', mandatory: false, checked: true },
        { name: 'Plot Area', mandatory: false, checked: false },
      ],
      building: [
        { name: 'Total Floors', mandatory: true, checked: true },
        { name: 'Floor Number', mandatory: true, checked: true },
        { name: 'Monthly Maintenance', mandatory: false, checked: true },
      ],
      property: [
        { name: 'Property Age', checked: true },
        { name: 'Corner Property', checked: false },
        { name: 'Possession Status', checked: true },
      ],
    },
  }

  const handleSubmit = async (values: FormValues, { setSubmitting }: any) => {
    try {
      const response = await postMethod(
        appEnpoints.mapFeaturesToPropertyCategory,
        values,
      )
      if (response.data.error) {
        toast.error(response.data.message || 'Failed to save mapping')
      } else {
        onSuccess()
      }
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, handleChange, isSubmitting }) => (
        <Form>
          {/* Property Category Dropdown */}
          <div className="mb-6 max-w-xs">
            <FormikTextField
              label="Property Category"
              name="propertyCategory"
              placeholder="Enter property category"
              disabled={true}
            />
          </div>

          {/* Features */}
          <div className="mb-8">
            <p className="font-semibold mb-2">
              Uncategorize Features for:{' '}
              <span className="text-gray-600 capitalize">
                {values.propertyCategory}
              </span>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {values.features.map((f, idx) => (
                <div
                  key={f.id}
                  className={`border rounded-md p-4 ${
                    f.active ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                >
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name={`features[${idx}].active`}
                      checked={f.active}
                      onChange={handleChange}
                    />
                    <span className="font-medium">{f.name}</span>
                  </label>
                  <div className="text-sm text-gray-500 mt-1">
                    {f.mandatory ? 'Mandatory' : 'Optional'} •{' '}
                    {f.filterable ? 'Filterable' : 'Non-filterable'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Property Fields */}
          <div className="mb-8">
            <p className="font-semibold mb-4">Categorize</p>
            {(['area', 'building', 'property'] as const).map(section => (
              <div key={section} className="border rounded-md mb-4">
                <button
                  type="button"
                  onClick={() => toggleCollapse(section)}
                  className="w-full flex items-center gap-2 p-3 bg-gray-50 font-medium"
                >
                  {collapsed[section] ? (
                    <ChevronRight size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                  {section === 'area'
                    ? 'Area Fields'
                    : section === 'building'
                    ? 'Building Fields'
                    : 'Property Details'}
                </button>
                {!collapsed[section] && (
                  <div className="p-4 space-y-2">
                    {values.fields[section].map((f, i) => (
                      <label key={i} className="flex items-center space-x-2">
                        <Field
                          type="checkbox"
                          name={`fields.${section}[${i}].checked`}
                        />
                        <span>
                          {f.name}{' '}
                          {f.mandatory !== undefined && (
                            <span className="text-gray-500 text-sm">
                              ({f.mandatory ? 'Mandatory' : 'Optional'})
                            </span>
                          )}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Save */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700 cursor-pointer text-white px-5 py-2 rounded-md flex items-center gap-2"
            >
              💾 {isSubmitting ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default PropertyCategoryMappingForm
