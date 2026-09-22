import { useState, useEffect, useCallback } from 'react'
import { getMethod } from '@/services/service'
import { ResponseDTO } from '@/components/dto/response_dto'
import { appEndpoints } from '@/services/endpoints'

export interface PlanAnalytics {
  plan_id: number
  plan_name: string
  plan_price: number
  total_subscriptions: number
  active_subscriptions: number
  expired_subscriptions: number
  total_revenue: number
  growth: {
    today: { count: number; growthPercentage: number }
    thisWeek: { count: number; growthPercentage: number }
    thisMonth: { count: number; growthPercentage: number }
    thisYear: { count: number; growthPercentage: number }
  }
}

/**
 * Custom hook to fetch subscription plan analytics
 */
export function useSubscriptionPlanAnalytics() {
  const [analytics, setAnalytics] = useState<PlanAnalytics[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await getMethod<ResponseDTO<PlanAnalytics[]>>(
        appEndpoints.getSubscriptionPlanAnalytics
      )

      if (response.error) {
        setError(response.message || 'Failed to fetch analytics')
        return
      }

      const analyticsData = response.data as unknown as PlanAnalytics[]
      if (analyticsData && Array.isArray(analyticsData)) {
        setAnalytics(analyticsData)
      } else {
        setAnalytics([])
      }
    } catch (err) {
      console.error('Error fetching plan analytics:', err)
      setError('An error occurred while fetching analytics')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  const refetch = useCallback(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  return {
    analytics,
    loading,
    error,
    refetch,
  }
}

