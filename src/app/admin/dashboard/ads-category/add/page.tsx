'use client'

import { useRouter } from 'next/navigation'
import AdsCategoryForm, { FormValues } from '@/app/admin/dashboard/ads-category/(forms)/adsCategoryForm'
import { appEndpoints } from '@/services/endpoints'
import { postMethod } from '@/services/service'
import toast from 'react-hot-toast'
import { ResponseDTO } from '@/components/dto/response_dto'

export default function AddAdsCategory() {
  const router = useRouter()

  const initialValues: FormValues = {
    name: '',
    icon: '',
    description: '',
    sortOrder: 0,
    isActive: true,
  }

  // ✅ Handle form submission
  const handleSubmit = async (values: FormValues) => {
    try {
      const payload: Record<string, any> = {
        name: values.name.trim(),
        description: values.description?.trim(),
        sortOrder: values.sortOrder ?? 0,
        isActive: values.isActive ?? true,
      }

      if (values.icon) {
        payload.icon = values.icon
      }

      const response: ResponseDTO = await postMethod(appEndpoints.createAdsCategory, payload)

      if (response?.data?.error) {
        toast.error(response?.data?.message || 'Failed to create category')
        return
      }

      toast.success('Ads category created successfully!')

      router.push('/admin/dashboard/ads-category')
    } catch (error: any) {
      console.error('Create failed:', error)
      toast.error(error?.message || 'Something went wrong!')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Form Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">Add Ads Category</h2>

        <AdsCategoryForm initialValues={initialValues} onSubmit={handleSubmit} submitLabel="Create Ads Category" isEdit={false} />
      </div>
    </div>
  )
}
