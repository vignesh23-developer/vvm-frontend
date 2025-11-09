'use client'

import useSWR from 'swr'
import { useRouter } from 'next/navigation'
import { appEndpoints } from '@/services/endpoints'
import { getMethod } from '@/services/service'
import { PropertyEnquiry } from '@/app/admin/dashboard/property-enquiry/(dto)/PropertyEnquiryType'

// Custom hook for managing property categories
export function usePropertyEnquiry() {
  const router = useRouter()

  // Fetcher using our generic API helper
  const fetcher = async (url: string): Promise<PropertyEnquiry[]> => {
    try {
      const response = await getMethod<PropertyEnquiry[]>(url)
      console.log('Fetched feature group ResponseDTO:', response)
      // Safe extraction of data
      if (Array.isArray(response.data)) {
        return response.data
      }
      return []
    } catch (error) {
      console.error('Failed to fetch property categories:', error)
      return []
    }
  }

  // SWR handles caching, revalidation, and errors
  const {
    data: enquiries,
    error,
    isLoading,
    mutate: mutateEnquiries,
  } = useSWR<PropertyEnquiry[]>(`${appEndpoints.getPropertyEnquiry}?entity_type=property`, fetcher)

  return {
    enquiries: enquiries ?? [],
    error,
    isLoading,
    mutateEnquiries,
  }
}
