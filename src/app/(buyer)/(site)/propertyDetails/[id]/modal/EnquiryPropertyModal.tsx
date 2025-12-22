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
import EnquiryFormCard from '@/components/enquiry/forms/EnquiryFormCard'
import { useMemo } from 'react'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'

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
  const { user } = useAuth()
  const enquiryPrefillValues = useMemo(
    () => ({
      name: (user?.firstName || '') + ' ' + (user?.lastName || ''),
      email: user?.email || '',
      phone: user?.phoneNumber || '',
    }),
    [user],
  )

  const handleEnquirySubmit = async (values: any) => {
    const payload = {
      entity_type: values.entity_type,
      entity_id: values.entity_id,
      name: values.name,
      email: values.email,
      phone: values.phone,
      message: values.message,
    }

    try {
      let response = (await postMethod(appEndpoints.createPropertyEnquiry, payload)) as ResponseDTO

      if (Number(response.status) === 201) {
        toast.success('Enquiry submitted successfully!')
        propertyDetailsRefresh()
      } else {
        toast.error(response.message || 'Failed to submit enquiry')
      }
    } catch (error) {
      toast.error('Failed to submit enquiry')
    }
  }
  return (
    <div>
      S{' '}
      <ModalComponent
        open={EnquiryModalOpen}
        title="Enquiry Property"
        onClose={() => setEnquiryModalOpen(false)}
        widthClass="max-w-lg"
        footer={null}
        scrollable
      >
        <EnquiryFormCard Id={propertyId} entityType="property" handleSubmit={handleEnquirySubmit} defaultValues={enquiryPrefillValues} />
      </ModalComponent>
    </div>
  )
}

export default EnquiryPropertyModal
