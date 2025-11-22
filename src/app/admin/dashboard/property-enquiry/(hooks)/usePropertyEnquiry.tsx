'use client'

import useSWR from 'swr'
import { appEndpoints } from '@/services/endpoints'
import { getMethod } from '@/services/service'
import { PropertyEnquiry } from '@/app/admin/dashboard/property-enquiry/(dto)/PropertyEnquiryType'
import { ResponseDTO } from '@/components/dto/response_dto'

// Response shape for SWR
interface EnquiryResponse {
  items: PropertyEnquiry[]
  total: number
}

// Hook
export function usePropertyEnquiry({ page = 1, limit = 10 } = {}) {
  // Create API URL dynamically
  const url = `${appEndpoints.getPropertyEnquiry}?entity_type=property&page=${page}&limit=${limit}`

  // Fetcher
  const fetchEnquiries = async (endpoint: string): Promise<EnquiryResponse> => {
    const response: ResponseDTO = await getMethod(endpoint)

    if (response.error) {
      console.error('Error fetching property enquiries:', response.message)
      return { items: [], total: 0 }
    }

    return {
      items: response.data?.data ?? [],
      total: response.data?.total ?? 0,
    }
  }

  // SWR
  const { data = { items: [], total: 0 }, error, isLoading, mutate: mutateEnquiries } = useSWR<EnquiryResponse>(url, fetchEnquiries)

  return {
    enquiries: data.items,
    total: data.total,
    error,
    isLoading,
    mutateEnquiries,
  }
}
