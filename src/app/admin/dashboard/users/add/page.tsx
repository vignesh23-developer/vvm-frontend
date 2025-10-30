'use client'

import { useRouter } from 'next/navigation'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'

interface FormValues {
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
  password: string
  confirmPassword: string
  dob: string
}

export default function AddEnquiryForm() {
  const router = useRouter()

  // ✅ Validation schema (matches the form fields)
  const validationSchema = Yup.object({
    firstName: Yup.string()
      .min(2, 'First name must be at least 2 characters')
      .required('First name is required'),
    lastName: Yup.string()
      .min(2, 'Last name must be at least 2 characters')
      .required('Last name is required'),
    phoneNumber: Yup.string()
      .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
      .required('Phone number is required'),
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm password is required'),
    dob: Yup.date()
      .max(new Date(), 'Date of birth cannot be in the future')
      .required('Date of birth is required'),
  })

  // ✅ Initial form values
  const initialValues: FormValues = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    dob: '',
  }

  const handleSubmit = async (values: FormValues) => {
    console.log('Form submitted:', values)
    // 👉 Add your API call here if needed
    router.push('/property-category')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <span>Dashboard</span>
        <span className="text-gray-400">›</span>
        <span>Enquiries</span>
        <span className="text-gray-400">›</span>
        <span className="font-medium text-gray-700">Add Enquiry</span>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
          Add User
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              {/* First & Last Name in one row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormikTextField
                  label="First Name"
                  type="text"
                  name="firstName"
                  placeholder="Enter first name"
                  className="w-full border-0 bg-gray-100 rounded-md px-4 py-3 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-black focus:bg-white transition"
                />
                <FormikTextField
                  label="Last Name"
                  type="text"
                  name="lastName"
                  placeholder="Enter last name"
                  className="w-full border-0 bg-gray-100 rounded-md px-4 py-3 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-black focus:bg-white transition"
                />
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormikTextField
                  label="Phone Number"
                  type="tel"
                  name="phoneNumber"
                  placeholder="Enter phone number"
                  className="w-full border-0 bg-gray-100 rounded-md px-4 py-3 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-black focus:bg-white transition"
                />
                <FormikTextField
                  label="Email"
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  className="w-full border-0 bg-gray-100 rounded-md px-4 py-3 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-black focus:bg-white transition"
                />
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormikTextField
                  label="Password"
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  className="w-full border-0 bg-gray-100 rounded-md px-4 py-3 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-black focus:bg-white transition"
                />
                <FormikTextField
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-enter password"
                  className="w-full border-0 bg-gray-100 rounded-md px-4 py-3 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-black focus:bg-white transition"
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="font-medium text-gray-800 mb-2 block">
                  Date of Birth
                </label>
                <Field
                  type="date"
                  name="dob"
                  className="w-full px-4 py-3 border border-gray-200 rounded-md bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition"
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
                  {isSubmitting ? 'Submitting...' : 'Create User'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}
