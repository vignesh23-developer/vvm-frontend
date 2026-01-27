'use client'

import { useRouter } from 'next/navigation'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'
import FormikRadioField from '@/components/ui/Formik/FormikRadioField/FormikRadioField'
import FormikSelectField from '@/components/ui/Formik/FormikSelectField/FormikSelectField'

interface FormValues {
  notificationId: string
  receiver: string
  type: string
  message: string
  sentStatus: string
  dateTime: string
}

export default function AddSavedCriteriaForm() {
  const router = useRouter()

  const validationSchema = Yup.object({
    notificationId: Yup.string().required('Notification ID is required'),
    receiver: Yup.string().required('Receiver is required'),
    type: Yup.string().required('Please select a notification type'),
    message: Yup.string().required('Message is required'),
    sentStatus: Yup.string().required('Sent Status is required'),
    dateTime: Yup.date().required('Date & Time is required'),
  })

  const initialValues: FormValues = {
    notificationId: '',
    receiver: '',
    type: 'Email',
    message: '',
    sentStatus: '',
    dateTime: '',
  }

  const handleSubmit = async (values: FormValues) => {
    // console.log('Form values:', values)
    router.push('/notifications')
  }

  const options = [
    { value: '', label: 'Property Type' },
    { value: 'interior', label: 'Interior' },
    { value: 'exterior', label: 'Exterior' },
    { value: 'amenities', label: 'Amenities' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <span>Dashboard</span>
        <span className="text-gray-400">›</span>
        <span>Saved Criteria</span>
        <span className="text-gray-400">›</span>
        <span className="font-medium text-gray-700">Add Saved Criteria</span>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-lg shadow p-8 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">Add Saved Search Criteria</h2>

        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form className="space-y-8">
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormikTextField label="Saved Search Name" name="savedSearchName" type="text" placeholder="Enter Name" />
                <FormikTextField label="Location" name="location" type="text" placeholder="Enter Location" />
                <div className="flex flex-col">
                  <label className="font-medium text-gray-800 mb-2">Frequency</label>
                  <div className="flex items-center gap-6 bg-gray-100 border border-gray-200 rounded-lg px-4 py-2">
                    <FormikRadioField name="frequency" value="Daily" label="Daily" />
                    <FormikRadioField name="frequency" value="Weekly alerts" label="Weekly Alerts" />
                  </div>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormikTextField label="Budget" type="text" name="budget" placeholder="Enter Budget" />
                <FormikSelectField
                  name="propertyType"
                  label="Property Type"
                  options={options}
                  className="w-full border-0 bg-gray-100 rounded-md px-4 py-3 text-gray-700 focus:ring-2 focus:ring-black focus:bg-white transition"
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-col md:flex-row justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-3 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-3 rounded-lg text-white font-medium transition ${
                    isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
                  }`}
                >
                  {isSubmitting ? 'Creating...' : 'Trigger Test Alert'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}
