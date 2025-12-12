'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ProfileForm from '../(forms)/ProfileForm'
import { ProfileValidationSchema } from '../(validation)/ProfileValidation'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import KYCStatus from '@/components/kyc/KYCStatus'
import WalletCard from '@/components/buyer/Wallet/WalletCard'

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 auto-rows-min">
        {/* Left Column - Profile Form (spans 2 rows on larger screens) */}
        <div className="lg:row-span-2">
          <ProfileForm initialValues={initialValues} validationSchema={ProfileValidationSchema} isEdit={!!id} />
        </div>
        
        {/* Right Column - KYC Status (row 1) */}
        <div>
          <KYCStatus />
        </div>
        
        {/* Right Column - Wallet Card (row 2) */}
        <div>
          <WalletCard />
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
