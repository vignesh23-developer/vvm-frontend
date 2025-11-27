'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { appEndpoints } from '@/services/endpoints'
import { getMethod } from '@/services/service'
import CompanyProfileForm, { CompanyFormValues } from '../(forms)/CompanyProfileForm'
import { ResponseDTO } from '@/components/dto/response_dto'
import CustomLoader from '@/components/ui/CustomComponent/Loader/CustomLoader'

const EditCompanyProfile = () => {
  const [initialValues, setInitialValues] = useState<CompanyFormValues | null>(null)
  const [loading, setLoading] = useState(true)
  const [imageVersion, setImageVersion] = useState(0)
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
            companyLogo,
            companyName,
            userId,
            profileName,
            shortTitle,
            description,
            gstNumber,
            contact_name,
            contact_phone,
            contact_email,
            address_line,
            door_number,
            street_name,
            city,
            district,
            state,
            postal_code,
            country,
            latitude,
            longitude,
          } = payload
          setInitialValues({
            companyLogo,
            companyName,
            userId,
            profileName,
            shortTitle,
            description,
            gstNumber,
            contact_name,
            contact_phone,
            contact_email,
            address_line,
            door_number,
            street_name,
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
  }, [id, imageVersion])

  if (loading || !initialValues) {
    return <CustomLoader text="Loading company profile..." />
  }
  const handleImageUploaded = () => {
    // increment to force re-fetch + cache-bust image URL in the form
    setImageVersion(v => v + 1)
  }

  return (
    <div>
      <CompanyProfileForm
        initialValues={initialValues}
        companyProfileId={id as string}
        // keep the same setter shape but trigger handleImageUploaded when parent receives true
        setUploadedImage={(uploaded: boolean) => {
          if (uploaded) handleImageUploaded()
        }}
        submitLabel="Update Company Profile"
        isEdit={true}
        imageVersion={imageVersion}
      />
    </div>
  )
}

export default EditCompanyProfile
