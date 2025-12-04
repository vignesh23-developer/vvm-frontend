export interface AdsCategory {
  id: number
  name: string
  description?: string
  isActive?: boolean
  sortOrder?: number
}

export interface AdsCategoryProps {
  page: number
  limit: number
}
