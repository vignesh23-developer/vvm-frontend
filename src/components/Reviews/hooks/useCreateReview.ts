import { useState, useCallback } from 'react'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import { useLoginModal } from '@/components/auth/LoginModalProvider'
import { postMethod } from '@/services/service'
import { ResponseDTO } from '@/components/dto/response_dto'
import { appEndpoints } from '@/services/endpoints'
import { CreateReviewDto, Review } from '../types'

/**
 * Custom hook for creating reviews
 */
export function useCreateReview() {
  const { openLoginModal } = useLoginModal()
  const { user: userData } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createReview = useCallback(
    async (dto: CreateReviewDto): Promise<Review | null> => {
      try {
        setLoading(true)
        setError(null)

        if (!userData || !(userData as { id?: string }).id) {
          setError('Please login to create a review')
          const next =
            typeof window !== 'undefined'
              ? `${window.location.pathname}${window.location.search}` || '/'
              : '/'
          openLoginModal({ next })
          return null
        }

        const response = await postMethod<Review>(appEndpoints.createReview, dto)

        if (response.error) {
          setError(response.message || 'Failed to create review')
          return null
        }

        return response.data as Review
      } catch (err) {
        console.error('Error creating review:', err)
        setError('An error occurred while creating review')
        return null
      } finally {
        setLoading(false)
      }
    },
    [openLoginModal, userData]
  )

  return { createReview, loading, error }
}

