import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getLocalStorageItem } from '@/utils/local_storage/local_storage_handler'
import { LOCAL_STORAGE_NAME } from '@/utils/local_storage/local_storage_constant'
import { UserSubscription } from '@/types/subscription'
import { getMethod } from '@/services/service'
import { ResponseDTO } from '@/components/dto/response_dto'
import { appEndpoints } from '@/services/endpoints'

/**
 * Custom hook to fetch and manage user subscription data
 */
export function useUserSubscription() {
  const [userId, setUserId] = useState<string | null>(null)
  const [activeSubscription, setActiveSubscription] = useState<UserSubscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Get user ID from localStorage
  useEffect(() => {
    const userData = getLocalStorageItem(LOCAL_STORAGE_NAME.userData) as { id: string } | null
    if (userData?.id) {
      setUserId(userData.id)
    }
  }, [])

  // Fetch active subscription
  useEffect(() => {
    let isMounted = true

    const fetchSubscriptions = async () => {
      try {
        setLoading(true)
        setError(null)

        const userData = getLocalStorageItem(LOCAL_STORAGE_NAME.userData) as { id: string } | null

        if (!userData?.id) {
          if (isMounted) {
            router.push('/login')
          }
          return
        }

        const response = await getMethod<ResponseDTO<UserSubscription[]>>(appEndpoints.getUserSubscription(userData.id))

        if (!isMounted) return

        if (response.error) {
          if (isMounted) {
            setError(response.message || 'Failed to fetch subscriptions')
          }
          return
        }

        const rawData = response.data?.data
        const subscriptions: UserSubscription[] = Array.isArray(rawData) ? rawData : rawData ? [rawData] : []
        const activeSubscription = subscriptions.find(subscription => subscription.isActive == true)

        if (isMounted) {
          setActiveSubscription(activeSubscription || null)
        }
      } catch (err) {
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
  }, [router])

  return { userId, activeSubscription, loading, error }
}
