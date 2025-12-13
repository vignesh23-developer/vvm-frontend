'use client'

import React, { useState } from 'react'
import { Formik, Form } from 'formik'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'
import Button from '@/components/ui/CustomComponent/Button/Button'
import { patchMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'
import Image from 'next/image'
import { Camera } from 'lucide-react'
import UploadProfileImageModal from '@/components/ui/LogoOrProfileImageUpload/modal/UploadProfileImage'
import LogoOrProfileImageUpload from '@/components/ui/LogoOrProfileImageUpload/LogoOrProfileImageUpload'

interface ProfileFormProps {
  initialValues: {
    firstName: string
    lastName: string
    email: string
  }
  isEdit?: boolean
  validationSchema: any
}

const ProfileForm: React.FC<ProfileFormProps> = ({ initialValues, validationSchema, isEdit = false }) => {
  const [profileImage, setProfileImage] = useState<string | null>(null)

  const handleImageUpload = (e: any) => {
    const file = e.target.files?.[0]
    if (file) setProfileImage(URL.createObjectURL(file))
  }
  const [isModalOpen, setIsModalOpen] = useState(false)

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
        console.log('Profile updated:', res)
      } else {
        console.log('Creating new profile...')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  const handleProfileImageSubmit = async (values: any, { resetForm }: any) => {
    console.log('Profile image upload submitted with values:', values)
    setIsModalOpen(false)
    // try {
    //   if (!values.file) {
    //     toast.error('Please select a file before submitting.')
    //     return
    //   }
    //   const formData = new FormData()
    //   formData.append('file', values.file)
    //   const companyIdToUse = companyId || companyProfileId
    //   if (!companyIdToUse) {
    //     toast.error('Company ID is missing. Cannot upload logo.')
    //     return
    //   }
    //   const response: ResponseDTO = await postMethod(appEndpoints.uploadCompanyProfileImage(companyIdToUse as string), formData)
    //   // console.log('Upload response:', response.data.profile.id)
    //   if (Number(response.status) === 201) {
    //     const id = response?.data?.profile.id
    //     if (!isEdit) {
    //       resetForm()
    //       setIsModalOpen(false)
    //       toast.success('Company logo submitted successfully!')
    //       router.push(`/company-profile/${id}`)
    //     } else {
    //       resetForm()
    //       setIsModalOpen(false)
    //       if (setUploadedImage) setUploadedImage(true)
    //       toast.success('Company logo submitted successfully!')
    //     }
    //   } else {
    //     toast.error(response?.message || 'Upload failed.')
    //   }
    // } catch (error) {
    //   toast.error('Failed to submit company logo. Please try again.')
    // }
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
      <div className="flex justify-center mb-8">
        <label className="relative cursor-pointer group">
          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />

          <div className="w-28 h-28 rounded-full border-4 border-[#2a1407]/20 overflow-hidden shadow-md group-hover:shadow-lg transition">
            {profileImage ? (
              <Image src={profileImage} alt="Profile" width={112} height={112} className="object-cover w-full h-full" />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-100">
                <Camera className="w-8 h-8 text-gray-500" />
              </div>
            )}
          </div>

          {/* Hover Overlay */}
          <span className="absolute bottom-2 right-2 bg-[#2a1407] text-white p-1 rounded-full shadow-md group-hover:scale-110 transition">
            <Camera size={14} />
          </span>
        </label>
      </div>

      {/* Form */}
      {isEdit && (
        <LogoOrProfileImageUpload
          logoUrl="" // Replace with actual profile image URL if available
          onClick={() => setIsModalOpen(true)}
          label="Profile Image"
          title="Upload Profile Image"
          changeText="Change"
        />
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
      />
    </div>
  )
}

export default ProfileForm
