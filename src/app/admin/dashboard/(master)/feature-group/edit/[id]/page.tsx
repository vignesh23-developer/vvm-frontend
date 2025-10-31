'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { appEndpoints } from '@/services/endpoints'
import { getMethod, patchMethod } from '@/services/service'
import FeatureGroupForm, {
  FormValues,
} from '@/components/admin/forms/FeatureGroupForm'
import toast from 'react-hot-toast'

export default function EditFeatureGroup() {
  const router = useRouter()
  const params = useParams()
  const { id } = params

  const [initialValues, setInitialValues] = useState<FormValues | null>(null)
  const [loading, setLoading] = useState(true)

  /** 🔹 Fetch existing category data */
  useEffect(() => {
    const fetchFeatureGroup = async () => {
      try {
        const response = await getMethod(
          `${appEndpoints.getFeatureGroupByID(id as string)}`,
        )
        if (response) {
          // normalize payload: some APIs wrap data in a `data` field or return the object directly
          const payload = (response as any).data ?? response
          const { name, icon, sortOrder } = payload
          setInitialValues({
            name,
            icon,
            sortOrder,
          })
        }
      } catch (error) {
        console.error('Failed to fetch property category:', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchFeatureGroup()
  }, [id])

  /** 🔹 Handle submit */
  const handleSubmit = async (values: FormValues) => {
    try {
      const payload = {
        ...values,
        sortOrder: values.sortOrder ?? 0,
      }

      const response = await patchMethod(
        `${appEndpoints.updateFeatureGroup(id as string)}`,
        false,
        payload,
      )

      // Optional: if your API wraps result in ResponseDTO
      if (response.data?.error) {
        alert(response.data?.message || 'Failed to update feature group')
        return
      }

      toast.success('Feature Group updated successfully')
      router.push('/admin/dashboard/feature-group')
    } catch (error: any) {
      console.error('Update failed:', error)
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Something went wrong while updating feature group',
      )
    }
  }

  /** 🔹 Loading / error states */
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading feature group details...
      </div>
    )

  if (!initialValues)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Feature Group not found.
      </div>
    )

  /** ✅ Render Form */
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">
          Edit Feature Group
        </h2>

        <FeatureGroupForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          submitLabel="Update Feature Group"
          isEdit={true}
        />
      </div>
    </div>
  )
}
