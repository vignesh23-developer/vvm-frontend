'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ProfileForm from '../(forms)/ProfileForm'
import { ProfileValidationSchema } from '../(validation)/ProfileValidation'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'

const ProfilePage = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const [initialValues, setInitialValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    // phoneNumber: '',
  })

  useEffect(() => {
    if (id) {
      const fetchUserProfile = async () => {
        // Simulate API fetch
        const userData = {
          firstName: user?.firstName || '',
          lastName: user?.lastName || '',
          email: user?.email || '',
          // phoneNumber: user?.phoneNumber || '',
        }
        setInitialValues(userData)
      }
      fetchUserProfile()
    }
  }, [id])

  return (
    <div className="p-6">
      <ProfileForm initialValues={initialValues} validationSchema={ProfileValidationSchema} isEdit={!!id} />
    </div>
  )
}

export default ProfilePage
