'use client'

import { useEffect, useState, useCallback } from 'react'
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

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [initialValues, setInitialValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
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
      const { firstName, lastName, email, profilePicture } = payload

      setImageUrl(profilePicture || null)
      setInitialValues({ firstName, lastName, email })
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
  const handleProfileImageSubmit = async (values: { file: File | null }, { resetForm }: { resetForm: () => void }) => {
    if (!values?.file) {
      toast.error('Please select an image before submitting.')
      return
    }

    try {
      const formData = new FormData()
      formData.append('file', values.file)

      const response: ResponseDTO = await postMethod(appEndpoints.uploadUserProfileImage, formData)

      if (Number(response?.status) === 201) {
        setImageUrl(response?.data?.profilePicture || null)
        toast.success('Profile image uploaded successfully!')

        resetForm()
        setIsModalOpen(false)
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
<<<<<<< HEAD
    <div className="p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="space-y-6">
        <ProfileForm initialValues={initialValues} validationSchema={ProfileValidationSchema} isEdit={!!id} />
      </div>
      <div className="space-y-6">
        <KYCStatus />
=======
    <div className="p-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
        {/* Left Column - Profile */}
        <div className="lg:row-span-2 bg-white shadow-md rounded-2xl p-4">
          <h2 className="text-center text-xl font-semibold text-gray-800">Edit Profile</h2>

          <LogoOrProfileImageUpload
            logoUrl={imageUrl || ''}
            onClick={() => setIsModalOpen(true)}
            label="Profile Image"
            title="Upload Profile Image"
            changeText="Change"
          />

          <ProfileForm initialValues={initialValues} validationSchema={ProfileValidationSchema} isEdit={!!id} />

          <UploadProfileImageModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            buttonText="Upload Image"
            modalTitle="Upload Profile Image"
            modalLabel="Profile Image"
            modalDescription="Kindly upload your profile image below 👇"
            onImageUploadSubmit={handleProfileImageSubmit}
          />
        </div>

        {/* Right Column - KYC + Wallet */}
        <div className="space-y-6">
          <KYCStatus />
          <WalletCard />
        </div>
>>>>>>> 34fb84ca8b39ba2d9e94ba34c4cc47984132ad21
      </div>
    </div>
  )
}

export default ProfilePage
