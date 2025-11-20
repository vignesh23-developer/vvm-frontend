'use client'

import AdsForm from './(components)/AdsForm'

// Form values interface (exported for reuse)
export interface AdsCreationFormValues {
  // Basic Details
  title: string
  description: string
  category_id: string
  price: number | string
  price_unit: string
  is_negotiable: boolean
  status: string
  is_published: boolean
  is_boosted: boolean

  // Location
  address_line: string
  door_number: string
  street_name: string
  city: string
  district: string
  state: string
  postal_code: string
  country: string
  latitude: number
  longitude: number

  // Contact
  contact_name: string
  contact_phone: string
  contact_email: string
}

export default function AdsCreationPage() {
  return <AdsForm mode="create" />
}
