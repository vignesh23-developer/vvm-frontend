export interface PropertyFavorite {
  id: string
  title: string
  description: string
  property_category_id: string
  price: string
  price_unit: 'total' | 'per_sqft' | 'monthly' | string
  property_size: string
  property_size_unit: string
  listing_type: 'SALE' | 'RENT' | string
  status: 'AVAILABLE' | 'SOLD' | 'RENTED' | string
  door_number: string
  street_name: string
  address_line: string
  city: string
  district: string
  state: string
  postal_code: string
  country: string
  latitude: string
  longitude: string
  owner_id: string
  agent_id: string
  approval_status: 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | string
  is_published: boolean
  is_verified: boolean
  is_premium: boolean
  is_featured: boolean
  is_active: boolean
  slug: string | null
  meta_description: string | null
  meta_keywords: string | null
  view_count: number
  favorite_count: number
  contact_count: number
  created_at: string
  updated_at: string
  published_at: string | null
  approved_at: string | null
  media: Media[]
  is_user_favorite: boolean
}

interface Media {
  id: string
  url: string
  type: 'image' | 'video'
  thumbnail: string
}
