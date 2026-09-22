export interface PropertyEnquiryProperty {
  title?: string
  district?: string
  city?: string
  listing_type?: string
}

export interface PropertyEnquiry extends Record<string, unknown> {
  id: number
  name: string
  email: string
  phone: number | string

  // Some API responses include property details nested under `property`
  property?: PropertyEnquiryProperty

  // Some API responses flatten these fields at the top-level
  title?: string
  district?: string
  city?: string
  listing_type?: string
}
