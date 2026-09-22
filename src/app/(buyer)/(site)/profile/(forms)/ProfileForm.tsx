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
import { Camera, Mail, Phone, User, Check } from 'lucide-react'
import UploadProfileImageModal from '@/components/ui/LogoOrProfileImageUpload/modal/UploadProfileImage'
import LogoOrProfileImageUpload from '@/components/ui/LogoOrProfileImageUpload/LogoOrProfileImageUpload'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import toast from 'react-hot-toast'

interface ProfileFormProps {
  initialValues: {
    firstName: string
    lastName: string
    email: string
    phoneNumber?: string
  }
  isEdit?: boolean
  validationSchema: any
  profileImageUrl?: string
  onImageUpload?: (file: File, resetForm: () => void) => void
}

const ProfileForm: React.FC<ProfileFormProps> = ({ initialValues, validationSchema, isEdit = false, profileImageUrl, onImageUpload }) => {
  const [profileImage, setProfileImage] = useState<string | null>(profileImageUrl || null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const router = useRouter()
  const { setUser, user } = useAuth()

  // Get user initials
  const getUserInitials = () => {
    const first = initialValues.firstName?.[0]?.toUpperCase() || ''
    const last = initialValues.lastName?.[0]?.toUpperCase() || ''
    return first + last || 'U'
  }

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
      toast.error('Image upload function not provided.')
    }
  }

  const handleSubmit = async (values: any) => {
    // console.log('Form submitted with values:', values)
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
        // console.log('Creating new profile...')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-[#e8d5c4] shadow-sm overflow-hidden">
      {/* Header Section with Avatar */}
      <div className="bg-gradient-to-r from-[#fdf5eb] to-white p-6 border-b border-[#e8d5c4]">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
          {/* Avatar with Upload */}
          {isEdit && (
            <div className="relative group self-center sm:self-auto">
              <div
                onClick={() => setIsModalOpen(true)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setIsModalOpen(true)
                  }
                }}
                role="button"
                tabIndex={0}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#f4e1c2] border-2 border-[#cfae78]/40 flex items-center justify-center overflow-hidden cursor-pointer transition-all hover:border-[#b8864b]"
              >
                {profileImage ? (
                  <Image src={profileImage} alt="Profile" width={80} height={80} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[#2a1407] font-bold text-xl sm:text-2xl">{getUserInitials()}</span>
                )}
              </div>
              {/* Camera overlay */}
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                aria-label="Upload profile image"
                className="absolute -bottom-1 -right-1 w-7 h-7 sm:w-8 sm:h-8 bg-[#2a1407] rounded-lg flex items-center justify-center shadow-lg hover:bg-[#b8864b] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b8864b]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdf5eb]"
              >
                <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </button>
            </div>
          )}

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-bold text-[#2a1407] break-words">
              {initialValues.firstName || initialValues.lastName ? `${initialValues.firstName} ${initialValues.lastName}` : 'Your Profile'}
            </h2>
            <p className="text-sm text-[#7a4a1d] break-all sm:break-normal sm:truncate">{initialValues.email}</p>

            {/* Status Badges */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {user?.isEmailVerified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-medium rounded-full border border-green-200">
                  <Check className="w-3 h-3" />
                  Email Verified
                </span>
              )}
              {user?.isPhoneVerified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-medium rounded-full border border-blue-200">
                  <Check className="w-3 h-3" />
                  Phone Verified
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="p-6">
        <h3 className="text-xs font-semibold text-[#7a4a1d] mb-4 uppercase tracking-wide flex items-center gap-2">
          <User className="w-4 h-4 text-[#b8864b]" />
          Personal Information
        </h3>

        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
          {({ isSubmitting }) => (
            <Form className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormikTextField
                  label="First Name"
                  name="firstName"
                  placeholder="Enter your first name"
                  className="w-full px-4 py-3 bg-[#fdf5eb]/50 border border-[#e8d5c4] rounded-xl text-sm text-[#2a1407] focus:outline-none focus:border-[#b8864b] focus:ring-2 focus:ring-[#b8864b]/10 transition-all"
                />
                <FormikTextField
                  label="Last Name"
                  name="lastName"
                  placeholder="Enter your last name"
                  className="w-full px-4 py-3 bg-[#fdf5eb]/50 border border-[#e8d5c4] rounded-xl text-sm text-[#2a1407] focus:outline-none focus:border-[#b8864b] focus:ring-2 focus:ring-[#b8864b]/10 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <FormikTextField
                    label="Email"
                    name="email"
                    placeholder="Enter your email"
                    readOnly
                    className="w-full px-4 py-3 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-500 cursor-not-allowed"
                  />
                  {user?.isEmailVerified && (
                    <span className="absolute right-3 top-9 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-green-600" />
                    </span>
                  )}
                </div>

                <FormikTextField
                  label="Phone Number"
                  name="phoneNumber"
                  placeholder="Enter your phone number"
                  readOnly
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-500 cursor-not-allowed"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-3 text-white font-semibold text-sm rounded-xl shadow-sm transition-all ${
                    isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#2a1407] hover:bg-[#3d2415] hover:shadow-md'
                  }`}
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      {/* Upload Modal */}
      <UploadProfileImageModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        buttonText="Upload Image"
        onImageUploadSubmit={handleProfileImageSubmit}
        modalTitle="Upload Profile Image"
        modalLabel="Profile Image"
        modalDescription="Choose a profile picture to upload"
      />
    </div>
  )
}

export default ProfileForm
