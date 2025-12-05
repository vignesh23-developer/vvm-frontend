import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getLocalStorageItem } from '@/utils/local_storage/local_storage_handler'
import { LOCAL_STORAGE_NAME } from '@/utils/local_storage/local_storage_constant'
import { getMethod } from '@/services/service'
import { ResponseDTO } from '@/components/dto/response_dto'
import { appEndpoints } from '@/services/endpoints'
import { UserSubscription } from '../types'

/**
 * Custom hook to fetch user subscriptions
 */
export function useSubscriptionData() {
  const router = useRouter()
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setLoading(true)
        setError(null)

        const userData = getLocalStorageItem(LOCAL_STORAGE_NAME.userData) as { id: string } | null
        if (!userData || !userData.id) {
          router.push('/login')
          return
        }

        setUserId(userData.id)

        const response = await getMethod<ResponseDTO<UserSubscription[]>>(appEndpoints.getUserSubscription(userData.id))

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
    }

    fetchSubscriptions()
  }, [router])

  const refetch = () => {
    setLoading(true)
    // Trigger re-fetch
    const userData = getLocalStorageItem(LOCAL_STORAGE_NAME.userData) as { id: string } | null
    if (userData?.id) {
      setUserId(userData.id)
    }
  }

  return { subscriptions, loading, error, userId, refetch }
}
