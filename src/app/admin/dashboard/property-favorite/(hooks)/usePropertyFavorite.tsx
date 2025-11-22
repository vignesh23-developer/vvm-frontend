'use client'

import useSWR from 'swr'
import { appEndpoints } from '@/services/endpoints'
import { getMethod } from '@/services/service'
import { ResponseDTO } from '@/components/dto/response_dto'
import { PropertyFavorite } from '../(dto)/PropertyFavoriteType'

// Response shape for SWR
interface FavoriteResponse {
  data: PropertyFavorite[]
  total: number
}

// Hook
export function usePropertyFavorite({ page = 1, limit = 10 } = {}) {
  // Create API URL dynamically
  const url = `${appEndpoints.getPropertyFavorite}?entity_type=property&page=${page}&limit=${limit}`

  // Fetcher
  const fetchFavorites = async (endpoint: string) => {
    const response = await getMethod(endpoint)
    return response
  }

  // SWR
  const { data, error, isLoading, mutate: mutateFavorites } = useSWR<ResponseDTO>(url, fetchFavorites)

  const favoritesProperty = data?.data?.data || []
  const totalFavorites = data?.data?.total || 0

  return {
    favorites: favoritesProperty,
    total: totalFavorites,
    error,
    isLoading,
    mutateFavorites,
  }
}
