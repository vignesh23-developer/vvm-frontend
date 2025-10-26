'use client'

import { Formik } from 'formik'
import * as Yup from 'yup'
import {
  Home,
  MapPin,
  Star,
  Camera,
  Check,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react'
import React, { useState } from 'react'
import StepperComponent from '@/components/ui/CustomComponent/StepperComponent/StepperComponent'
import BasicDetailsStep1 from '../LandRegistrationSteps/BasicDetailsStep1'
import LocationPriceStep2 from '../LandRegistrationSteps/LocationPriceStep2'

// types/propertyListing.ts

export interface PropertyFeature {
  feature_category_id: string
  feature_group_id: string
  option_ids: string[]
}

export interface PropertyCategory {
  id: string
  name: string
}
export interface PropertyListing {
  title: string
  description: string
  property_category_id: PropertyCategory | string
  price: number
  price_unit: 'total' | 'per_sqft' | 'monthly' | string
  listing_type: 'SALE' | 'RENT' | 'LEASE'
  status: 'AVAILABLE' | 'SOLD' | 'PENDING' | string
  door_number: string
  street_name: string
  address_line: string
  city: string
  district: string
  state: string
  postal_code: string
  country: string
  latitude: number
  longitude: number
  agent_id: string
  is_published: boolean
  features: PropertyFeature[]
}

const LandRegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const steps = [
    {
      title: 'Step 1',
      subtitle: 'Basic Details',
      icon: <Home className="w-5 h-5" />,
    },
    {
      title: 'Step 2',
      subtitle: 'Location & Price',
      icon: <MapPin className="w-5 h-5" />,
    },
    {
      title: 'Step 3',
      subtitle: 'Photos & Contact',
      icon: <Camera className="w-5 h-5" />,
    },
    {
      title: 'Step 4',
      subtitle: 'Features & Amenities',
      icon: <Star className="w-5 h-5" />,
    },
    {
      title: 'Step 5',
      subtitle: 'Review & Submit',
      icon: <Check className="w-5 h-5" />,
    },
  ]

  const initialFormData: PropertyListing = {
    title: '',
    description: '',
    property_category_id: '',
    price: 0,
    price_unit: 'total',
    listing_type: 'SALE',
    status: 'AVAILABLE',
    door_number: '',
    street_name: '',
    address_line: '',
    city: '',
    district: '',
    state: '',
    postal_code: '',
    country: '',
    latitude: 0,
    longitude: 0,
    agent_id: '',
    is_published: false,
    features: [
      {
        feature_category_id: '',
        feature_group_id: '',
        option_ids: [],
      },
    ],
  }

  const handleNext = () => {
    // if (validateStep(currentStep)) {
    //   if (currentStep < steps.length) {

    //   } else {
    //     console.log('Form submitted:', formData)
    //   }
    // }
    setCurrentStep(prev => prev + 1)
  }

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1)
  }

  const validationSchema = Yup.object().shape({
    // Define validation schema for each step here
    title: Yup.string().required('Property title is required'),
    description: Yup.string().required('Property description is required'),
  })

  return (
    <div className="w-full px-4 py-6">
      <StepperComponent
        steps={steps}
        currentStep={currentStep}
        topText="Reach thousands of potential buyers and tenants"
      />

      {/* Form content for each step would go here */}
      <Formik
        initialValues={initialFormData}
        validationSchema={validationSchema}
        onSubmit={values => {
          console.log('Form submitted:', values)
        }}
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <div>
                {/* Step 1: Basic Details */}
                <BasicDetailsStep1 />
              </div>
            )}

            {currentStep === 2 && (
              <div>
                {/* Step 2: Location & Price */}
                <LocationPriceStep2 />
              </div>
            )}

            {currentStep === 3 && (
              <div>
                {/* Step 3: Photos & Contact */}
                <h2 className="text-2xl font-bold mb-4">Photos & Contact</h2>
              </div>
            )}
            {currentStep === 4 && (
              <div>
                {/* Step 4: Features & Amenities */}
                <h2 className="text-2xl font-bold mb-4">
                  Features & Amenities
                </h2>
              </div>
            )}

            {currentStep === 5 && (
              <div>
                {/* Step 5: Review & Submit */}
                <h2 className="text-2xl font-bold mb-4">Review & Submit</h2>
              </div>
            )}
          </form>
        )}
      </Formik>
      <div className="flex flex-col sm:flex-row justify-between gap-3 mt-8 pt-6 border-t border-gray-100 max-w-4xl mx-auto">
        {/* Previous Button */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentStep === 1}
          className="flex items-center gap-2 px-6 py-3 rounded-lg border text-gray-700 border-gray-300 hover:bg-gray-50 cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft size={20} /> Previous
        </button>

        {/* Next Button */}
        <button
          type="button"
          onClick={handleNext}
          disabled={currentStep === 5}
          className="flex items-center gap-2 px-8 py-3 rounded-lg bg-[#7B1E1E] text-white hover:bg-[#641717] cursor-pointer focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next Step <ArrowRight size={20} />
        </button>
      </div>
    </div>
  )
}

export default LandRegistrationForm
