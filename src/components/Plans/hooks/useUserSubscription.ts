import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { UserSubscription } from '@/types/subscription'
import { getMethod } from '@/services/service'
import { ResponseDTO } from '@/components/dto/response_dto'
import { appEndpoints } from '@/services/endpoints'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'

/**
 * Custom hook to fetch and manage user subscription data
 */
export function useUserSubscription() {
  const [activeSubscription, setActiveSubscription] = useState<UserSubscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user: userData} = useAuth();
  const router = useRouter()

  // Fetch active subscription
  useEffect(() => {
    let isMounted = true

    const fetchSubscriptions = async () => {
      try {
        setLoading(true)
        setError(null)

        if (!userData?.id) {
          router.push('/login')
          return
        }
        const response = await getMethod<ResponseDTO<UserSubscription[]>>(appEndpoints.getUserSubscription(userData.id))
        if (response.error) {
          setError(response.message || 'Failed to fetch subscriptions')
          return
        }
        const rawData = response.data?.data
        const subscriptions: UserSubscription[] = Array.isArray(rawData) ? rawData : rawData ? [rawData] : []
        const activeSubscription = subscriptions.find(subscription => subscription.isActive == true)

        setActiveSubscription(activeSubscription || null)
      } catch (err) {
        setError('An error occurred while fetching subscriptions')
      } finally {
        setLoading(false)
      }
    }

    fetchSubscriptions()
  }, [router])

  return { activeSubscription, loading, error }
}
