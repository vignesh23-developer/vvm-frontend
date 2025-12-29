import { useState, useCallback } from 'react'
import { getMethod, patchMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'
import { toast } from 'react-hot-toast'

export interface Newsletter {
  id: string
  email: string
  ip_address: string | null
  city: string | null
  state: string | null
  country: string | null
  subscription_status: boolean
  isPlatformUser: boolean
  platformUserId: string | null
  created_at: Date
  updated_at: Date
}

export interface NewsletterListResponse {
  data: Newsletter[]
  total: number
  page: number
  limit: number
}

export interface NewsletterAnalytics {
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

interface FetchNewslettersParams {
  page?: number
  limit?: number
  sort?: 'ASC' | 'DESC'
  orderBy?: string
  search?: string
}

export function useNewsLetter() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [analytics, setAnalytics] = useState<NewsletterAnalytics | null>(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)

  const fetchNewsletters = useCallback(async (params: FetchNewslettersParams = {}) => {
    try {
      setLoading(true)
      setError(null)
      
      const queryParams = {
        page: params.page || page,
        limit: params.limit || limit,
        sort: params.sort || 'DESC',
        orderBy: params.orderBy || 'created_at',
        ...(params.search && { search: params.search }),
      }

      const response = await getMethod<NewsletterListResponse>(appEndpoints.getAllNewsletters, queryParams)

      if (response.error) {
        setError(response.message || 'Failed to fetch newsletters')
        return
      }

      const data = response.data as NewsletterListResponse
      if (data) {
        setNewsletters(data.data || [])
        setTotal(data.total || 0)
        if (params.page) setPage(params.page)
        if (params.limit) setLimit(params.limit)
      }
    } catch (err) {
      console.error('Error fetching newsletters:', err)
      setError('An error occurred while fetching newsletters')
    } finally {
      setLoading(false)
    }
  }, [page, limit])

  const unsubscribeNewsletter = useCallback(async (id: string) => {
    try {
      const response = await patchMethod<Newsletter>(appEndpoints.unsubscribeNewsletter, { id })

      if (response.error) {
        toast.error(response.message || 'Failed to unsubscribe')
        return false
      }

      // Update local state
      setNewsletters(prev =>
        prev.map(newsletter =>
          newsletter.id === id ? { ...newsletter, subscription_status: false } : newsletter
        )
      )

      toast.success('Unsubscribed successfully')
      return true
    } catch (err) {
      console.error('Error unsubscribing newsletter:', err)
      toast.error('An error occurred while unsubscribing')
      return false
    }
  }, [])

  const subscribeNewsletter = useCallback(async (id: string) => {
    try {
      const response = await patchMethod<Newsletter>(appEndpoints.subscribeNewsletter, { id })

      if (response.error) {
        toast.error(response.message || 'Failed to subscribe')
        return false
      }

      // Update local state
      setNewsletters(prev =>
        prev.map(newsletter =>
          newsletter.id === id ? { ...newsletter, subscription_status: true } : newsletter
        )
      )

      toast.success('Subscribed successfully')
      return true
    } catch (err) {
      console.error('Error subscribing newsletter:', err)
      toast.error('An error occurred while subscribing')
      return false
    }
  }, [])

  const fetchAnalytics = useCallback(async () => {
    try {
      setAnalyticsLoading(true)
      const response = await getMethod<NewsletterAnalytics>(appEndpoints.getNewsletterAnalytics)

      if (response.error) {
        console.error('Failed to fetch analytics:', response.message)
        return
      }

      const data = response.data as NewsletterAnalytics
      if (data) {
        setAnalytics(data)
      }
    } catch (err) {
      console.error('Error fetching analytics:', err)
    } finally {
      setAnalyticsLoading(false)
    }
  }, [])

  return {
    newsletters,
    loading,
    error,
    total,
    page,
    limit,
    analytics,
    analyticsLoading,
    fetchNewsletters,
    unsubscribeNewsletter,
    subscribeNewsletter,
    fetchAnalytics,
  }
}

