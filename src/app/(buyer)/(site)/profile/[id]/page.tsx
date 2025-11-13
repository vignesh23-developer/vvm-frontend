'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ProfileForm from '../(forms)/ProfileForm'
import { ProfileValidationSchema } from '../(validation)/ProfileValidation'

const ProfilePage = () => {
  const { id } = useParams()
  const [initialValues, setInitialValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
  })

  useEffect(() => {
    if (id) {
      const fetchUserProfile = async () => {
        // Simulate API fetch
        const userData = {
          firstName: 'Umar',
          lastName: 'Farooq',
          email: 'umarfarooq.asd@gmail.com',
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
