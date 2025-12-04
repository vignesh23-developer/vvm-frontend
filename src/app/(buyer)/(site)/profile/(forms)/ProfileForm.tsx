'use client'

import React from 'react'
import { Formik, Form } from 'formik'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'
import Button from '@/components/ui/CustomComponent/Button/Button'
import { patchMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'

interface ProfileFormProps {
  initialValues: {
    firstName: string
    lastName: string
    email: string
    // phoneNumber: string
  }
  isEdit?: boolean
  validationSchema: any
}

const ProfileForm: React.FC<ProfileFormProps> = ({ initialValues, validationSchema, isEdit = false }) => {
  const handleSubmit = async (values: any) => {
    console.log('Form submitted with values:', values)
    const payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
    }
    try {
      if (isEdit) {
        const res = await patchMethod(appEndpoints.updateUserProfile, payload)
        console.log(' Profile updated:', res)
      } else {
        console.log(' Creating new profile...')
      }
    } catch (error) {
      console.error(' Error submitting form:', error)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-2xl p-6">
      <h2 className="text-xl font-semibold text-gray-800 text-center mb-6">{isEdit ? 'Edit Profile' : 'Create Profile'}</h2>

      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
        {({ isSubmitting }) => (
          <Form className="space-y-5">
            <FormikTextField label="First Name" name="firstName" placeholder="Enter your first name" />
            <FormikTextField label="Last Name" name="lastName" placeholder="Enter your last name" />
            <FormikTextField label="Email" name="email" placeholder="Enter your email" />
            {/* <FormikTextField label="Phone Number" name="phoneNumber" placeholder="Enter your phone number" /> */}

            <Button
              type="submit"
              disabled={isSubmitting}
              onClick={() => {}}
              className={`w-full py-2 text-white rounded-lg transition duration-200 ${
                isEdit ? 'bg-gray-600 hover:bg-gray-700' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isSubmitting ? 'Saving...' : isEdit ? 'Update Profile' : 'Create Profile'}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default ProfileForm
