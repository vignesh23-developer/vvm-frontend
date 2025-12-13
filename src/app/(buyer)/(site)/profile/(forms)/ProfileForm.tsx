'use client'

import React, { useState } from 'react'
import { Formik, Form } from 'formik'
import { useRouter } from 'next/navigation'
import { ResponseDTO } from '@/components/dto/response_dto'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'
import Button from '@/components/ui/CustomComponent/Button/Button'
import { patchMethod, postMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'
import Image from 'next/image'
import { Camera } from 'lucide-react'
import UploadProfileImageModal from '@/components/ui/LogoOrProfileImageUpload/modal/UploadProfileImage'
import LogoOrProfileImageUpload from '@/components/ui/LogoOrProfileImageUpload/LogoOrProfileImageUpload'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import toast from 'react-hot-toast'

interface ProfileFormProps {
  initialValues: {
    firstName: string
    lastName: string
    email: string
  }
  isEdit?: boolean
  validationSchema: any
  profileImageUrl?: string
  onImageUpload?: (file: File, resetForm: () => void) => void
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  initialValues,
  validationSchema,
  isEdit = false,
  profileImageUrl,
  onImageUpload
}) => {
  const [profileImage, setProfileImage] = useState<string | null>(profileImageUrl || null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const router = useRouter()
  const { setUser } = useAuth()

  // Update local state when prop changes
  React.useEffect(() => {
    if (profileImageUrl) {
      setProfileImage(profileImageUrl)
    }
  }, [profileImageUrl])

  const handleProfileImageSubmit = async (values: { file: File | null }, { resetForm }: any) => {
    if (onImageUpload && values.file) {
      onImageUpload(values.file, resetForm)
      setIsModalOpen(false)
    } else {
      toast.error("Image upload function not provided.")
    }
  }

  const handleSubmit = async (values: any) => {
    console.log('Form submitted with values:', values)
    const payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
    }

    try {
      if (isEdit) {
        const res = await patchMethod(appEndpoints.updateUserProfile, payload)
        if (res && Number(res.status) === 200) {
          setUser(res?.data as any)
          toast.success('Profile updated successfully!')
        } else {
          toast.error(res?.message || 'Failed to update profile.')
        }
      } else {
        console.log('Creating new profile...')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  return (
    <div className="max-w-lg mx-auto p-8 rounded-3xl bg-white shadow-xl shadow-yellow-900/10 border border-yellow-100">
      {/* Title */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-[#2a1407] mb-1">
          {isEdit ? 'Edit Profile' : 'Create Profile'}
        </h2>
        <p className="text-gray-500 text-sm">
          Your information helps us personalize your experience ✨
        </p>
      </div>

      {/* Profile Upload Circle */}
      {isEdit && (
        <div className="flex justify-center mb-8">
          <LogoOrProfileImageUpload
            logoUrl={profileImage || ''}
            onClick={() => setIsModalOpen(true)}
            label=""
            title="Upload Profile Image"
            changeText="Change"
          />
        </div>
      )}

      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
        {({ isSubmitting }) => (
          <Form className="space-y-6">
            <FormikTextField label="First Name" name="firstName" placeholder="Enter your first name" />
            <FormikTextField label="Last Name" name="lastName" placeholder="Enter your last name" />
            <FormikTextField label="Email" name="email" placeholder="Enter your email" />

            <Button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 
                ${isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#2a1407] hover:bg-[#4a230c] hover:shadow-xl'}`}
            >
              {isSubmitting ? 'Saving...' : isEdit ? 'Update Profile' : 'Create Profile'}
            </Button>
          </Form>
        )}
      </Formik>

      <UploadProfileImageModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        buttonText="Upload Image"
        onImageUploadSubmit={handleProfileImageSubmit}
        modalTitle="Upload Profile Image"
        modalLabel="Profile Image"
        modalDescription="Kindly upload your profile image below 👇"
      />
    </div>
  )
}

export default ProfileForm
