'use client'

import useSWR from 'swr'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

import { appEndpoints } from '@/services/endpoints'
import { getMethod, putMethod } from '@/services/service'
import { AdsDto } from '@/app/(seller)/ads/dto/AdsDto'
import { ResponseDTO } from '@/components/dto/response_dto'

const fetcher = async (endpoint: string) => getMethod<AdsDto>(endpoint)

interface UseAdDetailsParams {
  id?: string
}

export function useAdDetails({ id }: UseAdDetailsParams) {
  const router = useRouter()
  const adId = id

  const swrKey = adId ? appEndpoints.getAdByID(adId) : null

  const { data, error, isLoading, mutate } = useSWR<ResponseDTO>(swrKey, fetcher)

  const handleAdApprovalAction = async (
    adId: string,
    reviewerId: string,
    action: 'approve' | 'reject',
    extraData?: { comment?: string; rejectReason?: string },
  ): Promise<boolean> => {
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
      await mutate()
      router.refresh()
      return true
    } catch (err) {
      console.error(`Failed to ${action} ad:`, err)
      toast.error(`An error occurred while trying to ${action} the ad`)
      return false
    }
  }

  return {
    adDetails: data?.data,
    adDetailsError: error ?? (data?.error ? new Error(data.message) : undefined),
    adDetailsLoading: isLoading,
    adDetailsRefresh: mutate,
    handleAdApprovalAction,
  }
}
