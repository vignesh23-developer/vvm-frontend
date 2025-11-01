import useSWR from 'swr'
import { appEndpoints } from '@/services/endpoints'
import { getMethod } from '@/services/service'
import { ResponseDTO } from '@/components/dto/response_dto'
import { PropertyDetailsResponseDto } from '@/app/(buyer)/(site)/propertyDetails/dto/propertiesDetailDto'

const fetcher = async (endpoint: string) => getMethod<PropertyDetailsResponseDto>(endpoint)

interface UsePropertiesDetailParams {
  id: string | string[] | undefined
}

export default function usePropertiesDetail({ id }: UsePropertiesDetailParams) {
  const propertyId = Array.isArray(id) ? id[0] : id

  console.log('usePropertiesDetail - Property ID:', propertyId)

  const swrKey = propertyId ? `${appEndpoints.getPropertyByID(propertyId)}` : null

  const { data, error, isLoading, mutate } = useSWR<ResponseDTO<PropertyDetailsResponseDto>>(swrKey, fetcher)

  console.log('usePropertiesDetail - SWR Data:', data, 'Error:', error, 'Loading:', isLoading)

  return {
    propertyDetailsData: data?.data,
    propertyDetailsFetchLoader: isLoading,
    propertyDetailsFetchErr: error ?? (data?.error ? new Error(data.message) : undefined),
    propertyDetailsRefresh: mutate,
  }
}
