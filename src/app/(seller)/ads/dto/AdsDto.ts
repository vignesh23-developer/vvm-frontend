export interface AdsDto {
  id: string
  title: string
  description: string
  category_id: string
  price: string
  price_unit: string
  is_negotiable: boolean
  status: 'AVAILABLE' | 'SOLD' | 'RESERVED' | string
  is_published: boolean
  is_boosted: boolean
  address_line: string
  city: string
  district: string
  state: string
  postal_code: string
  country: string
  latitude: number
  longitude: number
  contact_name: string
  contact_phone: string
  contact_email: string
  user_id: string
  view_count: number
  created_at: string
  updated_at: string
  media?: any[]
}
