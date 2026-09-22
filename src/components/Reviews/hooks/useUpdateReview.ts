import { useState, useCallback } from 'react'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import { useLoginModal } from '@/components/auth/LoginModalProvider'
import { patchMethod } from '@/services/service'
import { ResponseDTO } from '@/components/dto/response_dto'
import { appEndpoints } from '@/services/endpoints'
import { UpdateReviewDto, Review } from '../types'

/**
 * Custom hook for updating reviews
 */
export function useUpdateReview() {
  const { openLoginModal } = useLoginModal()
  const { user: userData } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateReview = useCallback(
    async (reviewId: string, dto: UpdateReviewDto): Promise<Review | null> => {
      try {
        setLoading(true)
        setError(null)

        if (!userData || !(userData as { id?: string }).id) {
          setError('Please login to update a review')
          const next =
            typeof window !== 'undefined'
              ? `${window.location.pathname}${window.location.search}` || '/'
              : '/'
          openLoginModal({ next })
          return null
        }

        const response = await patchMethod<Review>(appEndpoints.updateReview(reviewId), dto)

        if (response.error) {
          setError(response.message || 'Failed to update review')
          return null
        }

        return response.data as Review
      } catch (err) {
        console.error('Error updating review:', err)
        setError('An error occurred while updating review')
        return null
      } finally {
        setLoading(false)
      }
    },
    [openLoginModal, userData]
  )

  return { updateReview, loading, error }
}

