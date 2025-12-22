export interface PopularPropertyDto {
  id: number
  title: string
  listing_type: string
  address_line: string
  district: string
  city: string
  state: string
  zip_code: string
  is_published: boolean
  rooms: number
  area: string
  property_size: string | number
  property_size_unit: string | null
  price: string
  image: string
  media: { url: string; alt?: string; is_primary: boolean; media_type: 'IMAGE' | 'VIDEO' }[]
}
