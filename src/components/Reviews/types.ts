// Type definitions for review components

export interface Review {
  id: string
  user_id: string
  user_firstName: string | null
  user_lastName: string | null
  user_email: string | null
  comment: string
  rating: number
  is_active: boolean
  helpful_count: number
  created_at: Date | string
  updated_at: Date | string
}

export interface CreateReviewDto {
  comment: string
  rating: number
}

export interface UpdateReviewDto {
  comment?: string
  rating?: number
}

export interface ReviewFilters {
  rating?: number | null // null means "All"
  sortBy?: 'newest' | 'oldest'
}

export interface ReviewsResponse {
  data: Review[]
  total: number
  page: number
  limit: number
}

