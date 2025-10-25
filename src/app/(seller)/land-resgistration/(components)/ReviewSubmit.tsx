'use client'

import { useState } from 'react'

interface ListingDetails {
  type: string
  purpose: string
  price: string
  size: string
  location: string
  contact: string
}

interface Step5ReviewSubmitProps {
  listingData?: Partial<ListingDetails>
  onSubmit?: (agreedToTerms: boolean) => void
}

export default function Step5ReviewSubmit({
  listingData,
  onSubmit,
}: Step5ReviewSubmitProps) {
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  // Default listing data with empty values
  const defaultListing: ListingDetails = {
    type: '',
    purpose: '',
    price: '₹',
    size: 'Sqft',
    location: 'asdas, Coimbatore',
    contact: '',
  }

  // Merge provided data with defaults
  const listing = { ...defaultListing, ...listingData }

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(agreedToTerms)
    }
  }

  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgreedToTerms(e.target.checked)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Review Your Listing
      </h1>

      {/* Listing Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 mb-8">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Type */}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-700 mb-1">
              Type:
            </span>
            <span className="text-gray-900">{listing.type || '-'}</span>
          </div>

          {/* Price */}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-700 mb-1">
              Price:
            </span>
            <span className="text-gray-900">{listing.price}</span>
          </div>

          {/* Location */}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-700 mb-1">
              Location:
            </span>
            <span className="text-gray-900">{listing.location}</span>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Purpose */}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-700 mb-1">
              Purpose:
            </span>
            <span className="text-gray-900">{listing.purpose || '-'}</span>
          </div>

          {/* Size */}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-700 mb-1">
              Size:
            </span>
            <span className="text-gray-900">{listing.size}</span>
          </div>

          {/* Contact */}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-700 mb-1">
              Contact:
            </span>
            <span className="text-gray-900">{listing.contact || '-'}</span>
          </div>
        </div>
      </div>

      {/* Terms & Conditions Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-4">
          Terms & Conditions
        </h2>

        <div className="space-y-3 mb-6">
          <div className="flex items-start">
            <span className="text-blue-700 mr-2 mt-0.5">•</span>
            <span className="text-blue-700 text-sm">
              Your listing will be reviewed within 24 hours
            </span>
          </div>

          <div className="flex items-start">
            <span className="text-blue-700 mr-2 mt-0.5">•</span>
            <span className="text-blue-700 text-sm">
              Ensure all information is accurate and up-to-date
            </span>
          </div>

          <div className="flex items-start">
            <span className="text-blue-700 mr-2 mt-0.5">•</span>
            <span className="text-blue-700 text-sm">
              You can edit your listing anytime from your dashboard
            </span>
          </div>

          <div className="flex items-start">
            <span className="text-blue-700 mr-2 mt-0.5">•</span>
            <span className="text-blue-700 text-sm">
              Free listings are valid for 30 days
            </span>
          </div>
        </div>

        {/* Checkbox for Terms Agreement */}
        <div className="flex items-start">
          <input
            id="terms-checkbox"
            type="checkbox"
            checked={agreedToTerms}
            onChange={handleTermsChange}
            className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2 mt-0.5"
          />
          <label
            htmlFor="terms-checkbox"
            className="ml-3 text-sm text-gray-700 cursor-pointer"
          >
            I agree to the terms and conditions
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-8">
        <button
          onClick={handleSubmit}
          disabled={!agreedToTerms}
          className={`w-full md:w-auto px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
            agreedToTerms
              ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Submit Listing
        </button>
      </div>
    </div>
  )
}
