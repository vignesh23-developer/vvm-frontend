'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { appEndpoints } from '@/services/endpoints'
import { getMethod, patchMethod } from '@/services/service'
import PropertyCategoryForm, { FormValues } from '@/app/admin/dashboard/(master)/property-category/(forms)/PropertyCategoryForm'
import toast from 'react-hot-toast'
import CustomLoader from '@/components/ui/CustomComponent/Loader/CustomLoader'

export default function EditPropertyCategory() {
  const router = useRouter()
  const params = useParams()
  const { id } = params

  const [initialValues, setInitialValues] = useState<FormValues | null>(null)
  const [loading, setLoading] = useState(true)

  /** 🔹 Fetch existing category data */
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await getMethod(`${appEndpoints.getPropertyCategoryByID(id as string)}`)
        if (response) {
          // normalize payload: some APIs wrap data in a `data` field or return the object directly
          const payload = (response as any).data ?? response
          const { name, description, icon, sortOrder } = payload
          setInitialValues({
            name,
            icon,
            description,
            sortOrder,
          })
        }
      } catch (error) {
        console.error('Failed to fetch property category:', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchCategory()
  }, [id])

  /** 🔹 Handle submit */
  const handleSubmit = async (values: FormValues) => {
    try {
      const payload = {
        ...values,
        sortOrder: values.sortOrder ?? 0,
      }

      const response = await patchMethod(`${appEndpoints.updatePropertyCategory(id as string)}`, payload)

      toast.success('Property category updated successfully')
      router.push('/admin/dashboard/property-category')
    } catch (error: any) {
      console.error('Update failed:', error)
      toast.error(error.response?.data?.message || error.message || 'Something went wrong while updating category')
    }
  }

  /** 🔹 Loading / error states */
  if (loading) return <CustomLoader text="Loading property category..." />

  if (!initialValues) return <div className="min-h-screen flex items-center justify-center text-gray-500">Property category not found.</div>

  /** ✅ Render Form */
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">Edit Property Category</h2>

        <PropertyCategoryForm initialValues={initialValues} onSubmit={handleSubmit} submitLabel="Update Property Category" isEdit={true} />
      </div>
    </div>
  )
}
