export interface AdDetailsDto {
  id: string
  title: string
  description: string
  category_id: string
  price: string
  price_unit?: string
  status: string
  approval_status?: string
  address_line: string
  city: string
  state: string
  postal_code: string
  country: string
  latitude?: number
  longitude?: number
  contact_name?: string
  contact_phone?: string
  contact_email?: string
  media?: { url: string }[]
  reports_count?: number
  enquiry_count?: number
  view_count?: number
  created_at?: string
}
