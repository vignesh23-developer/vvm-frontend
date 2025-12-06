export interface AdsMediaItem {
  id?: string
  url: string
  thumbnail_url?: string
  is_primary?: boolean
  [key: string]: any
}

export interface AdsListDto {
  id: string
  title: string
  description?: string | null
  category_id?: string | null
  price?: string | number | null
  price_unit?: string | null
  is_negotiable?: boolean
  status?: 'AVAILABLE' | 'SOLD' | 'RESERVED' | string
  approval_status?: 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | string
  is_published?: boolean
  is_boosted?: boolean
  address_line?: string | null
  city?: string | null
  district?: string | null
  state?: string | null
  postal_code?: string | null
  country?: string | null
  latitude?: number | null
  longitude?: number | null
  contact_name?: string | null
  contact_phone?: string | null
  contact_email?: string | null
  user_id?: string
  view_count?: number | null
  favorite_count?: number | null
  contact_count?: number | null
  enquiry_count?: number | null
  reports_count?: number | null
  created_at?: string | null
  updated_at?: string | null
  is_user_favorite?: boolean
  media?: AdsMediaItem[]
  images?: AdsMediaItem[]
  brand_name?: string | null
  campaign_type?: string | null
  campaign_start_at?: string | null
  campaign_end_at?: string | null
  tags?: string[]
  highlights?: string[]
  cta_url?: string | null
  budget_min?: number | null
  budget_max?: number | null
}
