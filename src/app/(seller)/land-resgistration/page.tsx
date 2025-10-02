'use client'

import {
  CheckCircle,
  Home,
  MapPin,
  Star,
  Camera,
  Check,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react'
import { useState } from 'react'

// Import step components
import Step1BasicDetails from '../../../components/seller/BasicDetails'
import Step2LocationPrice from '../../../components/seller/LocationPrice'
import Step3FeaturesAmenities from '../../../components/seller/FeaturesAmenities'
import Step4PhotosContact from '../../../components/seller/PhotosContact'
import Step5ReviewSubmit from '../../../components/seller/ReviewSubmit'

type PropertyType = 'Land' | 'Residential' | 'Commercial' | 'Plot'
type PurposeType = 'Sale' | 'Rent' | 'Lease'

type Step = {
  title: string
  subtitle: string
  icon: React.ReactNode
}

type FormData = {
  propertyTitle: string
  propertyType: PropertyType | ''
  purpose: PurposeType | ''
  description: string
}

type FormErrors = Partial<Record<keyof FormData, string>>

export default function ProgressSteps() {
  const steps: Step[] = [
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
      subtitle: 'Features & Amenities',
      icon: <Star className="w-5 h-5" />,
    },
    {
      title: 'Step 4',
      subtitle: 'Photos & Contact',
      icon: <Camera className="w-5 h-5" />,
    },
    {
      title: 'Step 5',
      subtitle: 'Review & Submit',
      icon: <Check className="w-5 h-5" />,
    },
  ]

  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    propertyTitle: '',
    propertyType: '',
    purpose: '',
    description: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})

  // const validateStep = (step: number): boolean => {
  //   const newErrors: FormErrors = {}

  //   if (step === 1) {
  //     if (!formData.propertyTitle.trim())
  //       newErrors.propertyTitle = 'Property title is required'
  //     if (!formData.propertyType)
  //       newErrors.propertyType = 'Property type is required'
  //     if (!formData.purpose) newErrors.purpose = 'Purpose is required'
  //     if (!formData.description.trim())
  //       newErrors.description = 'Property description is required'
  //   }

  //   setErrors(newErrors)
  //   return Object.keys(newErrors).length === 0
  // }

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

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  //   step 2

  const [formDataStep2, setFormDataStep2] = useState({
    district: '',
    city: '',
    address: '',
    price: '',
    size: '',
    unit: 'Sqft',
  })

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target
    setFormDataStep2(prev => ({ ...prev, [name]: value }))
  }

  // Step 3 - Amenities
  interface Amenity {
    id: string
    name: string
    selected: boolean
  }

  const predefinedAmenities = [
    'Parking',
    'Garden',
    'Swimming Pool',
    'Gym',
    'Security',
    'Elevator',
    'Power Backup',
    'Water Supply',
    'Internet',
    'Club House',
    'Children Play Area',
    'Jogging Track',
    'CCTV',
    'Intercom',
    'Maintenance Staff',
    'Waste Management',
  ]

  const [amenities, setAmenities] = useState<Amenity[]>(
    predefinedAmenities.map((name, i) => ({
      id: `amenity-${i}`,
      name,
      selected: false,
    })),
  )

  // Step 4 - Photos & Contact
  interface ContactFormData {
    contactName: string
    phoneNumber: string
    whatsappNumber: string
    emailAddress: string
    boostListing: boolean
  }

  interface UploadedFile {
    file: File
    preview: string
  }

  const [contactData, setContactData] = useState<ContactFormData>({
    contactName: '',
    phoneNumber: '',
    whatsappNumber: '',
    emailAddress: '',
    boostListing: false,
  })

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

  // Step 5 - Review & Submit
  const listingData = {}

  const handleSubmit = () => {
    console.log('Form submitted with all data:', {
      step1: formData,
      step2: formDataStep2,
      step3: { amenities: amenities.filter(a => a.selected) },
      step4: { contactData, uploadedFiles },
    })
  }

  return (
    <div className="w-full px-4 py-6">
      {/* Progress Stepper */}
      <div className="flex flex-col items-center">
        {/* top text */}
        <p className="mb-6 text-lg text-gray-500 text-center max-w-md">
          Reach thousands of potential buyers and tenants
        </p>
        {/* Steps */}
        <div className="flex w-full max-w-5xl justify-between relative">
          {steps.map((step, idx) => {
            const isActive = idx + 1 === currentStep
            const isCompleted = idx + 1 < currentStep
            const isLast = idx === steps.length - 1

            return (
              <div
                key={idx}
                className="flex flex-col items-center flex-1 relative"
              >
                {/* Circle with icon */}
                <div
                  className={`w-10 h-12 flex items-center justify-center rounded-full border transition-all
              ${
                isCompleted
                  ? 'bg-[#7B1E1E] border-[#7B1E1E] text-white'
                  : isActive
                  ? 'bg-[#7B1E1E] border-[#7B1E1E] text-white'
                  : 'bg-gray-100 border-gray-300 text-gray-400'
              }`}
                >
                  {step.icon}
                </div>

                {/* Text */}
                <div className="mt-2 text-center">
                  <p
                    className={`text-sm font-medium ${
                      isActive ? 'text-gray-900' : 'text-gray-500'
                    }`}
                  >
                    {step.title}
                  </p>
                  <p
                    className={`text-xs ${
                      isActive ? 'text-gray-700' : 'text-gray-400'
                    }`}
                  >
                    {step.subtitle}
                  </p>
                </div>

                {/* Connector line */}
                {!isLast && (
                  <div className="absolute top-6 left-full w-full">
                    <div
                      className={`h-0.5 w-full ${
                        isCompleted ? 'bg-[#7B1E1E]' : 'bg-gray-300'
                      }`}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Step Components */}
      {currentStep === 1 && (
        <Step1BasicDetails
          formData={formData}
          errors={errors}
          updateFormData={updateFormData}
        />
      )}

      {currentStep === 2 && (
        <Step2LocationPrice
          formDataStep2={formDataStep2}
          handleChange={handleChange}
        />
      )}

      {currentStep === 3 && (
        <Step3FeaturesAmenities
          amenities={amenities}
          setAmenities={setAmenities}
        />
      )}

      {currentStep === 4 && (
        <Step4PhotosContact
          contactData={contactData}
          setContactData={setContactData}
          uploadedFiles={uploadedFiles}
          setUploadedFiles={setUploadedFiles}
        />
      )}

      {currentStep === 5 && (
        <Step5ReviewSubmit listingData={listingData} onSubmit={handleSubmit} />
      )}

      {/* Navigation */}
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
