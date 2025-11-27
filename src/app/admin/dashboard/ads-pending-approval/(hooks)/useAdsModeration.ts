'use client'

import useSWR from 'swr'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

import { appEndpoints } from '@/services/endpoints'
import { AdsDto } from '@/app/(seller)/ads/dto/AdsDto'
import { getMethod, putMethod } from '@/services/service'

interface ApiResponse<T> {
  statusCode: number
  data: {
    data: T
    total: number
    page: number
    limit: number
  }
  message: string
  timestamp: string
  error?: boolean
}

interface UseAdsModerationOptions {
  page?: number
  limit?: number
  approvalStatus?: string
}

interface AdsFetcherResult {
  items: AdsDto[]
  total: number
}

export function useAdsModeration(options: UseAdsModerationOptions = {}) {
  const router = useRouter()
  const { page = 1, limit = 10, approvalStatus } = options

  const queryParams = new URLSearchParams()
  if (limit != null) {
    queryParams.set('limit', String(limit))
  }
  if (page != null) {
    queryParams.set('page', String(page))
  }
  if (approvalStatus) {
    queryParams.set('approval_status', approvalStatus)
  }

  const swrKey = queryParams.toString() ? `${appEndpoints.getAllAds}?${queryParams.toString()}` : appEndpoints.getAllAds

  const fetcher = async (url: string): Promise<AdsFetcherResult> => {
    try {
      const response = await getMethod<ApiResponse<AdsDto[]>>(url)

      if (response.error) {
        toast.error(response.message || 'Failed to fetch ads')
        console.error('API error while fetching ads:', response.message)
        return { items: [], total: 0 }
      }

      const apiResponse = response.data as unknown as ApiResponse<AdsDto[]>
      const payload = (apiResponse?.data as any)?.data ?? (response.data as any)?.data ?? []
      const total = (apiResponse?.data as any)?.total ?? (response.data as any)?.total ?? payload.length ?? 0

      if (Array.isArray(payload)) {
        return { items: payload, total }
      }

      console.warn('Unexpected ads payload shape:', response.data)
      return { items: [], total: 0 }
    } catch (error) {
      console.error('Failed to fetch ads:', error)
      return { items: [], total: 0 }
    }
  }

  const { data, error, isLoading, mutate: mutateAds } = useSWR<AdsFetcherResult>(swrKey, fetcher)

  const handleAdAction = async (
    adId: string,
    reviewerId: string,
    action: 'approve' | 'reject',
    extraData?: { comment?: string; rejectReason?: string },
  ) => {
    if (!adId) {
      toast.error('Missing ad information')
      return false
    }

    const endpoint = action === 'approve' ? appEndpoints.approveAd(adId) : appEndpoints.rejectAd(adId)

    const payload =
      action === 'approve'
        ? {
            reviewer_id: reviewerId,
            ...(extraData?.comment ? { comments: extraData.comment } : {}),
          }
        : {
            reviewer_id: reviewerId,
            rejection_reason: extraData?.rejectReason,
            ...(extraData?.comment ? { comments: extraData.comment } : {}),
          }

    try {
      const response = await putMethod(endpoint, payload)

      if (response.error) {
        toast.error(response.message || `Failed to ${action} ad`)
        return false
      }

      toast.success(`Ad ${action === 'approve' ? 'approved' : 'rejected'} successfully`)
      await mutateAds()
      router.refresh()
      return true
    } catch (err) {
      console.error(`Failed to ${action} ad:`, err)
      toast.error(`An error occurred while trying to ${action} the ad`)
      return false
    }
  }

  return {
    ads: data?.items ?? [],
    total: data?.total ?? data?.items?.length ?? 0,
    error,
    isLoading,
    mutateAds,
    handleAdAction,
  }
}
