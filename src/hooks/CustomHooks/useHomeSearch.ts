'use client'

import { useCallback } from 'react'
import useSWR from 'swr'
import { appEndpoints } from '@/services/endpoints'
import { getMethod, deleteMethod } from '@/services/service'
import toast from 'react-hot-toast'

interface SavedSearch {
  id: string
  user_id: string
  entity_type: string
  search_criteria: Record<string, any>
  name?: string
  is_active: boolean
  notify_on_new: boolean
  created_at: string
  updated_at: string
}

interface SavedSearchHistoryResponse {
  data: SavedSearch[]
  total: number
  page: number
  limit: number
}

export function useHomeSearch() {
  // Fetcher using our generic API helper
  const fetcher = async (url: string): Promise<SavedSearchHistoryResponse> => {
    try {
      const response = await getMethod<SavedSearchHistoryResponse>(url, {
        page: 1,
        limit: 10,
      })
      console.log('Fetched search history ResponseDTO:', response)

      if (response?.error) {
        toast.error(response.message || 'Failed to fetch search history')
        console.error('API error while fetching search history:', response.message)
        return { data: [], total: 0, page: 1, limit: 10 }
      }

      // Handle the API response structure: response.data contains { data: SavedSearch[], total, page, limit }
      if (response?.data && 'data' in response.data && Array.isArray(response.data.data)) {
        return response.data as SavedSearchHistoryResponse
      }

      console.warn('Unexpected data format:', response?.data)
      return { data: [], total: 0, page: 1, limit: 10 }
    } catch (error) {
      console.error('Failed to fetch search history:', error)
      return { data: [], total: 0, page: 1, limit: 10 }
    }
  }

  // SWR handles caching, revalidation, and errors
  const {
    data: searchHistoryData,
    error,
    isLoading,
    mutate: mutateSearchHistory,
  } = useSWR<SavedSearchHistoryResponse>(
    appEndpoints.getUserSearchHistory,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  // Delete saved search function
  const deleteSavedSearch = useCallback(
    async (id: string) => {
      try {
        const response = await deleteMethod(appEndpoints.deleteSavedSearch(id))
        
        if (response?.error) {
          toast.error(response.message || 'Failed to delete search history')
          console.error('API error while deleting search history:', response.message)
          return false
        }

        toast.success('Search history deleted successfully')
        // Refresh the list
        mutateSearchHistory()
        return true
      } catch (error) {
        console.error('Failed to delete search history:', error)
        toast.error('Failed to delete search history')
        return false
      }
    },
    [mutateSearchHistory]
  )

  return {
    savedSearches: searchHistoryData?.data ?? [],
    isLoading,
    error,
    deleteSavedSearch,
    mutate: mutateSearchHistory,
  }
}

