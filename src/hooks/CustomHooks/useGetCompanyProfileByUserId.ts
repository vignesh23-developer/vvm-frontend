'use client'

import useSWR from 'swr'
import { appEndpoints } from '@/services/endpoints'
import { getMethod } from '@/services/service'
import toast from 'react-hot-toast'

// Custom hook for managing property reports
export function useCompanyProfilesByUserId(userId: string) {
  // Fetcher using our generic API helper
  const fetcher = async (url: string): Promise<any[]> => {
    try {
      const response = await getMethod<any>(url)
      console.log('Fetched company profiles ResponseDTO:', response)

      if (response?.error) {
        toast.error(response.message || 'Failed to fetch company profiles')
        console.error('API error while fetching company profiles:', response.message)
        return []
      }

      // Safe extraction of data
      if (Array.isArray(response?.data)) {
        return response.data
      }

      // If API returns a single object, wrap it into an array
      if (response?.data) {
        return response.data[0].id
      }

      console.warn('Unexpected data format:', response?.data)
      return []
    } catch (error) {
      console.error('Failed to fetch company profiles:', error)
      return []
    }
  }

  // SWR handles caching, revalidation, and errors
  const {
    data: getCompanyProfile,
    error,
    isLoading,
    mutate: mutateCompanyProfiles,
  } = useSWR<any[]>(`${appEndpoints.getCompanyProfilesByUserID(userId)}`, fetcher)

  return {
    companyProfiles: getCompanyProfile ?? [],
    error,
    isLoading,
    mutate: mutateCompanyProfiles,
  }
}
