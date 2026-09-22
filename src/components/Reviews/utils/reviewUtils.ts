/**
 * Format review date
 */
export function formatReviewDate(dateString: string | Date): string {
  if (!dateString) return 'N/A'
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Get star rating display helper
 */
export function getStarRating(rating: number): { filled: number; empty: number } {
  const filled = Math.floor(rating)
  const empty = 5 - filled
  return { filled, empty }
}

/**
 * Filter reviews by rating (client-side helper if needed)
 */
export function filterReviewsByRating(reviews: any[], rating: number | null): any[] {
  if (rating === null || rating === undefined) return reviews
  return reviews.filter((review) => review.rating === rating)
}

/**
 * Sort reviews by date
 */
export function sortReviewsByDate(reviews: any[], order: 'newest' | 'oldest' = 'newest'): any[] {
  return [...reviews].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime()
    const dateB = new Date(b.created_at).getTime()
    return order === 'newest' ? dateB - dateA : dateA - dateB
  })
}

/**
 * Get user display name
 */
export function getUserDisplayName(review: { user_firstName?: string | null; user_lastName?: string | null }): string {
  const firstName = review.user_firstName || ''
  const lastName = review.user_lastName || ''
  const name = `${firstName} ${lastName}`.trim()
  return name || 'Anonymous User'
}

