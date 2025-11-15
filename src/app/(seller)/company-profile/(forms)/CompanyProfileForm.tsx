'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Formik, Form } from 'formik'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'
import ProfileNameField from './ProfileNameField'
import { companyProfileSchema } from '@/app/(seller)/company-profile/(validations)/companyProfileSchema'
import Button from '@/components/ui/CustomComponent/Button/Button'
import LocationPickerModal, { AddressParts } from '@/components/ui/map/LocationPickerModal'
import LocationSearchBox from '@/components/ui/map/LocationSearchInput'
import { appEndpoints } from '@/services/endpoints'
import { postMethod } from '@/services/service'
import { ResponseDTO } from '@/components/dto/response_dto'

export interface CompanyFormValues {
  companyName: string
  userId: string
  profileName: string
  shortTitle: string
  description: string
  gstNumber: string
  contact_name: string
  contact_phone: string
  contact_email: string
  expiryDays: number | string
  address_line: string
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
  onSubmit: (values: CompanyFormValues) => Promise<void>
  submitLabel?: string
  isEdit: boolean
}

const CompanyProfileForm: React.FC<CompanyProfileFormProps> = ({ initialValues, onSubmit, submitLabel, isEdit = false }) => {
  const router = useRouter()
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'verifying' | 'available' | 'taken' | 'error'>('idle')
  const [verifiedFor, setVerifiedFor] = useState<string | null>(null)

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
    expiryDays: initialValues.expiryDays ?? '',
    address_line: initialValues.address_line ?? '',
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
    setFieldValue('district', address?.district ?? '')
    setFieldValue('city', address?.city ?? '')
    setFieldValue('state', address?.state ?? '')
    setFieldValue('postal_code', address?.postalCode ?? '')
    setFieldValue('country', address?.country ?? '')
    setFieldValue('address_line', fullAddress ?? '')
  }

  console.log(' :', isEdit)

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-md rounded-xl p-6 md:p-8 mt-8 mb-8 border border-gray-100">
      <h2 className="text-2xl font-semibold text-gray-800 mb-5">{isEdit ? 'Edit Company Profile' : 'Create Company Profile'}</h2>

      <Formik initialValues={normalizedInitialValues} validationSchema={companyProfileSchema} enableReinitialize onSubmit={onSubmit}>
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
                  <FormikTextField label="Expiry Days" name="expiryDays" type="number" placeholder="Enter expiry days" />
                </div>
              </section>

              {/* Address Information */}
              <section>
                <h3 className="text-lg font-medium text-gray-700 mb-3 border-l-4 border-black pl-2">Address Information</h3>
                <LocationSearchBox
                  label="Full Address"
                  name="address_line"
                  placeholder="Enter address line"
                  value={values.address_line}
                  onSelectLocation={(lat, lng, fullAddress, parts) => handleLocationSelect(setFieldValue, lat, lng, parts, fullAddress)}
                />
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
                  <FormikTextField
                    label="Postal Code"
                    name="postal_code"
                    placeholder="Enter postal code"
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
                </div>
              </section>

              {/* Actions */}
              <div className="flex justify-end items-center gap-3 pt-3 border-t border-gray-100">
                <Button
                  type="button"
                  onClick={() => router.push('/home')}
                  className="px-5 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={isSubmitting || !submitAllowed}
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
    </div>
  )
}

export default CompanyProfileForm
