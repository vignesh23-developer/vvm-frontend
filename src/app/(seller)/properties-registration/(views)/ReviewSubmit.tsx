'use client'

import { FormikProps } from 'formik'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { PropertyCreationFormValues } from '../page'
import { PropertyCategory } from '@/app/(seller)/properties-registration/(dto)/properties_registration_dto'
import { getLocalStorageItem, removeLocalStorageItem } from '@/utils/local_storage/local_storage_handler'
import { LOCAL_STORAGE_NAME } from '@/utils/local_storage/local_storage_constant'
import { useRouter } from 'next/navigation'
import PropertyCard from '@/components/buyer/PropertyCard/PropertyCard'
import usePropertiesDetail from '@/app/(buyer)/(site)/propertyDetails/(hooks)/usePropertiesHook'
import { appEndpoints } from '@/services/endpoints'
import { postMethod } from '@/services/service'
import { PropertyDetailsResponseDto } from '@/app/(buyer)/(site)/propertyDetails/dto/propertiesDetailDto'
import ApproveOrRejectPropertyModal from '@/components/ui/CustomComponent/Modal/ApproveOrReject/ApproveOrRejectModal'

interface ListingDetails {
  type?: string
  purpose?: string
  price?: string
  size?: string
  location?: string
  contact?: string
}

interface Step6ReviewSubmitProps {
  listingData?: Partial<ListingDetails>
  onSubmit?: (agreedToTerms: boolean) => void
  formik: FormikProps<PropertyCreationFormValues>
  propertyCategoryData: PropertyCategory[]
}
interface UserData {
  id: string
  firstName: string
  lastName: string
  email: string
}

export default function Step6ReviewSubmit({ listingData, onSubmit, formik, propertyCategoryData }: Step6ReviewSubmitProps) {
  // only formik is currently accepted for potential future use
  const t = useTranslations()
  const { values } = formik
  const propertyID = getLocalStorageItem(LOCAL_STORAGE_NAME.propertyId) as string | undefined
  const [userValue, setUserValue] = useState<UserData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<PropertyDetailsResponseDto | null>(null)
  const [modalAction, setModalAction] = useState<string>('')
  const [comment, setComment] = useState('')
  const [rejectReason, setRejectReason] = useState('')
  const { propertyDetailsData, propertyDetailsRefresh } = usePropertiesDetail({ id: propertyID })

  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const userDetails = getLocalStorageItem(LOCAL_STORAGE_NAME.userData) as UserData
    if (userDetails) {
      setUserValue(userDetails)
    }
  }, [propertyDetailsData])

  const handleSubmit = () => {
    removeLocalStorageItem(LOCAL_STORAGE_NAME?.propertyId)
    removeLocalStorageItem(LOCAL_STORAGE_NAME?.propertyDetails)
    router.push('/properties')
  }

  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => setAgreedToTerms(e.target.checked)

  const handleFavorite = async (propertyId: string) => {
    try {
      const response = await postMethod(appEndpoints.toggleFavorite, { entity_type: 'property', entity_id: propertyId })

      propertyDetailsRefresh()
    } catch (err) {
      console.error('Error updating favorite:', err)
    }
  }

  const openModal = (property: PropertyDetailsResponseDto, action: 'approve' | 'reject') => {
    setSelectedProperty(property)
    setModalAction(action)
    setComment('')
    setRejectReason('')
    setIsModalOpen(true)
  }

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 bg-white">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Review Your Property</h1>

        <div className="space-y-4">
          <div className="mb-10 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition p-4">
            {propertyDetailsData && (
              <PropertyCard
                key={String(propertyDetailsData.id ?? 'preview-id')}
                {...propertyDetailsData}
                id={String(propertyDetailsData.id ?? 'preview-id')}
                language={t}
                handleFavorite={handleFavorite}
                handleShare={() => console.log('Share', propertyDetailsData.id)}
                isUserFavorited={Boolean(propertyDetailsData.is_user_favorite)}
                subtitle={propertyCategoryData?.find(c => c.id === propertyDetailsData.property_category_id)?.name ?? ''}
                property_size_unit={propertyDetailsData?.property_size_unit ?? undefined}
                media={Array.isArray(propertyDetailsData.media) ? propertyDetailsData.media : []}
                propertyPreviewMode={true}
              />
            )}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">Terms & Conditions</h2>

          <div className="space-y-3 mb-6">
            <div className="flex items-start">
              <span className="text-blue-700 mr-2 mt-0.5">•</span>
              <span className="text-blue-700 text-sm">Your listing will be reviewed within 24 hours</span>
            </div>

            <div className="flex items-start">
              <span className="text-blue-700 mr-2 mt-0.5">•</span>
              <span className="text-blue-700 text-sm">Ensure all information is accurate and up-to-date</span>
            </div>

            <div className="flex items-start">
              <span className="text-blue-700 mr-2 mt-0.5">•</span>
              <span className="text-blue-700 text-sm">You can edit your listing anytime from your dashboard</span>
            </div>

            <div className="flex items-start">
              <span className="text-blue-700 mr-2 mt-0.5">•</span>
              <span className="text-blue-700 text-sm">Free listings are valid for 30 days</span>
            </div>
          </div>

          <div className="flex items-start">
            <input
              id="terms-checkbox"
              type="checkbox"
              checked={agreedToTerms}
              onChange={handleTermsChange}
              className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2 mt-0.5"
            />
            <label htmlFor="terms-checkbox" className="ml-3 text-sm text-gray-700 cursor-pointer">
              I agree to the terms and conditions
            </label>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={handleSubmit}
            disabled={!agreedToTerms}
            className={`w-full md:w-auto px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
              agreedToTerms ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Submit Listing
          </button>
        </div>
      </div>

      <ApproveOrRejectPropertyModal
        approveOrRejectModalOpen={isModalOpen}
        setApproveOrRejectModalOpen={setIsModalOpen}
        approveOrRejectReason={modalAction}
        userId={userValue ? userValue?.id : ''}
        property={selectedProperty}
      />
    </>
  )
}
