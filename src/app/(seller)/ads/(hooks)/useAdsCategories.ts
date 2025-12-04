'use client'

import useSWR from 'swr'
import { appEndpoints } from '@/services/endpoints'
import { getMethod } from '@/services/service'
import { ResponseDTO } from '@/components/dto/response_dto'

export interface AdsCategoryDto {
  id: string
  name: string
  description: string
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

// Custom hook for fetching ads categories
export function useAdsCategories() {
  const fetcher = async (url: string) => {
    const response = await getMethod(url)
    return response
  }
  const { data, error, isLoading, mutate } = useSWR<ResponseDTO>(appEndpoints.getAllAdsCategories, fetcher)

  return {
    categories: data?.data?.data ?? [],
    error,
    isLoading,
    mutate,
  }
}
