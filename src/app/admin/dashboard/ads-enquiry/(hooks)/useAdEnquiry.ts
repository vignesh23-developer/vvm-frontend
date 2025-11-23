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

export function useAdEnquiry({ page = 1, limit = 10 } = {}) {
  const url = `${appEndpoints.getAdEnquiry}?entity_type=ad&page=${page}&limit=${limit}`

  const { data = { items: [], total: 0 }, error, isLoading, mutate } = useSWR<AdEnquiryResponse>(url, fetchAdEnquiries)

  return {
    enquiries: data.items,
    total: data.total,
    error,
    isLoading,
    mutateEnquiries: mutate,
  }
}
