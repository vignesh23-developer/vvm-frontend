'use client'

import { useRouter } from 'next/navigation'
import PropertyCategoryForm, { FormValues } from '@/app/admin/dashboard/(master)/property-category/(forms)/PropertyCategoryForm'
import { appEndpoints } from '@/services/endpoints'
import { postMethod } from '@/services/service'
import toast from 'react-hot-toast'
import { ResponseDTO } from '@/components/dto/response_dto'

export default function AddPropertyCategory() {
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
      const payload = {
        name: values.name.trim(),
        icon: values.icon,
        description: values.description?.trim(),
        sortOrder: values.sortOrder ?? 0,
        isActive: values.isActive ?? true,
      }

      const response: ResponseDTO = await postMethod(appEndpoints.createPropertyCategory, payload)

      if (response?.data?.error) {
        toast.error(response?.data?.message || 'Failed to create category')
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
      {/* Form Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">Add Property Category</h2>

        <PropertyCategoryForm initialValues={initialValues} onSubmit={handleSubmit} submitLabel="Create Property Category" isEdit={false} />
      </div>
    </div>
  )
}
