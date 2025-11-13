'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Formik, Form } from 'formik'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'
import { companyProfileSchema } from '@/app/(seller)/company-profile/(validations)/companyProfileSchema'
import Button from '@/components/ui/CustomComponent/Button/Button'
import LocationPickerModal, { AddressParts } from '@/components/ui/map/LocationPickerModal'
import { appEndpoints } from '@/services/endpoints'
import { MapPin } from 'lucide-react'
import { getMethod, postMethod } from '@/services/service'
import { ResponseDTO } from '@/components/dto/response_dto'
import ProfileNameField from './ProfileNameField'

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
  isEdit?: boolean
}

const CompanyProfileForm: React.FC<CompanyProfileFormProps> = ({ initialValues, onSubmit, submitLabel, isEdit = false }) => {
  const router = useRouter()
  const [isMapView, setIsMapView] = useState(false)

  // verification state for profileName
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'verifying' | 'available' | 'taken' | 'error'>('idle')
  const [verifiedFor, setVerifiedFor] = useState<string | null>(null)

  const handleVerifyProfileName = async (name?: string) => {
    const profileName = (name ?? '').trim()
    if (!profileName) {
      setVerifyStatus('error')
      setVerifiedFor(null)
      return
    }

    // If editing and name is unchanged from initial values, treat as available
    if (isEdit && profileName === (initialValues.profileName ?? '').trim()) {
      setVerifyStatus('available')
      setVerifiedFor(profileName)
      return
    }

    try {
      setVerifyStatus('verifying')
      // replace endpoint with your real verification endpoint if available
      const payload = {
        profileName: profileName,
      }
      const res = (await postMethod(appEndpoints.validateProfileName, payload)) as ResponseDTO
      console.log(res, res.data.isAvailable, 'response')
      if (res?.data?.isAvailable) {
        setVerifyStatus('available')
        setVerifiedFor(profileName)
      } else {
        setVerifyStatus('taken')
        setVerifiedFor(null)
      }
    } catch (err) {
      console.error('verify profile name error', err)
      setVerifyStatus('error')
      setVerifiedFor(null)
    }
  }

  // Normalize initialValues so all form fields are defined (prevents uncontrolled -> controlled warnings)
  const normalizedInitialValues: CompanyFormValues = {
    companyName: initialValues?.companyName ?? '',
    userId: initialValues?.userId ?? '',
    profileName: initialValues?.profileName ?? '',
    shortTitle: initialValues?.shortTitle ?? '',
    description: initialValues?.description ?? '',
    gstNumber: initialValues?.gstNumber ?? '',
    contact_name: initialValues?.contact_name ?? '',
    contact_phone: initialValues?.contact_phone ?? '',
    contact_email: initialValues?.contact_email ?? '',
    expiryDays: initialValues?.expiryDays ?? '',
    address_line: initialValues?.address_line ?? '',
    city: initialValues?.city ?? '',
    district: initialValues?.district ?? '',
    state: initialValues?.state ?? '',
    postal_code: initialValues?.postal_code ?? '',
    country: initialValues?.country ?? '',
    latitude: typeof initialValues?.latitude === 'number' ? initialValues.latitude : Number(initialValues?.latitude ?? 0),
    longitude: typeof initialValues?.longitude === 'number' ? initialValues.longitude : Number(initialValues?.longitude ?? 0),
  }

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-md rounded-xl p-6 md:p-8 mt-8 mb-8 border border-gray-100">
      <h2 className="text-2xl font-semibold text-gray-800 mb-5">{isEdit ? 'Edit Company Profile' : 'Create Company Profile'}</h2>

      <Formik initialValues={normalizedInitialValues} validationSchema={companyProfileSchema} enableReinitialize onSubmit={onSubmit}>
        {formikProps => {
          const { isSubmitting, setFieldValue, values } = formikProps
          const currentProfileName = (values.profileName ?? '').trim()
          const initialProfileName = (initialValues.profileName ?? '').trim()
          const nameChanged = currentProfileName !== initialProfileName
          const isVerifiedNow = verifiedFor === currentProfileName && verifyStatus === 'available'

          // Determine whether submit should be allowed
          const submitAllowed = isEdit ? !nameChanged || isVerifiedNow : isVerifiedNow

          return (
            <Form className="space-y-6">
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

              {/* Contact Information */}
              <section>
                <h3 className="text-lg font-medium text-gray-700 mb-3 border-l-4 border-black pl-2">Contact Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {/* <FormikTextField label="Profile Name" name="profileName" placeholder="Enter profile name" /> */}
                  <ProfileNameField />
                  {/* <div className="flex items-center gap-2">
                    <Button type="button" onClick={() => handleVerifyProfileName(currentProfileName)} className="">
                      {verifyStatus === 'verifying' ? 'Verifying...' : 'Verify'}
                    </Button>
                    <div className="text-sm">
                      {verifyStatus === 'available' && verifiedFor === currentProfileName && <span className="text-green-600">Available</span>}
                      {verifyStatus === 'taken' && <span className="text-red-600">Taken</span>}
                      {verifyStatus === 'error' && <span className="text-yellow-600">Error</span>}
                    </div>
                  </div> */}
                  <FormikTextField label="Contact Name" name="contact_name" placeholder="Enter contact name" />
                  <FormikTextField label="Contact Phone" name="contact_phone" placeholder="Enter contact phone" />
                  <FormikTextField label="Contact Email" type="email" name="contact_email" placeholder="Enter contact email" />
                </div>
              </section>

              {/* Address Information */}
              <section>
                <h3 className="text-lg font-medium text-gray-700 mb-3 border-l-4 border-black pl-2">Address Information</h3>
                <FormikTextField label="Address Line" name="address_line" placeholder="Enter address line" />
                {/* <LocationSearchInput onLocationSelect={handleSelect} /> */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <FormikTextField label="City" name="city" placeholder="Enter city" />
                  <FormikTextField label="District" name="district" placeholder="Enter district" />
                  <FormikTextField label="State" name="state" placeholder="Enter state" disabled={true} />
                  <FormikTextField label="Postal Code" name="postal_code" placeholder="Enter postal code" />
                  <FormikTextField label="Country" name="country" placeholder="Enter country" disabled={true} />
                </div>
                <label className="block text-sm font-semibold text-gray-700 mt-2 mb-2">Select Your Location Via Map</label>
                <Button
                  type="button"
                  onClick={() => setIsMapView(!isMapView)}
                  className="w-full px-5 py-2 flex justify-center rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium transition col-span-2 flex items-center justify-center border border-gray-300"
                >
                  <MapPin className="inline-block mr-2" color="red" size={20} /> Pick Location from Map
                </Button>
              </section>

              {/* Buttons */}
              <div className="flex justify-end items-center gap-3 pt-3 border-t border-gray-100">
                <Button
                  type="button"
                  onClick={() => router.push('/home')}
                  className="px-5 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium transition"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={isSubmitting || !submitAllowed}
                  onClick={() => {}}
                  className={`px-5 py-2 rounded-md text-white font-medium transition ${
                    isSubmitting || !submitAllowed ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
                  }`}
                >
                  {isSubmitting
                    ? isEdit
                      ? 'Updating...'
                      : 'Creating...'
                    : submitLabel || (isEdit ? 'Update Company Profile' : 'Create Company Profile')}
                </Button>
              </div>
              <LocationPickerModal
                open={isMapView}
                setOpen={setIsMapView}
                initialLat={values?.latitude}
                initialLng={values?.longitude}
                onLocationSelect={function (lat: number, lng: number, address: AddressParts, fullAddress: string) {
                  console.log('loc select', address)
                  setFieldValue('latitude', lat ?? '')
                  setFieldValue('longitude', lng ?? '')
                  setFieldValue('district', address?.district ?? '')
                  setFieldValue('city', address?.city ?? '')
                  setFieldValue('state', address?.state ?? '')
                  setFieldValue('postal_code', address?.postalCode ?? '')
                  setFieldValue('country', address?.country ?? '')
                  setFieldValue('address_line', fullAddress ?? '')
                }}
              />
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}

export default CompanyProfileForm
