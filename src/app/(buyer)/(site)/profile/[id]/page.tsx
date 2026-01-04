'use client'

import { useEffect, useState, useCallback } from 'react'
import ChangePassword from '@/components/ui/ChangePassword/ChangePassword'
import { useRouter, useParams } from 'next/navigation'
import { appEndpoints } from '@/services/endpoints'
import { getMethod, postMethod } from '@/services/service'
import ProfileForm from '../(forms)/ProfileForm'
import { ProfileValidationSchema } from '../(validation)/ProfileValidation'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import KYCStatus from '@/components/kyc/KYCStatus'
import { ResponseDTO } from '@/components/dto/response_dto'
import UploadProfileImageModal from '@/components/ui/LogoOrProfileImageUpload/modal/UploadProfileImage'
import LogoOrProfileImageUpload from '@/components/ui/LogoOrProfileImageUpload/LogoOrProfileImageUpload'
import toast from 'react-hot-toast'
import CustomLoader from '@/components/ui/CustomComponent/Loader/CustomLoader'
import WalletCard from '@/components/buyer/Wallet/WalletCard'

const ProfilePage = () => {
  const { id } = useParams()
  const router = useRouter()
  const { token } = useAuth()

  /* const [isModalOpen, setIsModalOpen] = useState(false) // Removed as logic moved to ProfileForm */
  const [loading, setLoading] = useState(false)

  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [initialValues, setInitialValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  })

  // Redirect if no token
  useEffect(() => {
    if (!token) router.push('/login')
  }, [token, router])

  // Fetch user profile
  const fetchUserProfile = useCallback(async () => {
    try {
      setLoading(true)
      const response: ResponseDTO = await getMethod(appEndpoints.getUserProfile)

      const payload = response?.data ?? {}
      const { firstName, lastName, email, phoneNumber, profilePicture } = payload

      setImageUrl(profilePicture || null)
      setInitialValues({ firstName, lastName, email, phoneNumber })
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUserProfile()
  }, [id, fetchUserProfile])

  // Upload profile image
  const handleProfileImageSubmit = async (file: File, resetForm: () => void) => {
    if (!file) {
      toast.error('Please select an image before submitting.')
      return
    }

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response: ResponseDTO = await postMethod(appEndpoints.uploadUserProfileImage, formData)

      if (Number(response?.status) === 201) {
        setImageUrl(response?.data?.profilePicture || null)
        toast.success('Profile image uploaded successfully!')

        resetForm()
        fetchUserProfile()
      } else {
        toast.error(response?.message || 'Upload failed. Try again.')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload image. Please try again.')
    }
  }

  if (loading) {
    return <CustomLoader text="Loading profile..." />
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[3fr_1.5fr] lg:items-start">
        {/* LEFT COLUMN */}
        <div className="space-y-8">
          {loading ? (
            <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200">
              <span className="text-gray-500">Loading profile data...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="w-full">
                <ProfileForm
                  initialValues={initialValues}
                  validationSchema={ProfileValidationSchema}
                  isEdit={!!id}
                  profileImageUrl={imageUrl || undefined}
                  onImageUpload={handleProfileImageSubmit}
                />
              </div>
              <div className="w-full">
                <ChangePassword />
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-8">
          <KYCStatus />
          <WalletCard />
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
