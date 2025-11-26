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
import { patchMethod } from '@/services/service'

interface PropertyStatusChangeModalProps {
  isOpenStatusModal: boolean
  setIsOpenStatusModal: (open: boolean) => void
  propertyId: any
  propertyRefresh?: () => void
}

// Options
const statusOptions = [
  { label: 'PENDING', value: 'PENDING' },
  { label: 'AVAILABLE', value: 'AVAILABLE' },
  { label: 'SOLD', value: 'SOLD' },
]

const PropertyStatusChangeModal = ({ isOpenStatusModal, setIsOpenStatusModal, propertyId, propertyRefresh }: PropertyStatusChangeModalProps) => {
  const [loading, setLoading] = useState(false)

  // --- Validation Schema ---
  const validationSchema = Yup.object().shape({
    status: Yup.string().required('Please select a status'),
  })

  // --- Approve/Reject handler ---
  const handleAction = async (values: any) => {
    setLoading(true)

    const endpoint = appEndpoints.updatePropertiesByID(propertyId)

    const payload = {
      status: values.status,
    }

    try {
      const response = await patchMethod(endpoint, payload)

      if (response.error) {
        toast.error(`Failed to ${values.status} property: ${response.message}`)
      } else {
        toast.success(`Property ${values.status}d successfully`)
        setIsOpenStatusModal(false)
        if (propertyRefresh) {
          propertyRefresh()
        }
      }
    } catch (error) {
      toast.error(`An error occurred during ${values.status} action`)
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ModalComponent open={isOpenStatusModal} onClose={() => setIsOpenStatusModal(false)} title={'Change Property Status'} footer={null}>
      <div className="space-y-4 text-sm text-gray-600">
        <p>Are you sure you want to update your property status </p>

        <Formik initialValues={{ status: '' }} validationSchema={validationSchema} enableReinitialize onSubmit={handleAction}>
          {() => (
            <Form>
              <>
                <FormikSelectField name="status" label="Status" placeholder="Select a status" options={statusOptions} />
              </>

              {/* ACTION BUTTONS */}
              <div className="mt-4 flex justify-end gap-3">
                <Button
                  type="button"
                  onClick={() => setIsOpenStatusModal(false)}
                  className="border px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-[#7B1E1E] px-4 py-2 text-sm text-white hover:bg-[#661919] disabled:bg-gray-400"
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

export default PropertyStatusChangeModal
