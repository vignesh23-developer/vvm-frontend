export interface PopularPropertyDto {
  id: number
  title: string
  listing_type: string
  address_line: string
  rooms: number
  area: string
  property_size: string | number
  property_size_unit: string | null
  price: string
  image: string
  media: { url: string; alt?: string; is_primary: boolean; media_type: 'IMAGE' | 'VIDEO' }[]
}
