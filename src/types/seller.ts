// Property Types
export type PropertyType = 'Land' | 'Residential' | 'Commercial' | 'Plot'
export type PurposeType = 'Sale' | 'Rent' | 'Lease'
export type UnitType = 'Sqft' | 'Sqm' | 'Acre'

// Step 1: Basic Details
export interface BasicDetailsFormValues {
  propertyTitle: string
  propertyType: PropertyType | ''
  purpose: PurposeType | ''
  description: string
}

// Step 2: Location & Price
export interface LocationPriceFormValues {
  district: string
  city: string
  address: string
  price: string
  size: string
  unit: UnitType | ''
}

// Step 3: Features & Amenities
export interface Amenity {
  id: string | number
  name: string
  selected: boolean
}

export interface FeaturesAmenitiesFormValues {
  amenities: Amenity[]
  customFeature?: string
}

// Step 4: Photos & Contact
export interface PhotosContactFormValues {
  contactName: string
  phoneNumber: string
  whatsappNumber: string
  emailAddress: string
  photos: File[]
  boostListing: boolean
}

// Combined Form Values
export interface PropertyListingFormValues {
  basicDetails: BasicDetailsFormValues
  locationPrice: LocationPriceFormValues
  featuresAmenities: FeaturesAmenitiesFormValues
  photosContact: PhotosContactFormValues
}

// Common Props
export interface StepperProps {
  currentStep: number
  totalSteps: number
  onNext: () => void
  onBack: () => void
}

export interface FormStepProps<T> {
  initialValues: T
  onSubmit: (values: T) => void
  onBack?: () => void
}
