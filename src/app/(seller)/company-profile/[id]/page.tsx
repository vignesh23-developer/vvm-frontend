'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { appEndpoints } from '@/services/endpoints'
import { getMethod } from '@/services/service'

import CompanyProfileForm, { CompanyFormValues } from '../(forms)/CompanyProfileForm'
import { ResponseDTO } from '@/components/dto/response_dto'

const EditCompanyProfile = () => {
  const [initialValues, setInitialValues] = useState<CompanyFormValues | null>(null)
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const id = params?.id

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        setLoading(true)
        const response = await getMethod(`${appEndpoints.getCompanyProfileByID(id as string)}`)
        if (response) {
          const payload = (response as ResponseDTO).data ?? response
          const {
            companyName,
            userId,
            profileName,
            shortTitle,
            description,
            gstNumber,
            contact_name,
            contact_phone,
            contact_email,
            expiryDays,
            address_line,
            city,
            district,
            state,
            postal_code,
            country,
            latitude,
            longitude,
          } = payload
          setInitialValues({
            companyName,
            userId,
            profileName,
            shortTitle,
            description,
            gstNumber,
            contact_name,
            contact_phone,
            contact_email,
            expiryDays,
            address_line,
            city,
            district,
            state,
            postal_code,
            country,
            latitude,
            longitude,
          })
        }
      } catch (error) {
        console.error('Failed to fetch property category:', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchCompanyProfile()
  }, [id])

  const handleSubmit = async (values: any) => {
    // Handle form submission logic here
    console.log('Form submitted with values:', values)
  }

  if (loading || !initialValues) {
    return <div>Loading...</div>
  }
  return (
    <div>
      <CompanyProfileForm initialValues={initialValues} onSubmit={handleSubmit} submitLabel="Update Company Profile" isEdit={true} />
    </div>
  )
}

export default EditCompanyProfile
