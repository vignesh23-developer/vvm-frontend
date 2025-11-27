'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import CompanyProfileForm, { CompanyFormValues } from '../(forms)/CompanyProfileForm'

const AddCompanyProfile = () => {
  const { user, token } = useAuth()
  const router = useRouter()

  const initialValues: CompanyFormValues = {
    companyName: '',
    userId: user ? user?.id : '',
    profileName: '',
    shortTitle: '',
    description: '',
    gstNumber: '',
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    address_line: '',
    door_number: '',
    street_name: '',
    city: '',
    district: '',
    state: '',
    postal_code: '',
    country: '',
    latitude: 0,
    longitude: 0,
  }

  return (
    <div className="">
      <CompanyProfileForm initialValues={initialValues} submitLabel="Create Company Profile" isEdit={false} />
    </div>
  )
}

export default AddCompanyProfile
