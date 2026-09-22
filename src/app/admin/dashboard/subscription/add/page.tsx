'use client'

import { useRouter } from 'next/navigation'
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik'
import FormikSelectField from '@/components/ui/Formik/FormikSelectField/FormikSelectField'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'
import * as Yup from 'yup'
import { Plus, Trash2 } from 'lucide-react'

interface Feature {
  title: string
  valueType: string
  value: string
  icon: string
}

interface FormValues {
  name: string
  description: string
  features: Feature[]
}

export default function AddSubscription() {
  const router = useRouter()

  const validationSchema = Yup.object({
    name: Yup.string().required('Subscription name is required'),
    description: Yup.string().required('Description is required'),
    features: Yup.array().of(
      Yup.object({
        title: Yup.string().required('Title is required'),
        valueType: Yup.string().required('Select a value type'),
        value: Yup.string().required('Value is required'),
        icon: Yup.string().required('Select an icon'),
      }),
    ),
  })

  const initialValues: FormValues = {
    name: '',
    description: '',
    features: [{ title: '', valueType: 'Text', value: '', icon: 'Check' }],
  }

  const handleSubmit = async (values: FormValues) => {
    // console.log('Form Submitted:', values)
    // ✅ Replace with API call
    // await fetch('/api/subscription', { method: 'POST', body: JSON.stringify(values) })
    router.push('/subscription')
  }

  const options = [
    { value: '', label: 'Select Value Type' },
    { value: 'text', label: 'Text' },
    { value: 'number', label: 'Number' },
    { value: 'boolean', label: 'Boolean' },
  ]

  const icons = [
    { value: '', label: 'Select Value Icon' },
    { value: 'check', label: 'Check' },
    { value: 'cross', label: 'Cross' },
    { value: 'lock', label: 'Lock' },
    { value: 'key', label: 'Key' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <span>Dashboard</span>
        <span className="text-gray-400">›</span>
        <span>Subscription Master</span>
        <span className="text-gray-400">›</span>
        <span className="font-medium text-gray-700">Add Subscription Master</span>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">Add Subscription</h2>

        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ values, isSubmitting }) => (
            <Form className="space-y-6">
              {/* Subscription Name */}
              <div>
                <FormikTextField
                  label={'Subscription Name'}
                  type="text"
                  name="name"
                  placeholder={'Enter Subscription'}
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
                  className="w-full border-0 bg-gray-100 rounded-md px-4 py-3 h-32 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-black focus:bg-white transition"
                />
              </div>

              {/* Features & Benefits */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Features And Benefits</h3>

                <FieldArray name="features">
                  {({ push, remove }) => (
                    <div className="space-y-4">
                      {values.features.map((_, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end border-b border-gray-100 pb-4">
                          {/* Title */}
                          <div>
                            <FormikTextField
                              label={'Title'}
                              type="text"
                              name={`features.${index}.title`}
                              placeholder={'Enter Title'}
                              className="w-full border-0 bg-gray-100 rounded-md px-4 py-3 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-black focus:bg-white transition"
                            />
                          </div>

                          {/* Value Type */}
                          <div>
                            <FormikSelectField
                              name="features.${index}.valueType"
                              label="Select Value Type"
                              options={options}
                              className="w-full border-0 bg-gray-100 rounded-md px-4 py-3 text-gray-700 focus:ring-2 focus:ring-black focus:bg-white transition"
                            />
                          </div>

                          {/* Value */}
                          <div>
                            <FormikTextField
                              label={'Value'}
                              type="text"
                              name={`features.${index}.value`}
                              placeholder={'Enter Value'}
                              className="w-full border-0 bg-gray-100 rounded-md px-4 py-3 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-black focus:bg-white transition"
                            />
                          </div>

                          {/* Icon Selector */}
                          <div>
                            <FormikSelectField
                              name="features.${index}.icon"
                              label="Select Value Icon"
                              options={icons}
                              className="w-full border-0 bg-gray-100 rounded-md px-4 py-3 text-gray-700 focus:ring-2 focus:ring-black focus:bg-white transition"
                            />
                          </div>

                          {/* Delete Button */}
                          {values.features.length > 1 && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="text-red-500 hover:text-red-700 flex items-center justify-center"
                            >
                              <Trash2 size={20} />
                            </button>
                          )}
                        </div>
                      ))}

                      {/* Add Button */}
                      <button
                        type="button"
                        onClick={() =>
                          push({
                            title: '',
                            valueType: 'Text',
                            value: '',
                            icon: 'Check',
                          })
                        }
                        className="flex items-center gap-2 text-sm font-medium text-black border border-gray-200 rounded-md px-4 py-2 hover:bg-gray-100 transition"
                      >
                        <Plus size={16} /> Add
                      </button>
                    </div>
                  )}
                </FieldArray>
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
                    isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
                  }`}
                >
                  {isSubmitting ? 'Creating...' : 'Create Subscription'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}
