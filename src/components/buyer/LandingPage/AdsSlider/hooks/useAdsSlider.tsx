'use client'

import useSWR from 'swr'
import { appEndpoints } from '@/services/endpoints'
import { getMethod } from '@/services/service'
import { ResponseDTO } from '@/components/dto/response_dto'

interface UseAdsSliderOptions {
  page?: number
  limit?: number
  status?: string
}

const fetchAdsSlider = async (url: string) => {
  const response = await getMethod(url)
  return response
}

export function useAdsSlider(options: UseAdsSliderOptions = {}) {
  const { page, limit, status = 'AVAILABLE' } = options

  const queryParams = new URLSearchParams()
  if (status != null) {
    queryParams.set('status', status)
  }

  if (limit != null) {
    queryParams.set('limit', String(limit))
  }

  if (page != null) {
    queryParams.set('page', String(page))
  }

  const swrKey = queryParams.toString() ? `${appEndpoints.getAllAds}?${queryParams.toString()}` : appEndpoints.getAllAds

  const { data, error, isLoading } = useSWR<ResponseDTO>(swrKey, fetchAdsSlider)

  console.log('useAdsSlider data:', data)

  return {
    items: data?.data?.data ?? [],
    total: data?.data?.total ?? 0,
    isLoading,
    error,
  }
}
