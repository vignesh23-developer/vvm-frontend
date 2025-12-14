'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Formik, Form } from 'formik'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'
import ProfileNameField from './ProfileNameField'
import { companyProfileSchema } from '@/app/(seller)/company-profile/(validations)/companyProfileSchema'
import Button from '@/components/ui/CustomComponent/Button/Button'
import LocationPickerModal, { AddressParts } from '@/components/ui/map/LocationPickerModal'
import LocationSearchBox from '@/components/ui/map/LocationSearchInput'
import { appEndpoints } from '@/services/endpoints'
import { postMethod, patchMethod } from '@/services/service'
import { ResponseDTO } from '@/components/dto/response_dto'
import { toast } from 'react-hot-toast'
import UploadProfileImageModal from '@/components/ui/LogoOrProfileImageUpload/modal/UploadProfileImage'
import LogoOrProfileImageUpload from '@/components/ui/LogoOrProfileImageUpload/LogoOrProfileImageUpload'

export interface CompanyFormValues {
  companyName: string
  userId: string
  profileName: string
  companyLogo?: string
  shortTitle: string
  description: string
  gstNumber: string
  contact_name: string
  contact_phone: string
  contact_email: string
  address_line: string
  door_number: string
  street_name: string
  city: string
  district: string
  state: string
  postal_code: string
  country: string
  latitude: number
  longitude: number
}

interface CompanyProfileFormProps {
  initialValues: CompanyFormValues
  companyProfileId?: string
  setUploadedImage?: (uploaded: boolean) => void
  imageVersion?: number
  submitLabel?: string
  isEdit: boolean
}

const CompanyProfileForm: React.FC<CompanyProfileFormProps> = ({
  initialValues,
  companyProfileId,
  setUploadedImage,
  submitLabel,
  isEdit = false,
  imageVersion,
}) => {
  const router = useRouter()
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'verifying' | 'available' | 'taken' | 'error'>('idle')
  const [verifiedFor, setVerifiedFor] = useState<string | null>(null)
  const [companyId, setCompanyId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Normalize Formik initial values
  const normalizedInitialValues: CompanyFormValues = {
    ...initialValues,
    companyName: initialValues.companyName ?? '',
    profileName: initialValues.profileName ?? '',
    shortTitle: initialValues.shortTitle ?? '',
    description: initialValues.description ?? '',
    gstNumber: initialValues.gstNumber ?? '',
    contact_name: initialValues.contact_name ?? '',
    contact_phone: initialValues.contact_phone ?? '',
    contact_email: initialValues.contact_email ?? '',
    address_line: initialValues.address_line ?? '',
    door_number: initialValues.door_number ?? '',
    street_name: initialValues.street_name ?? '',
    city: initialValues.city ?? '',
    district: initialValues.district ?? '',
    state: initialValues.state ?? '',
    postal_code: initialValues.postal_code ?? '',
    country: initialValues.country ?? '',
    latitude: Number(initialValues.latitude ?? 0),
    longitude: Number(initialValues.longitude ?? 0),
  }

  // Handle location selection
  const handleLocationSelect = (
    setFieldValue: (field: string, value: any) => void,
    lat: number,
    lng: number,
    address: AddressParts,
    fullAddress: string,
  ) => {
    setFieldValue('latitude', lat)
    setFieldValue('longitude', lng)
    setFieldValue('door_number', address?.doorNumber ?? '')
    setFieldValue('street_name', address?.streetName ?? '')
    setFieldValue('district', address?.district ?? '')
    setFieldValue('city', address?.city ?? '')
    setFieldValue('state', address?.state ?? '')
    setFieldValue('postal_code', address?.postalCode ?? '')
    setFieldValue('country', address?.country ?? '')
    setFieldValue('address_line', fullAddress ?? '')
  }

  const handleSubmit = async (values: any) => {
    console.log('Submitting values:', values)

    const payload = {
      userId: values.userId,
      companyName: values.companyName,
      profileName: values.profileName,
      shortTitle: values.shortTitle,
      description: values.description,
      gstNumber: values.gstNumber,
      contact_name: values.contact_name,
      contact_phone: values.contact_phone,
      contact_email: values.contact_email,
      address_line: values.address_line,
      door_number: values.door_number,
      street_name: values.street_name,
      city: values.city,
      district: values.district,
      state: values.state,
      postal_code: values.postal_code,
      country: values.country,
      latitude: Number(values.latitude),
      longitude: Number(values.longitude),
    }
    try {
      if (isEdit) {
        const response: ResponseDTO = await patchMethod(appEndpoints.updateCompanyProfile(companyProfileId as string), payload)
        if (response.status === '200') {
          toast.success('Company profile updated successfully!')
        } else {
          toast.error(response?.message || 'Update failed.')
        }
      } else if (!isEdit && companyId) {
        setIsModalOpen(true)
      } else {
        const response: ResponseDTO = await postMethod(appEndpoints.createCompanyProfile, payload)
        console.log('Create response:', response)
        if (response.status === '201') {
          // console.log('Created company ID:', response.data)
          setCompanyId(response.data.id)
          toast.success('Company profile created successfully!')
          setIsModalOpen(true)
        } else {
          toast.error(response?.message || 'Creation failed.')
        }
      }
    } catch (error: any) {
      console.error('Create failed:', error)
      toast.error(error?.message || 'Something went wrong!')
    }
  }

  const handleCompanyLogoSubmit = async (values: any, { resetForm }: any) => {
    try {
      if (!values.file) {
        toast.error('Please select a file before submitting.')
        return
      }

      const formData = new FormData()
      formData.append('file', values.file)
      const companyIdToUse = companyId || companyProfileId
      if (!companyIdToUse) {
        toast.error('Company ID is missing. Cannot upload logo.')
        return
      }
      const response: ResponseDTO = await postMethod(appEndpoints.uploadCompanyProfileImage(companyIdToUse as string), formData)
      // console.log('Upload response:', response.data.profile.id)
      if (Number(response.status) === 201) {
        const id = response?.data?.profile.id
        if (!isEdit) {
          resetForm()
          setIsModalOpen(false)
          toast.success('Company logo submitted successfully!')
          router.push(`/company-profile/${id}`)
        } else {
          resetForm()
          setIsModalOpen(false)
          if (setUploadedImage) setUploadedImage(true)
          toast.success('Company logo submitted successfully!')
        }
      } else {
        toast.error(response?.message || 'Upload failed.')
      }
    } catch (error) {
      toast.error('Failed to submit company logo. Please try again.')
    }
  }

  console.log('Rendering CompanyProfileForm with initialValues:', normalizedInitialValues)

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-md rounded-xl p-6 md:p-8 mt-8 mb-8 border border-gray-100">
      <h2 className="text-2xl font-semibold text-gray-800 mb-5">{isEdit ? 'Edit Company Profile' : 'Create Company Profile'}</h2>

      {isEdit && companyProfileId && (
        <LogoOrProfileImageUpload
          logoUrl={
            normalizedInitialValues.companyLogo
              ? normalizedInitialValues.companyLogo +
                (imageVersion ? (normalizedInitialValues.companyLogo.includes('?') ? '&' : '?') + `v=${imageVersion}` : '')
              : undefined
          }
          onClick={() => setIsModalOpen(true)}
          label="Company Logo"
          title="Add Logo"
          changeText="Change"
        />
      )}

      <Formik initialValues={normalizedInitialValues} validationSchema={companyProfileSchema} enableReinitialize onSubmit={handleSubmit}>
        {({ isSubmitting, setFieldValue, values }) => {
          const currentProfileName = (values.profileName ?? '').trim()
          const nameChanged = currentProfileName !== (initialValues.profileName ?? '').trim()
          const isVerifiedNow = verifiedFor === currentProfileName && verifyStatus === 'available'
          const submitAllowed = isEdit ? !nameChanged || isVerifiedNow : isVerifiedNow

          return (
            <Form className="space-y-6">
              {/* Contact Details */}
              <section>
                <h3 className="text-lg font-medium text-gray-700 mb-3 border-l-4 border-black pl-2">Contact Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <ProfileNameField />
                  <FormikTextField label="Contact Name" name="contact_name" placeholder="Enter contact name" />
                  <FormikTextField label="Contact Phone" name="contact_phone" placeholder="Enter contact phone" />
                  <FormikTextField label="Contact Email" type="email" name="contact_email" placeholder="Enter contact email" />
                </div>
              </section>

              {/* Company Details */}
              <section>
                <h3 className="text-lg font-medium text-gray-700 mb-3 border-l-4 border-black pl-2">Company Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <FormikTextField label="Company Name *" name="companyName" placeholder="Enter company name" />
                  <FormikTextField label="Short Title" name="shortTitle" placeholder="Enter short title" />
                  <div className="md:col-span-2">
                    <FormikTextField label="Description" as="textarea" name="description" placeholder="Enter description" rows={3} />
                  </div>
                  <FormikTextField label="GST Number" name="gstNumber" placeholder="Enter GST number" />
                </div>
              </section>

              {/* Address Information */}
              <section>
                <h3 className="text-lg font-medium text-gray-700 mb-3 border-l-4 border-black pl-2">Address Information</h3>
                <div className="mb-4">
                  <LocationSearchBox
                    label="Full Address"
                    name="address_line"
                    placeholder="Enter address line"
                    value={values.address_line}
                    onSelectLocation={(lat, lng, fullAddress, parts) => handleLocationSelect(setFieldValue, lat, lng, parts, fullAddress)}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormikTextField label="Door Number" name="door_number" placeholder="Enter door number" />
                  <FormikTextField label="Street Name" name="street_name" placeholder="Enter street name" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <FormikTextField
                    label="City"
                    name="city"
                    placeholder="Enter city"
                    readOnly
                    className="
    w-full 
    p-2 
    border border-gray-300 
    rounded-md 
    bg-gray-100 
    cursor-not-allowed
    text-gray-700
    focus:outline-none 
    focus:ring-0 
    focus:border-gray-300
  "
                  />
                  <FormikTextField
                    label="District"
                    name="district"
                    placeholder="Enter district"
                    readOnly
                    className="
    w-full 
    p-2 
    border border-gray-300 
    rounded-md 
    bg-gray-100 
    cursor-not-allowed
    text-gray-700
    focus:outline-none 
    focus:ring-0 
    focus:border-gray-300
  "
                  />
                  <FormikTextField
                    label="State"
                    name="state"
                    placeholder="Enter state"
                    readOnly
                    className="
    w-full 
    p-2 
    border border-gray-300 
    rounded-md 
    bg-gray-100 
    cursor-not-allowed
    text-gray-700
    focus:outline-none 
    focus:ring-0 
    focus:border-gray-300
  "
                  />
                  <FormikTextField
                    label="Country"
                    name="country"
                    placeholder="Enter country"
                    readOnly
                    className="
    w-full 
    p-2 
    border border-gray-300 
    rounded-md 
    bg-gray-100 
    cursor-not-allowed
    text-gray-700
    focus:outline-none 
    focus:ring-0 
    focus:border-gray-300
  "
                  />
                  <FormikTextField label="Postal Code" name="postal_code" placeholder="Enter postal code" />
                </div>
              </section>

              {/* Actions */}
              <div className="flex justify-end items-center gap-3 pt-3 border-t border-gray-100">
                <Button
                  type="button"
                  onClick={() => router.push('/')}
                  className="px-5 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-5 py-2 rounded-md text-white font-medium transition ${
                    isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
                  }`}
                >
                  {isSubmitting
                    ? isEdit
                      ? 'Updating...'
                      : 'Creating...'
                    : submitLabel || (isEdit ? 'Update Company Profile' : 'Create Company Profile')}
                </Button>
              </div>
            </Form>
          )
        }}
      </Formik>
      <UploadProfileImageModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        buttonText="Upload Logo"
        modalTitle="Upload Company Logo"
        modalLabel="Company Logo"
        modalDescription="Kindly upload your company logo below 👇"
        onImageUploadSubmit={handleCompanyLogoSubmit}
      />
    </div>
  )
}

export default CompanyProfileForm
