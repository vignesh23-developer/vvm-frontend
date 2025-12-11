import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import { deleteMethod } from '@/services/service'
import { ResponseDTO } from '@/components/dto/response_dto'
import { appEndpoints } from '@/services/endpoints'

/**
 * Custom hook for deleting reviews
 */
export function useDeleteReview() {
  const router = useRouter()
  const { user: userData } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteReview = useCallback(
    async (reviewId: string): Promise<boolean> => {
      try {
        setLoading(true)
        setError(null)

        if (!userData || !(userData as { id?: string }).id) {
          setError('Please login to delete a review')
          router.push('/login')
          return false
        }

        const response = await deleteMethod(appEndpoints.deleteReview(reviewId))

        if (response.error) {
          setError(response.message || 'Failed to delete review')
          return false
        }

        return true
      } catch (err) {
        console.error('Error deleting review:', err)
        setError('An error occurred while deleting review')
        return false
      } finally {
        setLoading(false)
      }
    },
    [router, userData]
  )

  return { deleteReview, loading, error }
}

