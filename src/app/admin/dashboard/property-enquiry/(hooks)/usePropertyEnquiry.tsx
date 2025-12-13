'use client'

import useSWR from 'swr'
import { appEndpoints } from '@/services/endpoints'
import { getMethod } from '@/services/service'
import { PropertyEnquiry } from '@/app/admin/dashboard/property-enquiry/(dto)/PropertyEnquiryType'
import { ResponseDTO } from '@/components/dto/response_dto'
import toast from 'react-hot-toast'

// Response shape for SWR
interface EnquiryResponse {
  items: PropertyEnquiry[]
  total: number
}

// Hook
export function usePropertyEnquiry({ page = 1, limit = 10, propertyId }: { page?: number; limit?: number; propertyId?: string } = {}) {
  // Create API URL dynamically
  const params = new URLSearchParams()
  if (!propertyId) params.set('entity_type', 'property')
  params.set('page', String(page))
  params.set('limit', String(limit))
  const query = params.toString()

  let url = `${appEndpoints.getPropertyEnquiry}?${query}`
  if (propertyId) {
    url = `${appEndpoints.getAllEnquiryByPropertyIdOrAdsId('property', encodeURIComponent(propertyId))}?${query}`
  }

  // Fetcher
  const fetchEnquiries = async (endpoint: string): Promise<EnquiryResponse> => {
    const response: ResponseDTO = await getMethod(endpoint)

    if (response.error) {
      toast.error(response.message || 'Failed to fetch property enquiries')
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

  console.log('Fetched Property Enquiries:', data.items)

  return {
    enquiries: data.items,
    total: data.total,
    error,
    isLoading,
    mutateEnquiries,
  }
}
