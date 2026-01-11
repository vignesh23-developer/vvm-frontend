'use client'

import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import FormikPasswordField from '@/components/ui/Formik/FormikPasswordField/FormikPasswordField'
import { postMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'
import toast from 'react-hot-toast'
import Button from '../CustomComponent/Button/Button'
import { Lock } from 'lucide-react'

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
    <div className="bg-white rounded-2xl border border-[#e8d5c4] shadow-sm overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <span className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
            <Lock className="w-5 h-5 text-red-500" />
          </span>
          <div>
            <h3 className="text-base font-semibold text-[#2a1407]">Change Password</h3>
            <p className="text-xs text-[#7a4a1d]">Update your account password</p>
          </div>
        </div>

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
              <div>
                <FormikPasswordField
                  name="currentPassword"
                  label="Current Password"
                  placeholder="Enter current password"
                />
                <p className="text-[10px] text-gray-400 mt-1">Optional for social login users</p>
              </div>

              <FormikPasswordField
                name="newPassword"
                label="New Password"
                placeholder="Enter new password"
              />

              <FormikPasswordField
                name="confirmPassword"
                label="Confirm New Password"
                placeholder="Confirm new password"
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-3 text-white font-semibold text-sm rounded-xl transition-all ${isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-[#2a1407] hover:bg-[#3d2415] hover:shadow-md'
                    }`}
                >
                  {isSubmitting ? 'Updating...' : 'Update Password'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}