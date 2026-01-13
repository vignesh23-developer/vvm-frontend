'use client'

import useSWR from 'swr'
import { appEndpoints } from '@/services/endpoints'
import { getMethod } from '@/services/service'
import type { ResponseDTO } from '@/components/dto/response_dto'

export type UseLandingPageOptions = {
  ads_limit?: number
  properties_limit?: number
  reviews_limit?: number
  districts_limit?: number
  enabled?: boolean
}

const buildUrl = (opts: UseLandingPageOptions = {}) => {
  const { ads_limit, properties_limit, reviews_limit, districts_limit } = opts
  const q = new URLSearchParams()
  if (ads_limit != null) q.set('ads_limit', String(ads_limit))
  if (properties_limit != null) q.set('properties_limit', String(properties_limit))
  if (reviews_limit != null) q.set('reviews_limit', String(reviews_limit))
  if (districts_limit != null) q.set('districts_limit', String(districts_limit))
  const qs = q.toString()
  return qs ? `${appEndpoints.getHomePageData}?${qs}` : appEndpoints.getHomePageData
}

const fetchLandingPageData = (url: string) => getMethod(url)

/**
 * useLandingPageData
 * - Single SWR hook for landing `/home` data
 * - Returns structured fields commonly used by landing sections
 * - `enabled` option prevents fetching when false
 */
export function useLandingPageData(options: UseLandingPageOptions = {}) {
  const { enabled = true } = options

  const key = enabled ? buildUrl(options) : null

  const { data, error, isLoading, mutate } = useSWR<ResponseDTO<any>>(key, fetchLandingPageData)

  const payload = data?.data ?? {}
  console.log('useLandingPageData data:', data, payload)
  return {
    // raw objects
    response: data,
    data: payload,

    allStats: payload.stats ?? {},
    // frequently accessed blocks (safe defaults)
    featuredAds: payload.featuredAds?.data ?? [],
    featuredAdsTotal: payload.featuredAds?.total ?? 0,
    propertiesData: payload.featuredProperties?.data ?? [],
    propertiesTotal: payload.featuredProperties?.total ?? 0,
    propertyCategories: payload.propertyCategories ?? [],
    testimonialsData: payload.testimonials ?? [],
    districtSummaryData: payload.districtSummary ?? [],

    // SWR helpers
    isLoading,
    error,
    mutate,
  }
}
