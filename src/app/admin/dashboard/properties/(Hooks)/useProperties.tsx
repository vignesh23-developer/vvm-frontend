'use client'

import useSWR from 'swr'
import { useRouter } from 'next/navigation'
import { appEndpoints } from '@/services/endpoints'
import { PropertiesDto } from '../(Dto)/propertiesDto'
import { getMethod, putMethod } from '@/services/service'
import toast from 'react-hot-toast'

interface ApiResponse<T> {
  data?: T
  meta?: {
    total?: number
  }
  total?: number
  error?: boolean
  message?: string
}

interface UsePropertiesOptions {
  page?: number
  limit?: number
}

interface PropertiesFetcherResult {
  items: PropertiesDto[]
  total: number
}

// Custom hook for managing properties
export function useProperties(options: UsePropertiesOptions = {}) {
  const router = useRouter()
  const { page = 1, limit = 6 } = options

  const queryParams = new URLSearchParams()
  if (limit != null) {
    queryParams.set('limit', String(limit))
  }
  if (page != null) {
    queryParams.set('page', String(page))
  }

  const swrKey = queryParams.toString() ? `${appEndpoints.getAllProperties}?${queryParams.toString()}` : appEndpoints.getAllProperties

  // Fetcher using our generic API helper
  const fetcher = async (url: string): Promise<PropertiesFetcherResult> => {
    try {
      const response = await getMethod<ApiResponse<PropertiesDto[]>>(url)
      if (response.error) {
        console.error('API error while fetching properties:', response.message)
        return { items: [], total: 0 }
      }

      const payload = response.data?.data
      const metaTotal = response.data?.meta?.total
      const nestedTotal = response.data?.total

      if (Array.isArray(payload)) {
        return {
          items: payload,
          total: typeof metaTotal === 'number' ? metaTotal : typeof nestedTotal === 'number' ? nestedTotal : payload.length,
        }
      }

      console.warn('Unexpected data format:', response.data)
      return { items: [], total: 0 }
    } catch (error) {
      console.error('Failed to fetch properties:', error)
      return { items: [], total: 0 }
    }
  }
  // SWR handles caching, revalidation, and errors
  const { data, error, isLoading, mutate: mutateProperties } = useSWR<PropertiesFetcherResult>(swrKey, fetcher)

  // Function to approve or reject a property
  const handlePropertyAction = async (
    propertyId: string,
    reviewer_id: string,
    action: 'approve' | 'reject',
    extraData?: { comment?: string; rejectReason?: string },
  ) => {
    const endpoint = action === 'approve' ? appEndpoints.approveProperty(propertyId as string) : appEndpoints.rejectProperty(propertyId as string)

    // status data to be sent in the request body
    let payload = {}
    if (action === 'approve' && extraData?.comment) {
      payload = {
        reviewer_id: reviewer_id,
        // comments: extraData.comment,
      }
    } else if (action === 'reject' && extraData?.rejectReason) {
      payload = {
        reviewer_id: reviewer_id,
        rejection_reason: extraData.rejectReason,
        comments: extraData.comment,
      }
    }
    try {
      const response = await putMethod(endpoint, payload)
      if (response.error) {
        toast.error(`Failed to ${action} property: ${response.message}`)
        return
      } else {
        toast.success(`Property ${action}d successfully`)
        await mutateProperties()
        router.refresh()
      }
    } catch (error) {
      console.error(`Failed to ${action} property:`, error)
      toast.error(`An error occurred while trying to ${action} the property`)
    }
  }
  const properties = data?.items ?? []
  const total = data?.total ?? properties.length

  console.log(
    'useProperties - fetched properties count:',
    data?.items?.map(item => item.media),
    'total:',
    total,
  )

  return {
    properties: properties ?? [],
    total,
    error,
    isLoading,
    mutateProperties,
    handlePropertyAction,
  }
}
