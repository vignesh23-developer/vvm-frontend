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
    <div className="py-6">
      <div className="max-w-md mx-auto bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-6">Edit Profile</h2>

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

      <KYCStatus />
    </div>
  )
}

export default ProfilePage
