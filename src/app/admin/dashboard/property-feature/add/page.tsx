'use client'

import { useRouter } from 'next/navigation'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'
import FormikSelectField from '@/components/ui/Formik/FormikSelectField/FormikSelectField'
import * as Yup from 'yup'

interface FormValues {
  parentCategory: string
  name: string
  description: string
}

export default function AddPropertyFeatureCategory() {
  const router = useRouter()

  const validationSchema = Yup.object({
    parentCategory: Yup.string().required('Parent category is required'),
    name: Yup.string()
      .min(2, 'Must be at least 2 characters')
      .required('Feature category name is required'),
    description: Yup.string().max(500, 'Max 500 characters allowed'),
  })

  const initialValues: FormValues = {
    parentCategory: '',
    name: '',
    description: '',
  }

  const options = [
    { value: '', label: 'Parent Property Feature Category' },
    { value: 'interior', label: 'Interior' },
    { value: 'exterior', label: 'Exterior' },
    { value: 'amenities', label: 'Amenities' },
  ]

  const handleSubmit = async (values: FormValues) => {
    console.log('Form submitted:', values)
    // ✅ You can call your API here, for example:
    // await fetch('/api/property-feature-category', { method: 'POST', body: JSON.stringify(values) })
    router.push('/property-feature')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <span>Dashboard</span>
        <span className="text-gray-400">›</span>
        <span>Property Feature Category</span>
        <span className="text-gray-400">›</span>
        <span className="font-medium text-gray-700">
          Add Property Feature Category
        </span>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">
          Add Property Feature Category
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              {/* Parent Category Dropdown */}
              <div>
                <FormikSelectField
                  name="parentCategory"
                  label="Select Parent Property Feature Category"
                  options={options}
                  className="w-full border-0 bg-gray-100 rounded-md px-4 py-3 text-gray-700 focus:ring-2 focus:ring-black focus:bg-white transition"
                />
              </div>

              {/* Feature Category Name */}
              <div>
                <FormikTextField
                  label={'Property Feature Category Name'}
                  type="text"
                  name="name"
                  placeholder={'Enter Property Feature Category'}
                  className="w-full border-0 bg-gray-100 rounded-md px-4 py-3 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-black focus:bg-white transition"
                />
              </div>

              {/* Description */}
              <div>
                <FormikTextField
                  label={'Description'}
                  as="textarea"
                  name="description"
                  placeholder={'Enter Description'}
                  className="w-full border-0 bg-gray-100 rounded-md px-4 py-3 h-36 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-black focus:bg-white transition"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end items-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2 rounded-md text-white font-medium transition ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-black hover:bg-gray-800'
                  }`}
                >
                  {isSubmitting
                    ? 'Creating...'
                    : 'Create Property Feature Category'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}
