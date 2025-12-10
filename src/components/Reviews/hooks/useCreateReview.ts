import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import { postMethod } from '@/services/service'
import { ResponseDTO } from '@/components/dto/response_dto'
import { appEndpoints } from '@/services/endpoints'
import { CreateReviewDto, Review } from '../types'

/**
 * Custom hook for creating reviews
 */
export function useCreateReview() {
  const router = useRouter()
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
          router.push('/login')
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
    [router, userData]
  )

  return { createReview, loading, error }
}

