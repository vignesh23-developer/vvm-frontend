import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import { useLoginModal } from '@/components/auth/LoginModalProvider'
import { getMethod } from '@/services/service'
import { ResponseDTO } from '@/components/dto/response_dto'
import { appEndpoints } from '@/services/endpoints'
import { UserSubscription } from '../types'

interface SubscriptionQuery {
  page?: number
  limit?: number
  orderBy?: string
  order?: 'ASC' | 'DESC'
  status?: string
  startDate?: string | null
  endDate?: string | null
  planId?: number | null
}

/**
 * Fetches subscriptions with pagination & filters using your getMethod() wrapper
 */
export function useAllSubscriptionData({
  page = 1,
  limit = 10,
  orderBy = 'startDate',
  order = 'DESC',
  status = 'all',
  startDate = null,
  endDate = null,
  planId = null,
}: SubscriptionQuery = {}) {
  const { openLoginModal } = useLoginModal()
  const { user: userData } = useAuth()

  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  const fetchSubscriptions = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      if (!userData || !(userData as { id?: string }).id) {
        const next =
          typeof window !== 'undefined'
            ? `${window.location.pathname}${window.location.search}` || '/'
            : '/'
        openLoginModal({ next })
        return
      }

      // Build params object directly (works with your getMethod)
      const params: Record<string, any> = {
        page,
        limit,
        orderBy,
        order,
        status,
      }

      if (startDate) params.startDate = startDate
      if (endDate) params.endDate = endDate
      if (planId) params.planId = planId

      const response = await getMethod<ResponseDTO<any>>(appEndpoints.getAllSubscription, params)

      if (response.error) {
        setError(response.message || 'Failed to fetch subscriptions')
        return
      }

      // Your backend returns:
      // {
      //   success: true,
      //   data: [...],
      //   page,
      //   limit,
      //   total
      // }
      const payload = response.data as any

      const rawData = payload?.data ?? []
      const subscriptionArray: UserSubscription[] = Array.isArray(rawData) ? rawData : [rawData]

      // Sort:
      // 1) Active first
      // 2) Descending by id
      const sorted = subscriptionArray.sort((a, b) => {
        if (a.isActive && !b.isActive) return -1
        if (!a.isActive && b.isActive) return 1
        return b.id - a.id
      })

      setSubscriptions(sorted)
      setTotal(payload?.total || 0)
    } catch (err) {
      console.error('Error fetching subscriptions:', err)
      setError('An error occurred while fetching subscriptions')
    } finally {
      setLoading(false)
    }
  }, [openLoginModal, userData, page, limit, orderBy, order, status, startDate, endDate, planId])

  useEffect(() => {
    fetchSubscriptions()
  }, [fetchSubscriptions])

  const refetch = useCallback(() => {
    fetchSubscriptions()
  }, [fetchSubscriptions])

  return {
    subscriptions,
    loading,
    error,
    total,
    refetch,
  }
}
