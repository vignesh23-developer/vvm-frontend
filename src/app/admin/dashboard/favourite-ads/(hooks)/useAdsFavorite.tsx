'use client'

import useSWR from 'swr'
import { appEndpoints } from '@/services/endpoints'
import { getMethod } from '@/services/service'
import { ResponseDTO } from '@/components/dto/response_dto'
import { AdsFavorite } from '../(dto)/AdsFavoriteType'

// Response shape for SWR
interface FavoriteResponse {
  data: AdsFavorite[]
  total: number
}

// Hook
export function useAdsFavorite({ page = 1, limit = 10 } = {}) {
  // Create API URL for favorite ads with pagination
  const url = `/ads/my-favorities-ads?page=${page}&limit=${limit}`

  // Fetcher
  const fetchFavorites = async (endpoint: string) => {
    const response = await getMethod(endpoint)
    return response
  }

  // SWR
  const { data, error, isLoading, mutate: mutateFavorites } = useSWR<ResponseDTO>(url, fetchFavorites)

  const favoriteAds = data?.data?.data || []
  const totalFavorites = data?.data?.total || 0

  return {
    favorites: favoriteAds,
    total: totalFavorites,
    error,
    isLoading,
    mutateFavorites,
  }
}
