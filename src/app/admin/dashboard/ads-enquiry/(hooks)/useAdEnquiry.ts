'use client'

import useSWR from 'swr'

import { appEndpoints } from '@/services/endpoints'
import { getMethod } from '@/services/service'
import { ResponseDTO } from '@/components/dto/response_dto'
import { AdEnquiry } from '../(dto)/AdEnquiryType'

interface AdEnquiryResponse {
  items: AdEnquiry[]
  total: number
}

const fetchAdEnquiries = async (endpoint: string): Promise<AdEnquiryResponse> => {
  const response: ResponseDTO = await getMethod(endpoint)

  if (response.error) {
    console.error('Error fetching ad enquiries:', response.message)
    return { items: [], total: 0 }
  }

  return {
    items: response?.data?.data ?? [],
    total: response?.data?.total ?? 0,
  }
}

export function useAdEnquiry({ page = 1, limit = 10, adsId }: { page?: number; limit?: number; adsId?: string } = {}) {
  // Create API URL dynamically
  const params = new URLSearchParams()
  if (!adsId) params.set('entity_type', 'ad')
  params.set('page', String(page))
  params.set('limit', String(limit))
  const query = params.toString()

  let url = `${appEndpoints.getAdEnquiry}?${query}`
  if (adsId) {
    url = `${appEndpoints.getAllEnquiryByPropertyIdOrAdsId('ad', encodeURIComponent(adsId))}?${query}`
  }

  const { data = { items: [], total: 0 }, error, isLoading, mutate } = useSWR<AdEnquiryResponse>(url, fetchAdEnquiries)

  return {
    enquiries: data.items,
    total: data.total,
    error,
    isLoading,
    mutateEnquiries: mutate,
  }
}
