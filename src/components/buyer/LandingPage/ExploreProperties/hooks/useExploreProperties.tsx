'use client'

import useSWR from 'swr'
import { appEndpoints } from '@/services/endpoints'
import { getMethod } from '@/services/service'
import { useRouter } from 'next/navigation'
import { ResponseDTO } from '@/components/dto/response_dto'

interface UseExplorePropertiesOptions {
  page?: number
  limit?: number
}

const fetchExploreProperties = async (url: string) => {
  const response = await getMethod(url)
  return response
}

export function useExploreProperties(options: UseExplorePropertiesOptions = {}) {
  const router = useRouter()
  const { page, limit } = options

  const queryParams = new URLSearchParams()

  if (limit != null) {
    queryParams.set('limit', String(limit))
  }

  if (page != null) {
    queryParams.set('page', String(page))
  }

  const swrKey = queryParams.toString()
    ? `${appEndpoints.getAllPropertyDistrictSummary}?${queryParams.toString()}`
    : appEndpoints.getAllPropertiesList

  const { data, error, isLoading } = useSWR<ResponseDTO>(swrKey, fetchExploreProperties)

  const handleSeeMore = (id: number) => {
    router.push(`/propertyDetails/${id}`)
  }

  return {
    items: data?.data ?? [],
    total: data?.data?.total ?? 0,
    isLoading,
    error,
    handleSeeMore,
  }
}
