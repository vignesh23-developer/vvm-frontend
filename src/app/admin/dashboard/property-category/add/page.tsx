'use client'

import { useRouter } from 'next/navigation'
import PropertyCategoryForm, {
  FormValues,
} from '@/components/admin/forms/PropertyCategoryForm'
import { appEnpoints } from '@/services/endpoints'
import { postMethod } from '@/services/service'
import toast from 'react-hot-toast'

export default function AddPropertyCategory() {
  const router = useRouter()

  const initialValues: FormValues = {
    name: '',
    description: '',
    sortOrder: 0,
    isActive: true,
  }

  // ✅ Handle form submission
  const handleSubmit = async (values: FormValues) => {
    console.log('Form values:', values)

    try {
      const payload = {
        name: values.name.trim(),
        description: values.description?.trim(),
        sortOrder: values.sortOrder ?? 0,
        isActive: values.isActive ?? true,
      }

      console.log('Submitting payload:', payload)

      const response = await postMethod(
        appEnpoints.createPropertyCategory,
        payload,
      )

      console.log('API Response:', response.data)

      if (response.data.error) {
        toast.error(response.data.message || 'Failed to create category')
        return
      }

      toast.success('Property category created successfully!')

      router.push('/admin/dashboard/property-category')
    } catch (error: any) {
      console.error('Create failed:', error)
      toast.error(error?.message || 'Something went wrong!')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <span>Dashboard</span>
        <span className="text-gray-400">›</span>
        <span>Property Category Master</span>
        <span className="text-gray-400">›</span>
        <span className="font-medium text-gray-700">Add Property Category</span>
      </div>
      {/* Form Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">
          Add Property Category
        </h2>

        <PropertyCategoryForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          submitLabel="Create Property Category"
          isEdit={false}
        />
      </div>
    </div>
  )
}
