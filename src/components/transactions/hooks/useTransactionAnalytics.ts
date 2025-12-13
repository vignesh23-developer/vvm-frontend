import { useState, useEffect, useCallback } from 'react'
import { getMethod } from '@/services/service'
import { ResponseDTO } from '@/components/dto/response_dto'
import { appEndpoints } from '@/services/endpoints'

export interface TransactionAnalytics {
  grandTotal: number
  today: {
    count: number
    growthPercentage: number
  }
  thisWeek: {
    count: number
    growthPercentage: number
  }
  thisMonth: {
    count: number
    growthPercentage: number
  }
}

/**
 * Custom hook to fetch payment transaction analytics
 */
export function useTransactionAnalytics() {
  const [analytics, setAnalytics] = useState<TransactionAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await getMethod<ResponseDTO<TransactionAnalytics>>(
        appEndpoints.getTransactionAnalytics
      )

      if (response.error) {
        setError(response.message || 'Failed to fetch analytics')
        return
      }

      const analyticsData = response.data as unknown as TransactionAnalytics
      if (analyticsData) {
        setAnalytics(analyticsData)
      } else {
        setAnalytics(null)
      }
    } catch (err) {
      console.error('Error fetching analytics:', err)
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

