'use client'

import { useState } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { ChevronDown, ChevronRight, Check } from 'lucide-react'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'
import { patchMethod, postMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'
import type {
  PropertyCategory,
  FeatureGroup,
} from '../../../app/admin/dashboard/category-mappings/add/[id]/page'
import Button from '../../ui/CustomComponent/Button/Button'

export interface FormValues {
  propertyCategory: string
  featuresGrouped: FeatureGroup[]
}

interface Props {
  propertyCategory?: PropertyCategory
  featuresGrouped: FeatureGroup[]
  onSuccess: () => void
}

const PropertyCategoryMappingForm = ({
  propertyCategory,
  featuresGrouped,
  onSuccess,
}: Props) => {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const toggleCollapse = (id: string) =>
    setCollapsed(prev => ({ ...prev, [id]: !prev[id] }))

  const initialValues: FormValues = {
    propertyCategory: propertyCategory?.property_category_name || '',
    featuresGrouped,
  }

  const validationSchema = Yup.object({
    propertyCategory: Yup.string().required('Please select a category'),
  })

  const handleSubmit = async (values: FormValues, { setSubmitting }: any) => {
    try {
      // Ensure propertyCategory exists before accessing its properties
      if (!propertyCategory) {
        toast.error('Property category not found')
        return
      }

      // Prepare payload
      const payload = {
        property_category_id: propertyCategory.property_category_id,
        property_category_name: values.propertyCategory,
        mappings:
          values.featuresGrouped
            ?.flatMap(group => group.features || [])
            .filter(feature => feature.isMapped)
            .map(feature => ({
              feature_category_id: feature.id,
              feature_category_name: feature.name,
              is_mandatory: !!feature.isMandatory,
              is_filterable: !!feature.isFilterable,
              sort_order: feature.sortOrder ?? 0,
              is_active: true, // You’re already filtering by isMapped
            })) ?? [],
      }

      if (!payload.mappings.length) {
        toast.error('Please select at least one feature to map')
        return
      }

      // Determine if it's an update or a new mapping
      const isUpdate = propertyCategory?.mappings?.length > 0

      const response = await (isUpdate
        ? patchMethod(
            appEndpoints.updatePropertyCategoryFeatureMapping,
            false,
            payload,
          )
        : postMethod(appEndpoints.mapFeaturesToPropertyCategory, payload))

      // Validate response
      if (response?.data?.error) {
        toast.error(response.data.message || 'Failed to save mapping')
      } else {
        toast.success('Mapping saved successfully')
        onSuccess?.() // Use optional chaining in case onSuccess is undefined
      }
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  const FeatureButton = ({
    groupIdx,
    featureIdx,
    f,
    values,
    setFieldValue,
  }: any) => {
    const fieldPath = `featuresGrouped[${groupIdx}].features[${featureIdx}].isMapped`
    const isSelected =
      values.featuresGrouped[groupIdx].features[featureIdx].isMapped

    const toggle = () => setFieldValue(fieldPath, !isSelected)

    return (
      <button
        type="button"
        onClick={toggle}
        className={`border rounded-lg p-4 text-left transition-all duration-150 hover:cursor-pointer ${
          isSelected
            ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="font-medium">{f.name}</span>
          {isSelected && <Check size={18} className="text-blue-600" />}
        </div>
        <p className="text-sm text-gray-500">
          {f.isMandatory ? 'Mandatory' : 'Optional'} •{' '}
          {f.isFilterable ? 'Filterable' : 'Non-filterable'}
        </p>
      </button>
    )
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, setFieldValue, isSubmitting }) => (
        <Form>
          {/* Property Category */}
          <div className="mb-6 max-w-xs">
            <FormikTextField
              label="Property Category"
              name="propertyCategory"
              placeholder="Enter property category"
              disabled
            />
          </div>

          {values.featuresGrouped.map((group, gIdx) => {
            if (group.featureGroupId === 'uncategorized') {
              return (
                <div key={group.featureGroupId} className="mb-8">
                  <p className="font-semibold mb-2">Uncategorized Features</p>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {group.features.map((f, i) => (
                      <FeatureButton
                        key={f.id}
                        groupIdx={gIdx} // ✅ correct index from Formik values
                        featureIdx={i}
                        f={f}
                        values={values}
                        setFieldValue={setFieldValue}
                      />
                    ))}
                  </div>
                </div>
              )
            }

            // categorized groups
            return (
              <div key={group.featureGroupId} className="mb-8">
                <button
                  type="button"
                  onClick={() =>
                    toggleCollapse(group.featureGroupId.toString())
                  }
                  className="flex items-center gap-2 bg-gray-100 p-3 w-full text-left font-semibold rounded-md"
                >
                  {collapsed[group.featureGroupId] ? (
                    <ChevronRight size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                  {group.featureGroupName}
                </button>

                {!collapsed[group.featureGroupId] && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-3">
                    {group.features.map((f, i) => (
                      <FeatureButton
                        key={f.id}
                        groupIdx={gIdx} // ✅ correct index
                        featureIdx={i}
                        f={f}
                        values={values}
                        setFieldValue={setFieldValue}
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          })}

          {/* Submit */}
          <div className="flex justify-end mt-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              onClick={() => {}}
              className="bg-[#7B1E1E] hover:bg-[#641717] cursor-pointer text-white px-5 py-2 rounded-md"
            >
              {isSubmitting ? 'Saving...' : 'Save Configuration'}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default PropertyCategoryMappingForm
