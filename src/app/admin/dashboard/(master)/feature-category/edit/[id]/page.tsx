'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import FeatureCategoryForm, {
  FeatureCategory,
} from '@/components/admin/forms/FeatureCategoryForm'
import { getMethod, patchMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'
import toast from 'react-hot-toast'

export default function EditFeatureCategory() {
  const router = useRouter()
  const { id } = useParams()
  const [initialValues, setInitialValues] = useState<FeatureCategory | null>(
    null,
  )
  const [loading, setLoading] = useState(true)

  // ✅ Fetch existing feature category
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await getMethod(
          `${appEndpoints.getFeatureCategoryByID(id as string)}`,
        )
        if (res.error) {
          toast.error(res.message || 'Failed to load feature category')
          return
        }

        const data = res.data
        // Ensure safe structure
        setInitialValues({
          id: data.id,
          code: data.code || '',
          name: data.name || '',
          description: data.description || '',
          featureGroupId: data.featureGroupId || '',
          featureGroupName: data.featureGroupName || '',
          featureGroupSortOrder: data.featureGroupSortOrder || '',
          inputType: data.inputType || 'single_select',
          isFilterable: data.isFilterable ?? false,
          isMandatory: data.isMandatory ?? false,
          sortOrder: data.sortOrder || 1,
          options:
            data.options && data.options.length > 0
              ? data.options.map((opt: any) => ({
                  id: opt.id,
                  name: opt.name,
                  value: opt.name,
                  icon: opt.icon || '',
                  sortOrder: opt.sortOrder,
                  isActive: opt.isActive,
                }))
              : [
                  {
                    name: '',
                    value: '',
                    icon: '',
                    sortOrder: 1,
                    isActive: true,
                  },
                ],
        })
      } catch (error) {
        console.error('Fetch error:', error)
        toast.error('Error fetching feature category')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchCategory()
  }, [id])

  // ✅ Handle form submit (UPDATE)
  const handleSubmit = async (values: FeatureCategory) => {
    try {
      const payload = {
        name: values.name,
        inputType: values.inputType,
        isFilterable: values.isFilterable,
        isMandatory: values.isMandatory,
        sortOrder: values.sortOrder,
        description: values.description,
        featureGroupId: values.featureGroupId,
        options:
          values.inputType === 'text' || values.inputType === 'number'
            ? []
            : values.options.map(opt => ({
                id: opt.id,
                name: opt.name,
                value: opt.name,
                icon: opt.icon || '',
                sortOrder: opt.sortOrder,
                isActive: opt.isActive,
              })),
      }

      const res = await patchMethod<FeatureCategory>(
        `${appEndpoints.updateFeatureCategory(id as string)}/with-options`,
        false,
        payload,
      )

      if (res.error) {
        toast.error(res.message || 'Failed to update feature category')
        return
      }

      toast.success('Feature category updated successfully!')
      router.push('/admin/dashboard/feature-category')
    } catch (error) {
      console.error('Update error:', error)
      toast.error('Something went wrong while updating feature category')
    }
  }

  if (loading) return <p className="text-center mt-10">Loading...</p>

  if (!initialValues)
    return <p className="text-center mt-10 text-red-500">Category not found</p>

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Form Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">
          Edit Feature Category
        </h2>

        <FeatureCategoryForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          submitLabel="Update Feature Category"
          isEdit={true}
        />
      </div>
    </div>
  )
}
