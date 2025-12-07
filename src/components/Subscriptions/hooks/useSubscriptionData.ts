import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import { getMethod } from '@/services/service'
import { ResponseDTO } from '@/components/dto/response_dto'
import { appEndpoints } from '@/services/endpoints'
import { UserSubscription } from '../types'

/**
 * Custom hook to fetch user subscriptions
 */
export function useSubscriptionData() {
  const router = useRouter()
  const { user: userData } = useAuth()
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  const fetchSubscriptions = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      if (!userData || !(userData as { id?: string }).id) {
        router.push('/login')
        return
      }

      const userIdValue = (userData as { id: string }).id
      setUserId(userIdValue)

      const response = await getMethod<ResponseDTO<UserSubscription[]>>(appEndpoints.getUserSubscription(userIdValue))

      if (response.error) {
        setError(response.message || 'Failed to fetch subscriptions')
        return
      }

      const subscriptionData = response.data?.data
      const data = subscriptionData ? (Array.isArray(subscriptionData) ? subscriptionData : [subscriptionData]) : []

      const sorted = data.sort((a, b) => {
        // 1. Active subscriptions first
        if (a.isActive && !b.isActive) return -1
        if (!a.isActive && b.isActive) return 1

        // 2. Then sort descending by id
        return b.id - a.id
      })

      setSubscriptions(sorted)
    } catch (err) {
      console.error('Error fetching subscriptions:', err)
      setError('An error occurred while fetching subscriptions')
    } finally {
      setLoading(false)
    }
  }, [router, userData])

  useEffect(() => {
    fetchSubscriptions()
  }, [fetchSubscriptions])

  const refetch = useCallback(() => {
    fetchSubscriptions()
  }, [fetchSubscriptions])

  return { subscriptions, loading, error, userId, refetch }
}
