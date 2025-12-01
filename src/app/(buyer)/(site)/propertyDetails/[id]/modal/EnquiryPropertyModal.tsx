'use client'

import ModalComponent from '@/components/ui/CustomComponent/Modal/ModalComponent'
import { Formik, Form } from 'formik'
import { toast } from 'react-hot-toast'
import Button from '@/components/ui/CustomComponent/Button/Button'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'
import EnquiryPropertyValidation from '../validation/EnquiryPropertyValidation'
import { postMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'
import { ResponseDTO } from '@/components/dto/response_dto'

interface EnquiryPropertyModalProps {
  EnquiryModalOpen: boolean
  setEnquiryModalOpen: (open: boolean) => void
  propertyId: string | number
  propertyDetailsRefresh: () => void
}

interface EnquiryFormValues {
  entity_type: string
  entity_id?: string | number | null
  name: string
  email: string
  phone: string
  message: string
}

const EnquiryPropertyModal = ({ EnquiryModalOpen, setEnquiryModalOpen, propertyId, propertyDetailsRefresh }: EnquiryPropertyModalProps) => {
  const initialValues: EnquiryFormValues = {
    entity_type: 'property',
    entity_id: propertyId ? propertyId : null,
    name: '',
    email: '',
    phone: '',
    message: '',
  }

  const handleEnquirySubmit = async (values: any, { resetForm }: any) => {
    const payload = {
      entity_type: values.entity_type,
      entity_id: values.entity_id,
      name: values.name,
      email: values.email,
      phone: values.phone,
      message: values.message,
    }

    console.log('Report Payload:', payload)

    try {
      let response = (await postMethod(appEndpoints.createPropertyEnquiry, payload)) as ResponseDTO

      if (Number(response.status) === 201) {
        toast.success('Enquiry submitted successfully!')
        propertyDetailsRefresh()
      } else {
      }
      resetForm()
      setEnquiryModalOpen(false)
    } catch (error) {
      toast.error('Failed to submit enquiry')
    }
  }
  return (
    <div>
      <ModalComponent open={EnquiryModalOpen} title="Enquiry Property" onClose={() => setEnquiryModalOpen(false)} widthClass="max-w-md" footer={null}>
        <Formik initialValues={initialValues} validationSchema={EnquiryPropertyValidation} onSubmit={handleEnquirySubmit}>
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <p className="text-gray-400 font-medium">Kindly provide the reason for your enquiry regarding this property:</p>
              {/* Name */}
              <div>
                <FormikTextField
                  type="text"
                  label="Name"
                  name="name"
                  placeholder="Enter your name"
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                />
              </div>

              {/* email */}
              <div>
                <FormikTextField
                  type="email"
                  label="Email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                />
              </div>

              {/* phone */}
              <div>
                <FormikTextField
                  type="tel"
                  label="Mobile Number"
                  name="phone"
                  placeholder="Enter your mobile number"
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                />
              </div>

              {/* Message */}
              <div>
                <FormikTextField
                  label="Message"
                  as="textarea"
                  name="message"
                  placeholder="Enter your message..."
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  onClick={() => setEnquiryModalOpen(false)}
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={() => {}}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </ModalComponent>
    </div>
  )
}

export default EnquiryPropertyModal
