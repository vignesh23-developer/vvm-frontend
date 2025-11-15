'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { appEndpoints } from '@/services/endpoints'
import { getMethod, patchMethod } from '@/services/service'
import CompanyProfileForm, { CompanyFormValues } from '../(forms)/CompanyProfileForm'
import { ResponseDTO } from '@/components/dto/response_dto'
import { toast } from 'react-hot-toast'
import CustomLoader from '@/components/ui/CustomComponent/Loader/CustomLoader'

const EditCompanyProfile = () => {
  const [initialValues, setInitialValues] = useState<CompanyFormValues | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
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
    try {
      const response: ResponseDTO = await patchMethod(appEndpoints.updateCompanyProfile(id as string), values)

      if (response.status === '200') {
        toast.success('Company profile updated successfully!')

        router.push('/home')
      }
    } catch (error: any) {
      console.error('Create failed:', error)
      toast.error(error?.message || 'Something went wrong!')
    }
  }

  if (loading || !initialValues) {
    return <CustomLoader text="Loading company profile..." />
  }
  return (
    <div>
      <CompanyProfileForm initialValues={initialValues} onSubmit={handleSubmit} submitLabel="Update Company Profile" isEdit={true} />
    </div>
  )
}

export default EditCompanyProfile
