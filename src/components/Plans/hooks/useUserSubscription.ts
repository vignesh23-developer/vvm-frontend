import { useState, useEffect } from 'react'
import { UserSubscription } from '@/types/subscription'
import { getMethod } from '@/services/service'
import { ResponseDTO } from '@/components/dto/response_dto'
import { appEndpoints } from '@/services/endpoints'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'

/**
 * Fetches the active subscription for the logged-in user.
 * Guests: no request, no modal — `activeSubscription` is null (e.g. public pricing page).
 */
export function useUserSubscription() {
  const [activeSubscription, setActiveSubscription] = useState<UserSubscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user: userData, loading: authLoading } = useAuth()

  useEffect(() => {
    let isMounted = true

    const fetchSubscriptions = async () => {
      if (authLoading) {
        return
      }

      if (!userData?.id) {
        if (!isMounted) return
        setActiveSubscription(null)
        setError(null)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const response = await getMethod<ResponseDTO<UserSubscription[]>>(
          appEndpoints.getUserSubscription(userData.id),
        )
        if (!isMounted) return

        if (response.error) {
          setError(response.message || 'Failed to fetch subscriptions')
          return
        }
        const rawData = response.data?.data
        const subscriptions: UserSubscription[] = Array.isArray(rawData) ? rawData : rawData ? [rawData] : []
        const active = subscriptions.find(subscription => subscription.isActive == true)

        setActiveSubscription(active || null)
      } catch {
        if (isMounted) {
          setError('An error occurred while fetching subscriptions')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchSubscriptions()
    return () => {
      isMounted = false
    }
  }, [authLoading, userData])

  return { activeSubscription, loading, error }
}
