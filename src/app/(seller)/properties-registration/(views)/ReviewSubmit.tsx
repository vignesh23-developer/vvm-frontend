'use client'

import { FormikProps } from 'formik'
import { useState, useMemo } from 'react'
import { PropertyCreationFormValues } from '../page'
import { PropertyCategory } from '@/app/(seller)/properties-registration/(dto)/properties_registration_dto'
import { getLocalStorageItem, removeLocalStorageItem } from '@/utils/local_storage/local_storage_handler'
import { LOCAL_STORAGE_NAME } from '@/utils/local_storage/local_storage_constant'
import { useRouter } from 'next/navigation'
import PropertyCard from '@/components/buyer/PropertyCard/PropertyCard'
import usePropertiesDetail from '@/app/(buyer)/(site)/propertyDetails/(hooks)/usePropertiesHook'

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

export default function Step6ReviewSubmit({ listingData, onSubmit, formik, propertyCategoryData }: Step6ReviewSubmitProps) {
  // only formik is currently accepted for potential future use
  const { values } = formik
  const propertyID = getLocalStorageItem(LOCAL_STORAGE_NAME.propertyId) as string | undefined
  const { propertyDetailsData } = usePropertiesDetail({ id: propertyID })

  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const router = useRouter()

  const handleSubmit = () => {
    removeLocalStorageItem(LOCAL_STORAGE_NAME?.propertyId)
    removeLocalStorageItem(LOCAL_STORAGE_NAME?.propertyDetails)
    router.push('/properties')
  }

  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => setAgreedToTerms(e.target.checked)

  // Build props for PropertyCard — important: pass a `media` array so PropertyCard can render images
  const cardProps = useMemo(() => {
    const media = Array.isArray(propertyDetailsData?.media) ? propertyDetailsData!.media : []

    return {
      id: String(propertyDetailsData?.id ?? 'preview-id'),
      title: propertyDetailsData?.title ?? 'Untitled Property',
      description: propertyDetailsData?.description ?? '',
      media,
      property_category_id: propertyDetailsData?.property_category_id ?? '',
      price: String(propertyDetailsData?.price ?? ''),
      price_unit: propertyDetailsData?.price_unit ?? 'total',
      property_size: propertyDetailsData?.property_size ?? '',
      property_size_unit: propertyDetailsData?.property_size_unit ?? '',
      listing_type: (propertyDetailsData?.listing_type ?? 'SALE').toUpperCase(),
      status: propertyDetailsData?.status ?? 'AVAILABLE',
      door_number: propertyDetailsData?.door_number ?? '',
      street_name: propertyDetailsData?.street_name ?? '',
      address_line: propertyDetailsData?.address_line ?? '',
      city: propertyDetailsData?.city ?? '',
      district: propertyDetailsData?.district ?? '',
      state: propertyDetailsData?.state ?? '',
      postal_code: propertyDetailsData?.postal_code ?? '',
      country: propertyDetailsData?.country ?? '',
      latitude: String(propertyDetailsData?.latitude ?? ''),
      longitude: String(propertyDetailsData?.longitude ?? ''),
      owner_id: propertyDetailsData?.owner_id ?? '',
      agent_id: propertyDetailsData?.agent_id ?? '',
      approval_status: propertyDetailsData?.approval_status ?? 'UNDER_REVIEW',
      is_published: propertyDetailsData?.is_published ?? true,
      is_verified: propertyDetailsData?.is_verified ?? false,
      is_premium: propertyDetailsData?.is_premium ?? false,
      is_featured: propertyDetailsData?.is_featured ?? false,
      is_active: propertyDetailsData?.is_active ?? true,
      slug: propertyDetailsData?.slug ?? null,
      meta_description: propertyDetailsData?.meta_description ?? null,
      meta_keywords: propertyDetailsData?.meta_keywords ?? null,
      view_count: propertyDetailsData?.view_count ?? 0,
      favorite_count: propertyDetailsData?.favorite_count ?? 0,
      contact_count: propertyDetailsData?.contact_count ?? 0,
      created_at: propertyDetailsData?.created_at ?? new Date().toISOString(),
      updated_at: propertyDetailsData?.updated_at ?? new Date().toISOString(),
      published_at: propertyDetailsData?.published_at ?? null,
      approved_at: propertyDetailsData?.approved_at ?? null,
      subtitle: propertyCategoryData?.find(c => c.id === propertyDetailsData?.property_category_id)?.name ?? '',
      propertyReview: true,
    }
  }, [propertyDetailsData, propertyCategoryData])

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Review Your Property</h1>

      <div className="space-y-4">
        <div className="mb-10 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition p-4">
          <PropertyCard {...(cardProps as any)} />
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
  )
}
