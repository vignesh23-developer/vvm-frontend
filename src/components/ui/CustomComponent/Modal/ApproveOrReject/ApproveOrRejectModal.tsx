'use client'

import { Formik, Form } from 'formik'
import { useState } from 'react'
import * as Yup from 'yup'
import { toast } from 'react-hot-toast'

import ModalComponent from '@/components/ui/CustomComponent/Modal/ModalComponent'
import Button from '@/components/ui/CustomComponent/Button/Button'
import FormikSelectField from '@/components/ui/Formik/FormikSelectField/FormikSelectField'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'

import { appEndpoints } from '@/services/endpoints'
import { putMethod } from '@/services/service'

interface ApproveOrRejectPropertyModalProps {
  approveOrRejectModalOpen: boolean
  setApproveOrRejectModalOpen: (open: boolean) => void
  approveOrRejectReason: string
  userId: string | number
  property: any
  propertyRefresh?: () => void
}

// Options
const rejectReasons = [
  { label: 'Select a reason', value: '' },
  { label: 'Incomplete Information', value: 'incomplete_information' },
  { label: 'Invalid Documents', value: 'invalid_documents' },
  { label: 'Property Not Eligible', value: 'property_not_eligible' },
  { label: 'Other', value: 'other' },
]

const ApproveOrRejectPropertyModal = ({
  approveOrRejectModalOpen,
  setApproveOrRejectModalOpen,
  approveOrRejectReason,
  userId,
  property,
  propertyRefresh,
}: ApproveOrRejectPropertyModalProps) => {
  const [loading, setLoading] = useState(false)

  // --- Validation Schema ---
  const validationSchema = Yup.object().shape({
    rejectReason: approveOrRejectReason === 'reject' ? Yup.string().required('Please select a reason') : Yup.string().nullable(),
    comment: Yup.string().max(2000, 'Too long'),
  })

  // --- Approve/Reject handler ---
  const handleAction = async (values: any) => {
    setLoading(true)

    const endpoint = approveOrRejectReason === 'approve' ? appEndpoints.approveProperty(property?.id) : appEndpoints.rejectProperty(property?.id)

    const payload =
      approveOrRejectReason === 'approve'
        ? { reviewer_id: userId }
        : {
            reviewer_id: userId,
            rejection_reason: values.rejectReason,
            comments: values.comment,
          }

    try {
      const response = await putMethod(endpoint, payload)

      if (response.error) {
        toast.error(`Failed to ${approveOrRejectReason} property: ${response.message}`)
      } else {
        toast.success(`Property ${approveOrRejectReason} successfully`)
        setApproveOrRejectModalOpen(false)
        if (propertyRefresh) {
          propertyRefresh()
        }
      }
    } catch (error) {
      toast.error(`An error occurred during ${approveOrRejectReason} action`)
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ModalComponent
      open={approveOrRejectModalOpen}
      onClose={() => setApproveOrRejectModalOpen(false)}
      title={approveOrRejectReason === 'approve' ? 'Approve Property' : 'Reject Property'}
      footer={null}
    >
      <div className="space-y-4 text-sm text-gray-600">
        <p>
          Are you sure you want to <span className="font-semibold">{approveOrRejectReason}</span> the property{' '}
          <span className="font-semibold">{property?.title ?? 'this listing'}</span>?
        </p>

        <Formik initialValues={{ rejectReason: '', comment: '' }} validationSchema={validationSchema} enableReinitialize onSubmit={handleAction}>
          {() => (
            <Form>
              {/* APPROVE - optional comment */}
              {approveOrRejectReason === 'approve' && <FormikTextField name="comment" label="Approval Notes (optional)" as="textarea" rows={3} />}

              {/* REJECT - reason + comment */}
              {approveOrRejectReason === 'reject' && (
                <>
                  <FormikSelectField name="rejectReason" label="Reason for Rejection" options={rejectReasons} />
                  <FormikTextField name="comment" label="Rejection Comments (optional)" as="textarea" rows={3} />
                </>
              )}

              {/* ACTION BUTTONS */}
              <div className="mt-4 flex justify-end gap-3">
                <Button
                  type="button"
                  onClick={() => setApproveOrRejectModalOpen(false)}
                  className="border px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-[#2a1407] px-4 py-2 text-sm text-white hover:bg-[#661919] disabled:bg-gray-400"
                >
                  {loading ? 'Processing...' : 'Confirm'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </ModalComponent>
  )
}

export default ApproveOrRejectPropertyModal
