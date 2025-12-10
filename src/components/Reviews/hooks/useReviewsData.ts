import { useState, useEffect, useCallback } from 'react'
import { getMethod } from '@/services/service'
import { ResponseDTO } from '@/components/dto/response_dto'
import { appEndpoints } from '@/services/endpoints'
import { Review, ReviewFilters, ReviewsResponse } from '../types'

interface UseReviewsDataOptions {
  page?: number
  limit?: number
  filters?: ReviewFilters
}

/**
 * Custom hook to fetch paginated reviews with filters
 */
export function useReviewsData(options: UseReviewsDataOptions = {}) {
  const { page = 1, limit = 6, filters = {} } = options
  const [reviews, setReviews] = useState<Review[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const queryParams = new URLSearchParams()
      queryParams.set('page', String(page))
      queryParams.set('limit', String(limit))

      // Note: Rating filter and sort would ideally be handled server-side
      // For now, we'll fetch all and filter client-side if needed
      // In production, you'd add these as query params:
      // if (filters.rating !== null && filters.rating !== undefined) {
      //   queryParams.set('rating', String(filters.rating))
      // }
      // if (filters.sortBy) {
      //   queryParams.set('sort', filters.sortBy)
      // }

      const url = `${appEndpoints.getAllReviews}?${queryParams.toString()}`
      const response = await getMethod<ReviewsResponse>(url)

      if (response.error) {
        setError(response.message || 'Failed to fetch reviews')
        return
      }

      const reviewsData = response.data as ReviewsResponse
      let reviewsList = reviewsData?.data || []

      // Client-side filtering (if server doesn't support it)
      if (filters.rating !== null && filters.rating !== undefined) {
        reviewsList = reviewsList.filter((review) => review.rating === filters.rating)
      }

      // Client-side sorting (if server doesn't support it)
      if (filters.sortBy) {
        reviewsList.sort((a, b) => {
          const dateA = new Date(a.created_at).getTime()
          const dateB = new Date(b.created_at).getTime()
          return filters.sortBy === 'newest' ? dateB - dateA : dateA - dateB
        })
      }

      setReviews(reviewsList)
      setTotal(reviewsData?.total || 0)
    } catch (err) {
      console.error('Error fetching reviews:', err)
      setError('An error occurred while fetching reviews')
    } finally {
      setLoading(false)
    }
  }, [page, limit, filters.rating, filters.sortBy])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const refetch = useCallback(() => {
    fetchReviews()
  }, [fetchReviews])

  return { reviews, total, loading, error, refetch }
}

