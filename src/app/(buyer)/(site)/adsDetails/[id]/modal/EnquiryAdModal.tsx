'use client'

import { Formik, Form } from 'formik'
import { toast } from 'react-hot-toast'

import ModalComponent from '@/components/ui/CustomComponent/Modal/ModalComponent'
import Button from '@/components/ui/CustomComponent/Button/Button'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'

import EnquiryPropertyValidation from '@/app/(buyer)/(site)/propertyDetails/[id]/validation/EnquiryPropertyValidation'
import { appEndpoints } from '@/services/endpoints'
import { postMethod } from '@/services/service'

interface EnquiryAdModalProps {
  open: boolean
  onClose: () => void
  adId: string
}

export default function EnquiryAdModal({ open, onClose, adId }: EnquiryAdModalProps) {
  const initialValues = {
    entity_type: 'ad',
    entity_id: adId,
    name: '',
    email: '',
    phone: '',
    message: '',
  }

  const handleSubmit = async (values: typeof initialValues, { resetForm }: any) => {
    try {
      const payload = {
        entity_type: values.entity_type,
        entity_id: values.entity_id,
        name: values.name,
        email: values.email,
        phone: values.phone,
        message: values.message,
      }

      const response = await postMethod(appEndpoints.createEnquiry, payload)
      if (response.error) {
        toast.error(response.message || 'Failed to send enquiry')
        return
      }
      toast.success('Enquiry sent successfully')
      resetForm()
      onClose()
    } catch (err) {
      console.error('Failed to send enquiry', err)
      toast.error('Unable to send enquiry right now')
    }
  }

  return (
    <ModalComponent open={open} onClose={onClose} title="Send Enquiry" widthClass="max-w-md" footer={null}>
      <Formik initialValues={initialValues} validationSchema={EnquiryPropertyValidation} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <p className="text-sm text-gray-600">Let the ad owner know what you are interested in.</p>

            <FormikTextField name="name" label="Name" placeholder="Enter your name" />
            <FormikTextField name="email" type="email" label="Email" placeholder="Enter your email" />
            <FormikTextField name="phone" type="tel" label="Phone" placeholder="Enter your phone number" />
            <FormikTextField name="message" as="textarea" label="Message" rows={3} placeholder="Enter your message" />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" onClick={onClose} className="border border-gray-300 text-gray-700 px-4 py-2 text-sm">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-[#2a1407] text-white px-4 py-2 text-sm">
                {isSubmitting ? 'Sending...' : 'Send'}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </ModalComponent>
  )
}
