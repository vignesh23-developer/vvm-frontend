'use client'

import { useRouter } from 'next/navigation'
import FeatureGroupForm, {
  FormValues,
} from '@/components/admin/forms/FeatureGroupForm'
import { appEnpoints } from '@/services/endpoints'
import { postMethod } from '@/services/service'
import toast from 'react-hot-toast'

export default function AddFeatureGroup() {
  const router = useRouter()

  const initialValues: FormValues = {
    name: '',
    icon: '',
    sortOrder: 0,
    isActive: true,
  }

  // ✅ Handle form submission
  const handleSubmit = async (values: FormValues) => {
    console.log('Form values:', values)

    try {
      const payload = {
        name: values.name.trim(),
        icon: values.icon,
        sortOrder: values.sortOrder ?? 0,
        isActive: values.isActive ?? true,
      }

      const response = await postMethod(appEnpoints.createFeatureGroup, payload)

      console.log('API Response:', response.data)

      if (response.data.error) {
        toast.error(response.data.message || 'Failed to create category')
        return
      }

      toast.success('Feature Group created successfully!')

      router.push('/admin/dashboard/feature-group')
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
        <span>Feature Group Master</span>
        <span className="text-gray-400">›</span>
        <span className="font-medium text-gray-700">Add Feature Group</span>
      </div>
      {/* Form Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">
          Add Feature Group
        </h2>

        <FeatureGroupForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          submitLabel="Create Feature Group"
          isEdit={false}
        />
      </div>
    </div>
  )
}
