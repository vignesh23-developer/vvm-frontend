export interface AdsFavorite {
  id: string
  title: string
  favorite_count: number
  approval_status: 'PENDING' | 'APPROVED' | 'REJECTED'
  // Add other ad-specific fields as needed
  [key: string]: any
}
