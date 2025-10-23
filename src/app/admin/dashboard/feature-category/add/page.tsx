'use client'

import { useRouter } from 'next/navigation'
import * as Yup from 'yup'
import FeatureCategoryForm from '@/components/admin/forms/FeatureCategoryForm'
import { code } from 'framer-motion/client'

interface FeatureFormValues {
  code: string
  name: string
  description: string
  input_type?: string
  filterable?: boolean
  mandatory?: boolean
  sort_order?: number
  is_active?: boolean
}

export default function AddPropertyCategory() {
  const router = useRouter()

  // ✅ Validation schema
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .required('Property category name is required'),
    code: Yup.string()
      .min(2, 'Code must be at least 2 characters')
      .required('Property category code is required'),
  })

  const initialValues: FeatureFormValues = {
    code: '',
    name: '',
    description: '',
    input_type: '',
    filterable: false,
    mandatory: false,
    sort_order: 10,
    is_active: true,
  }

  const handleSubmit = async (values: FeatureFormValues) => {
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
        <span>Feature Category Master</span>
        <span className="text-gray-400">›</span>
        <span className="font-medium text-gray-700">Add Feature Category</span>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">
          Add Feature Category
        </h2>

        <FeatureCategoryForm
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          submitLabel="Create Feature Category"
          isEdit={false}
        />
      </div>
    </div>
  )
}
