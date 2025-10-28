'use client'

import { useRouter } from 'next/navigation'
import FeatureCategoryForm, {
  FeatureCategory,
} from '@/components/admin/forms/FeatureCategoryForm'
import { postMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'
import toast from 'react-hot-toast'

export default function AddFeatureCategory() {
  const router = useRouter()

  const initialValues: FeatureCategory = {
    code: '',
    name: '',
    description: '',
    featureGroupId: '',
    inputType: '',
    isFilterable: false,
    isMandatory: false,
    sortOrder: 1,
    options: [{ name: '', value: '', icon: '', sortOrder: 1, isActive: true }],
  }

  // ✅ Handle form submit
  const handleSubmit = async (values: FeatureCategory) => {
    try {
      // ✅ Prepare payload
      const payload = {
        ...values,
        options:
          values.inputType === 'text' ||
          values.inputType === 'numeric' ||
          values.inputType === 'boolean' ||
          values.inputType === 'units'
            ? [] // No options for text/number types
            : values.options.map(opt => ({
                name: opt.name,
                value: opt.name, // fallback if value not set
                icon: opt.icon || '',
                sortOrder: opt.sortOrder,
                isActive: opt.isActive,
              })),
      }

      // ✅ API call using your helper
      const res = await postMethod<FeatureCategory>(
        appEndpoints.createFeatureCategory,
        payload,
      )

      if (res.error) {
        console.error('Failed to create feature category:', res.message)
        toast.error(res.message || 'Failed to create feature category')
        return
      }
      toast.success('Feature category created successfully!')

      // ✅ Redirect to listing page
      router.push('/admin/dashboard/feature-category')
    } catch (error) {
      console.error('Submit error:', error)
      toast.error('Something went wrong while creating feature category')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Form Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">
          Add Feature Category
        </h2>

        <FeatureCategoryForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          submitLabel="Create Feature Category"
          isEdit={false}
        />
      </div>
    </div>
  )
}
