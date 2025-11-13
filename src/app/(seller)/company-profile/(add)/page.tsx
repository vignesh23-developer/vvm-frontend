'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { appEndpoints } from '@/services/endpoints'
import { postMethod } from '@/services/service'
import { ResponseDTO } from '@/components/dto/response_dto'
import CompanyProfileForm, { CompanyFormValues } from '../(forms)/CompanyProfileForm'
import { getLocalStorageItem } from '@/utils/local_storage/local_storage_handler'
import { LOCAL_STORAGE_NAME } from '@/utils/local_storage/local_storage_constant'
import { toast } from 'react-hot-toast'

interface UserData {
  id: string
  firstName: string
  lastName: string
  email: string
}

const AddCompanyProfile = () => {
  const [userValue, setUserValue] = useState<UserData | null>(null)
  const router = useRouter()
  useEffect(() => {
    // Any initialization logic can go here
    const userDetails = getLocalStorageItem(LOCAL_STORAGE_NAME.userData) as UserData
    if (userDetails) {
      console.log('User from local storage:', userDetails)
      setUserValue(userDetails)
    }
  }, [])

  console.log('userValue in AddCompanyProfile:', userValue)
  const initialValues: CompanyFormValues = {
    companyName: '',
    userId: userValue ? userValue.id : '',
    profileName: '',
    shortTitle: '',
    description: '',
    gstNumber: '',
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    expiryDays: '',
    address_line: '',
    city: '',
    district: '',
    state: '',
    postal_code: '',
    country: '',
    latitude: 0,
    longitude: 0,
  }

  console.log('Initial Values:', initialValues.profileName)

  const handleSubmit = async (values: any) => {
    try {
      const response: ResponseDTO = await postMethod(appEndpoints.createCompanyProfile, values)

      console.log('Create response:', response)

      if (response.status === '201') {
        toast.success('Company profile created successfully!')

        router.push('/home')
      }
    } catch (error: any) {
      console.error('Create failed:', error)
      toast.error(error?.message || 'Something went wrong!')
    }
  }

  return (
    <div className="">
      <CompanyProfileForm initialValues={initialValues} onSubmit={handleSubmit} submitLabel="Create Company Profile" isEdit={false} />
    </div>
  )
}

export default AddCompanyProfile
