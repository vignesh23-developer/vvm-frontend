'use client'

import { useRouter } from 'next/navigation'
import * as Yup from 'yup'
import PropertyCategoryForm from '@/components/admin/forms/PropertyCategoryForm'
import { code } from 'framer-motion/client'

interface FormValues {
  name: string
  description: string
  sortOrder?: number
  isActive?: boolean
}

export default function AddPropertyCategory() {
  const router = useRouter()

  // ✅ Validation schema
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .required('Property category name is required'),
  })

  const initialValues: FormValues = {
    name: '',
    description: '',
    sortOrder: 0,
    isActive: true,
  }

  const handleSubmit = async (values: FormValues) => {
    console.log('Form values:', values)
    // ✅ Add your API call here
    // router.push('/property-category')
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
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          submitLabel="Create Property Category"
          isEdit={false}
        />
      </div>
    </div>
  )
}
