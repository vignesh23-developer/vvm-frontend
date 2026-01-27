'use client'

import { useRouter } from 'next/navigation'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'
import FormikRadioField from '@/components/ui/Formik/FormikRadioField/FormikRadioField'

interface FormValues {
  notificationId: string
  receiver: string
  type: string
  message: string
  sentStatus: string
  dateTime: string
}

export default function AddNotificationForm() {
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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <span>Dashboard</span>
        <span className="text-gray-400">›</span>
        <span>Notification</span>
        <span className="text-gray-400">›</span>
        <span className="font-medium text-gray-700">Add Notification</span>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-lg shadow p-8 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">Add Notifications</h2>

        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form className="space-y-8">
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormikTextField label="Notification ID" name="notificationId" type="text" placeholder="Notification ID" />
                <FormikTextField label="Receiver" name="receiver" type="text" placeholder="Receiver (Agent / Buyer / All)" />
                <div className="flex flex-col">
                  <label className="font-medium text-gray-800 mb-2">Type</label>
                  <div className="flex items-center gap-6 bg-gray-100 border border-gray-200 rounded-lg px-4 py-2">
                    <FormikRadioField name="type" value="Email" label="Email" />
                    <FormikRadioField name="type" value="SMS" label="SMS" />
                    <FormikRadioField name="type" value="In-App" label="In-App" />
                  </div>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormikTextField label="Message Title & Content" as="textarea" name="message" placeholder="Description" className="h-28 w-full" />
                <FormikTextField label="Sent Status" name="sentStatus" placeholder="(Pending / Sent / Failed)" />
                <div className="flex flex-col">
                  <label className="font-medium text-gray-800 mb-2">Date & Time</label>
                  <Field
                    type="date"
                    name="dateTime"
                    className="px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
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

                <button type="button" className="px-6 py-3 rounded-lg bg-black text-white font-medium hover:bg-gray-800 transition">
                  Schedule Notification
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-3 rounded-lg text-white font-medium transition ${
                    isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
                  }`}
                >
                  {isSubmitting ? 'Creating...' : 'Create Notification'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}
