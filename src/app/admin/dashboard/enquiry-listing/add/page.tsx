'use client'

import { useRouter } from 'next/navigation'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'

interface FormValues {
  name: string
  contactDetails: string
  leadSource: string
  propertyId: string
  assignToAgent: string
  assignedAgent: string
}

export default function AddEnquiryForm() {
  const router = useRouter()

  // ✅ Validation schema
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .required('Name is required'),
    contactDetails: Yup.string().required('Contact details are required'),
    leadSource: Yup.string().required('Lead source is required'),
    propertyId: Yup.string(),
    assignToAgent: Yup.string(),
    assignedAgent: Yup.string(),
  })

  const initialValues: FormValues = {
    name: '',
    contactDetails: '',
    leadSource: '',
    propertyId: '',
    assignToAgent: '',
    assignedAgent: '',
  }

  const handleSubmit = async (values: FormValues) => {
    console.log('Form values:', values)
    // ✅ Add your API call here
    router.push('/property-category')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <span>Dashboard</span>
        <span className="text-gray-400">›</span>
        <span>Enquires</span>
        <span className="text-gray-400">›</span>
        <span className="font-medium text-gray-700">Add Enquires</span>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">
          Add Enquires
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              {/* Name */}
              <div>
                <FormikTextField
                  label={'Name'}
                  type="text"
                  name="name"
                  placeholder={'Enter Name'}
                  className="w-full border-0 bg-gray-100 rounded-md px-4 py-3 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-black focus:bg-white transition"
                />
              </div>

              {/* Contact Details */}
              <div>
                <FormikTextField
                  label={'Contact Details'}
                  type="text"
                  name="contactDetails"
                  placeholder={'Enter Contact Details'}
                  className="w-full border-0 bg-gray-100 rounded-md px-4 py-3 h-36 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-black focus:bg-white transition"
                />
              </div>

              {/* Lead Source */}
              <div>
                <FormikTextField
                  label={'Lead Source'}
                  type="text"
                  name="leadSource"
                  placeholder={'Enter Lead Source'}
                  className="w-full border-0 bg-gray-100 rounded-md px-4 py-3 h-36 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-black focus:bg-white transition"
                />
              </div>
              {/* Property ID */}
              <div>
                <FormikTextField
                  label={'Property Id (if linked)'}
                  type="text"
                  name="propertyId"
                  placeholder={'Enter Property Id'}
                  className="w-full border-0 bg-gray-100 rounded-md px-4 py-3 h-36 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-black focus:bg-white transition"
                />
              </div>
              {/* Assign Agent */}
              <div>
                <FormikTextField
                  label={'Assign to Agent'}
                  type="text"
                  name="assignToAgent"
                  placeholder={'Enter Assign to Agent'}
                  className="w-full border-0 bg-gray-100 rounded-md px-4 py-3 h-36 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-black focus:bg-white transition"
                />
              </div>
              {/* Assigned Agent */}
              <div>
                <FormikTextField
                  label={'Assigned Agent'}
                  type="text"
                  name="assignedAgent"
                  placeholder={'Enter Assigned Agent'}
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
                  {isSubmitting ? 'Creating...' : 'Submit Enquiry'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}
