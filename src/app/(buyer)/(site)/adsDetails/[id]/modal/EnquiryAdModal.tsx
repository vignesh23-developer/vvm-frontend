'use client'

import { Formik, Form } from 'formik'
import { useMemo } from 'react'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import { toast } from 'react-hot-toast'
import ModalComponent from '@/components/ui/CustomComponent/Modal/ModalComponent'
import Button from '@/components/ui/CustomComponent/Button/Button'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'
import { ResponseDTO } from '@/components/dto/response_dto'
import EnquiryFormCard from '@/components/enquiry/forms/EnquiryFormCard'
import EnquiryPropertyValidation from '@/app/(buyer)/(site)/propertyDetails/[id]/validation/EnquiryPropertyValidation'
import { appEndpoints } from '@/services/endpoints'
import { postMethod } from '@/services/service'

interface EnquiryAdModalProps {
  open: boolean
  onClose: () => void
  adId: string
  adDetailsRefresh: () => void
}

export default function EnquiryAdModal({ open, onClose, adId, adDetailsRefresh }: EnquiryAdModalProps) {
  const { user } = useAuth()

  const enquiryPrefillValues = useMemo(
    () => ({
      name: (user?.firstName || '') + ' ' + (user?.lastName || ''),
      email: user?.email || '',
      phone: user?.phoneNumber || '',
    }),
    [user],
  )

  const handleEnquiryAds = async (values: any, { resetForm }: any) => {
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

      if (Number(response.status) === 201) {
        toast.success('Enquiry sent successfully')
        onClose()
        resetForm()
        adDetailsRefresh()
      } else {
        toast.error(response.message || 'Failed to submit enquiry')
      }
    } catch (err) {
      console.error('Failed to send enquiry', err)
      toast.error('Unable to send enquiry right now')
    }
  }

  return (
    <ModalComponent open={open} onClose={onClose} title="Send Enquiry" widthClass="max-w-lg" footer={null} scrollable>
      <EnquiryFormCard Id={adId} entityType="ad" handleSubmit={handleEnquiryAds} defaultValues={enquiryPrefillValues} />
    </ModalComponent>
  )
}
