'use client'

import { useRouter } from 'next/navigation'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'
import FormikRadioField from '@/components/ui/Formik/FormikRadioField/FormikRadioField'

interface FormValues {
  reward: string
  referrer: string
  referralDate: string
}

export default function AddReferralManagementForm() {
  const router = useRouter()

  // ✅ Validation schema
  const validationSchema = Yup.object({
    reward: Yup.string().required('Reward is required'),
    referrer: Yup.string().required('Please select a referrer'),
    referralDate: Yup.date().required('Referral date is required'),
  })

  // ✅ Initial values
  const initialValues: FormValues = {
    reward: '',
    referrer: '',
    referralDate: '',
  }

  const handleSubmit = async (values: FormValues) => {
    console.log('Form values:', values)
    // ✅ Add API call here
    router.push('/property-category')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <span>Dashboard</span>
        <span className="text-gray-400">›</span>
        <span>Referral Management</span>
        <span className="text-gray-400">›</span>
        <span className="font-medium text-gray-700">
          Add Referral Management
        </span>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">
          Add Referral Management
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              {/* Reward */}
              <FormikTextField
                label="Reward (Coupon)"
                type="text"
                name="reward"
                placeholder="Enter Cashback / Points"
                className="w-full border-0 bg-gray-100 rounded-md px-4 py-3 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-black focus:bg-white transition"
              />

              {/* Referrer */}
              <div>
                <label className="font-medium text-gray-800 mb-2 block">
                  Referrer
                </label>
                <div className="flex items-center gap-6 px-4 py-2">
                  <FormikRadioField name="referrer" value="User" label="User" />
                  <FormikRadioField
                    name="referrer"
                    value="Agent"
                    label="Agent"
                  />
                </div>
              </div>

              {/* Referral Date */}
              <div>
                <label className="font-medium text-gray-800 mb-2 block">
                  Referral Date
                </label>
                <Field
                  type="date"
                  name="referralDate"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
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
                  {isSubmitting ? 'Creating...' : 'Approve Reward'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}
