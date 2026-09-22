'use client'

import useSWR from 'swr'
import { appEndpoints } from '@/services/endpoints'
import { getMethod } from '@/services/service'
import { ResponseDTO } from '@/components/dto/response_dto'

interface UseAdsSliderOptions {
  ads_limit?: number
}

const fetchAdsSlider = async (url: string) => {
  const response = await getMethod(url)
  return response
}

export function useAdsSlider(options: UseAdsSliderOptions = {}) {
  const { ads_limit } = options

  const queryParams = new URLSearchParams()
  if (ads_limit != null) {
    queryParams.set('ads_limit', String(ads_limit))
  }

  const swrKey = queryParams.toString() && `${appEndpoints.getHomePageData}?${queryParams.toString()}`

  const { data, error, isLoading } = useSWR<ResponseDTO>(swrKey, fetchAdsSlider)

  // console.log('useAdsSlider data:', data)

  return {
    items: data?.data?.featuredAds?.data ?? [],
    total: data?.data?.featuredAds?.total ?? 0,
    isLoading,
    error,
  }
}
