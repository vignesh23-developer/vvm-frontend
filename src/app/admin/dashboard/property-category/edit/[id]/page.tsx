'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import * as Yup from 'yup'
import { appEnpoints } from '@/services/endpoints'
import { getMethod } from '@/services/service'
import PropertyCategoryForm from '@/components/admin/forms/PropertyCategoryForm'
import { code } from 'framer-motion/client'

interface FormValues {
  name: string
  description: string
  sortOrder?: number
  isActive?: boolean
}

export default function EditPropertyCategory() {
  const router = useRouter()
  const params = useParams()
  const { id } = params

  const [initialValues, setInitialValues] = useState<FormValues | null>(null)
  const [loading, setLoading] = useState(true)

  /** ✅ Validation schema */
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .required('Property category name is required'),
  })

  /** 🔹 Fetch existing category data */
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await getMethod(
          `${appEnpoints.getPropertyCategoryByID(id as string)}`,
        )
        if (response) {
          // normalize payload: some APIs wrap data in a `data` field or return the object directly
          const payload = (response as any).data ?? response
          const { name, description, sortOrder, isActive } = payload
          setInitialValues({
            name,
            description,
            sortOrder,
            isActive,
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
      await fetch(`${appEnpoints.updatePropertyCategory}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      router.push('/property-category')
    } catch (error) {
      console.error('Update failed:', error)
    }
  }

  /** 🔹 Loading / error states */
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading category details...
      </div>
    )

  if (!initialValues)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Property category not found.
      </div>
    )

  /** ✅ Render Form */
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <span>Dashboard</span>
        <span className="text-gray-400">›</span>
        <span>Property Category Master</span>
        <span className="text-gray-400">›</span>
        <span className="font-medium text-gray-700">
          Edit Property Category
        </span>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">
          Edit Property Category
        </h2>

        <PropertyCategoryForm
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          submitLabel="Update Property Category"
          isEdit={true}
        />
      </div>
    </div>
  )
}
