'use client'

import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import FormikPasswordField from '@/components/ui/Formik/FormikPasswordField/FormikPasswordField'
import { postMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'
import toast from 'react-hot-toast'
import Button from '../CustomComponent/Button/Button'

export default function ChangePassword() {
  const handleChangePassword = async (
    values: { currentPassword: string; newPassword: string; confirmPassword: string },
    helpers: { setSubmitting: (s: boolean) => void; resetForm: () => void },
  ) => {
    const { setSubmitting, resetForm } = helpers
    try {
      setSubmitting(true)
      let payload = {}
      if (values.currentPassword) {
        payload = { currentPassword: values.currentPassword, newPassword: values.newPassword, confirmPassword: values.confirmPassword }
      } else {
        payload = { newPassword: values.newPassword, confirmPassword: values.confirmPassword }
      }
      const response = await postMethod(appEndpoints.changePassword, payload)

      const ok = response?.status === '200' || response?.status === '201'
      if (ok) {
        toast.success('Password changed successfully')
        resetForm()
      } else {
        toast.error(response?.message || 'Failed to change password')
      }
    } catch (err) {
      console.error('Change password error', err)
      toast.error('Failed to change password')
    } finally {
      setSubmitting(false)
    }
  }
  return (
    <div className="w-full space-y-4 bg-white shadow-xl shadow-yellow-900/10 border border-yellow-100 p-6 rounded-3xl">
      <h3 className="text-base font-semibold text-gray-900">Change Password</h3>
      <p className="text-sm text-gray-600">Update your account password.</p>

      <Formik
        initialValues={{ currentPassword: '', newPassword: '', confirmPassword: '' }}
        validationSchema={Yup.object().shape({
          newPassword: Yup.string().min(6, 'Password must be at least 6 characters').required('New password is required'),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref('newPassword')], 'Passwords must match')
            .required('Please confirm new password'),
        })}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          handleChangePassword(values, { setSubmitting, resetForm })
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <FormikPasswordField name="currentPassword" label="Old Password (optional)" placeholder="Enter old password" />

            <FormikPasswordField name="newPassword" label="New Password" placeholder="Enter new password" />

            <FormikPasswordField name="confirmPassword" label="Confirm New Password" placeholder="Confirm new password" />

            <div className="pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="
              inline-flex items-center justify-center
              rounded-md bg-[#2a1407] px-5 py-2.5
              text-sm font-medium text-white
              transition-opacity
              hover:opacity-90
              disabled:cursor-not-allowed disabled:opacity-60
            "
              >
                {isSubmitting ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
