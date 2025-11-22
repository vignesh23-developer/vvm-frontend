export interface PropertyDetailsResponseDto {
  id: string
  title: string
  description: string
  property_category_id: string
  price: string
  price_unit: string | null
  property_size: string | number
  property_size_unit: string | null
  listing_type: 'RENT' | 'SALE' | string
  status: 'AVAILABLE' | 'SOLD' | 'RENTED' | string
  door_number: string
  street_name: string
  address_line: string
  city: string
  district: string
  state: string
  postal_code: string
  country: string
  contact_name: string
  contact_phone: string
  contact_email: string
  is_boosted: boolean
  boost_expires_at: string | null
  boost_priority: number
  is_top_listing: boolean
  top_listing_expires_at: string | null
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
  feature_values: FeatureValue[]
  media: PropertyMedia[]
  approvals: any[]
  reports: any[]
  is_user_favorite: boolean
}

export interface FeatureOption {
  id: string
  name: string
  icon?: string
  sort_order: number
}
export interface FeatureValue {
  id: string
  property_id: string
  feature_group_id: string | null
  feature_group_name: string | null
  feature_category_name: string | null
  input_type: string
  feature_type: string
  feature_category_id: string
  feature_option_ids: string[]
  feature_options?: FeatureOption[]
  values: string | null
  units: string | null
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface PropertyMedia {
  id: string
  property_id: string
  media_type: 'IMAGE' | 'VIDEO' | string
  url: string
  thumbnail_url: string | null
  original_filename: string
  title: string | null
  description: string | null
  alt_text: string | null
  is_primary: boolean
  is_approved: boolean
  media_category: 'EXTERIOR' | 'INTERIOR' | string
  sort_order: number
  content_type: string
  file_size: number
  width: number | null
  height: number | null
  duration: number | null
  created_at: string
  updated_at: string
}
