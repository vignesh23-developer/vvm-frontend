export type PropertyType = 'Land' | 'Residential' | 'Commercial' | 'Plot'
export type PurposeType = 'Sale' | 'Rent' | 'Lease'

export type Step = {
  title: string
  subtitle: string
  icon: React.ReactNode
}

   interface UploadedFile {
    file: File
    preview: string
  }

  interface ListingDetails {
    type: string
    purpose: string
    price: string
    size: string
    location: string
    contact: string
  }

  import React from 'react'

// Listing data interface
interface ListingData {
  type?: string
  price: string
  location: string
  purpose?: string
  size: string
  contact?: string
}

// Main props interface for the component
export interface ReviewSubmitStepProps {
  listingData: ListingData
  agreedToTerms: boolean
  handleTermsChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: () => void
}


  export type NavigationButtonsProps = {
  currentStep: number;
  totalSteps: number;
  handlePrev: () => void;
  handleNext: () => void;
}


// Types for the contact data
interface ContactData {
  contactName: string;
  phoneNumber: string;
  whatsappNumber: string;
  emailAddress: string;
  boostListing: boolean;
}

// Type for uploaded file data
interface FileData {
  preview: string;
  file: File;
}

// Props interface for PhotosContactStep component
interface PhotosContactStepProps {
  contactData: ContactData;
  uploadedFiles: FileData[];
  isDragging: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeFile: (index: number) => void;
}

// Export the main props interface
export type { PhotosContactStepProps, ContactData, FileData };

// Individual amenity type
interface Amenity {
  id: string | number;
  name: string;
  selected: boolean;
}

// Props interface for FeaturesAmenitiesStep component
interface FeaturesAmenitiesStepProps {
  amenities: Amenity[];
  customFeature: string;
  showInput: boolean;
  setAmenities: React.Dispatch<React.SetStateAction<Amenity[]>>;
  setCustomFeature: React.Dispatch<React.SetStateAction<string>>;
  setShowInput: React.Dispatch<React.SetStateAction<boolean>>;
  toggleAmenity: (id: string | number) => void;
  addCustomFeature: () => void;
}

// Export the types
export type { FeaturesAmenitiesStepProps, Amenity };

