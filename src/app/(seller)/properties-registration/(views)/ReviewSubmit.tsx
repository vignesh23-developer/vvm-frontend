'use client'

import { FormikProps } from 'formik'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { PropertyCreationFormValues } from '../page'
import { PropertyCategory } from '@/app/(seller)/properties-registration/(dto)/properties_registration_dto'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import { useRouter } from 'next/navigation'
import PropertyCard from '@/components/buyer/PropertyCard/PropertyCard'
import usePropertiesDetail from '@/app/(buyer)/(site)/propertyDetails/(hooks)/usePropertiesHook'
import { appEndpoints } from '@/services/endpoints'
import { postMethod } from '@/services/service'
import { PropertyDetailsResponseDto } from '@/app/(buyer)/(site)/propertyDetails/dto/propertiesDetailDto'
import ApproveOrRejectPropertyModal from '@/components/ui/CustomComponent/Modal/ApproveOrReject/ApproveOrRejectModal'
import { useGlobalContext } from '@/hooks/GlobalContext/GlobalContext'
import SkeletonLoader from '@/components/ui/CustomComponent/SkeletonLoader/SkeletonLoader'
import PropertyOrAdsApproveRejectCard from '@/components/buyer/PropertyOrAdsApproveRejectCard/PropertyOrAdsCard'

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
  propertyId?: string
}
interface UserData {
  id: string
  firstName: string
  lastName: string
  email: string
}

export default function Step6ReviewSubmit({ listingData, onSubmit, formik, propertyCategoryData, propertyId }: Step6ReviewSubmitProps) {
  // only formik is currently accepted for potential future use
  const t = useTranslations()
  const { user } = useAuth()
  const { globalValue, reset } = useGlobalContext()
  const { values } = formik
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<PropertyDetailsResponseDto | null>(null)
  const [modalAction, setModalAction] = useState<string>('')
  const [comment, setComment] = useState('')
  const [rejectReason, setRejectReason] = useState('')
  // In edit mode, effectivePropertyId is passed from parent page via props or context?
  // Actually, page.tsx doesn't pass propertyId to Step6ReviewSubmit.
  // We should rely on globalValue AND propertiesId from context/url if globalValue is lost.
  const { propertyDetailsData, propertyDetailsFetchLoader, propertyDetailsRefresh } = usePropertiesDetail({ id: propertyId || globalValue || '' })

  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const router = useRouter()

  const handleSubmit = () => {
    reset()
    router.push('/properties/list')
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
      <div className="max-w-5xl mx-auto p-6 bg-white">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Review Your Property</h1>

        <div className="space-y-4">
          <div className="mb-10 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition p-4">
            {propertyDetailsFetchLoader && <SkeletonLoader />}
            {propertyDetailsData && (
              <PropertyOrAdsApproveRejectCard
                key={String(propertyDetailsData?.id ?? 'preview-id')}
                {...propertyDetailsData}
                id={String(propertyDetailsData?.id ?? 'preview-id')}
                language={t}
                handleFavorite={handleFavorite}
                handleShare={() => console.log('Share', propertyDetailsData?.id)}
                isUserFavorited={Boolean(propertyDetailsData?.is_user_favorite)}
                subtitle={propertyCategoryData?.find(c => c.id === propertyDetailsData?.property_category_id)?.name ?? ''}
                media={propertyDetailsData?.media ?? []}
                property_size_unit={propertyDetailsData?.property_size_unit ?? undefined}
                propertyPreviewMode={true}
                isPropertyOrAds="property"
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
              agreedToTerms
                ? 'bg-gradient-to-r from-yellow-500 to-yellow-600  hover:bg-blue-700 text-white cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
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
        userId={user ? user?.id : ''}
        property={selectedProperty}
      />
    </>
  )
}
