'use client'

import { useRouter } from 'next/navigation'
import FeatureGroupForm from '@/app/admin/dashboard/(master)/feature-group/(forms)/FeatureGroupForm'
import { FormValues } from '@/app/admin/dashboard/(master)/feature-group/(dto)/FeatureGroupType'
import { appEndpoints } from '@/services/endpoints'
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
    try {
      const payload = {
        name: values.name.trim(),
        icon: values.icon,
        sortOrder: values.sortOrder ?? 0,
        isActive: values.isActive ?? true,
      }

      const response = await postMethod(appEndpoints.createFeatureGroup, payload)

      toast.success('Feature Group created successfully!')

      router.push('/admin/dashboard/feature-group')
    } catch (error: any) {
      console.error('Create failed:', error)
      toast.error(error?.message || 'Something went wrong!')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Form Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">Add Feature Group</h2>

        <FeatureGroupForm initialValues={initialValues} onSubmit={handleSubmit} submitLabel="Create Feature Group" isEdit={false} />
      </div>
    </div>
  )
}
