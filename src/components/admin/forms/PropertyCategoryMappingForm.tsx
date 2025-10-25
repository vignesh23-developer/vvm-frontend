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
      console.log('Submitting values:', values)

      const payLoad = {
        property_category_id: propertyCategory?.id,
        property_category_name: values.propertyCategory,
        mappings: values.features
          .filter(f => f.active === true)
          .map(f => ({
            feature_category_id: f.id,
            feature_category_name: f.name,
            is_mandatory: f.mandatory,
            is_filterable: f.filterable,
            sort_order: f.sortOrder || 0,
            is_active: f.active,
          })),
        // fields: {
        //   area: values.fields.area
        //     .filter(f => f.checked === true)
        //     .map(f => ({
        //       name: f.name,
        //       mandatory: f.mandatory,
        //       checked: f.checked,
        //     })),
        //   building: values.fields.building
        //     .filter(f => f.checked === true)
        //     .map(f => ({
        //       name: f.name,
        //       mandatory: f.mandatory,
        //       checked: f.checked,
        //     })),
        //   property: values.fields.property
        //     .filter(f => f.checked === true)
        //     .map(f => ({ name: f.name, checked: f.checked })),
        // },
      }

      const response = await postMethod(
        appEnpoints.mapFeaturesToPropertyCategory,
        payLoad,
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
              className="bg-[#7B1E1E] hover:bg-[#641717] cursor-pointer text-white px-5 py-2 rounded-md flex items-center gap-2"
            >
              {isSubmitting ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default PropertyCategoryMappingForm
