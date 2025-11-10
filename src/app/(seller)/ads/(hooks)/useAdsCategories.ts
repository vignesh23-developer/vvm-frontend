'use client'

import useSWR from 'swr'
import { appEndpoints } from '@/services/endpoints'
import { getMethod } from '@/services/service'

export interface AdsCategoryDto {
  id: string
  name: string
  description: string
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

interface ApiResponse {
  error?: boolean
  message?: string
}

// Custom hook for fetching ads categories
export function useAdsCategories() {
  const fetcher = async (url: string): Promise<AdsCategoryDto[]> => {
    try {
      const response = await getMethod<ApiResponse>(url)
      
      if (response.error) {
        console.error('API error while fetching ads categories:', response.message)
        return []
      }

      // getMethod wraps response, so the array is at response.data
      const categories = response.data as any
      
      if (Array.isArray(categories)) {
        return categories
      }

      console.warn('Unexpected data format:', response.data)
      return []
    } catch (error) {
      console.error('Failed to fetch ads categories:', error)
      return []
    }
  }

  const { data, error, isLoading, mutate } = useSWR<AdsCategoryDto[]>(
    appEndpoints.getAllAdsCategories,
    fetcher
  )

  return {
    categories: data ?? [],
    error,
    isLoading,
    mutate,
  }
}
