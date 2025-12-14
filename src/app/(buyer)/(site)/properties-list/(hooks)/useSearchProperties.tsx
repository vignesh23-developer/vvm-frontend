'use client'

import useSWR from 'swr'
import { useRouter } from 'next/navigation'
import { appEndpoints } from '@/services/endpoints'
import { PropertiesDto } from '@/app/(seller)/properties/dto/PropertiesDto'
import { deleteMethod, getMethod, patchMethod, putMethod } from '@/services/service'
import toast from 'react-hot-toast'
import { ResponseDTO } from '@/components/dto/response_dto'

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
  location?: string
  listingType?: string
  type?: string
  budget?: string
}

interface PropertiesFetcherResult {
  items: PropertiesDto[]
  total: number
}

const parseBudgetRange = (budget?: string): { min?: number; max?: number } => {
  if (!budget) {
    return {}
  }

  const trimmed = budget.trim()
  if (!trimmed) {
    return {}
  }

  // Expected format: "<min>-<max>" (numbers). Example: "0-10000000"
  const parts = trimmed.split('-').map(part => part.trim())
  if (parts.length !== 2) {
    return {}
  }

  const min = Number(parts[0])
  const max = Number(parts[1])

  const safeMin = Number.isFinite(min) && min >= 0 ? min : undefined
  const safeMax = Number.isFinite(max) && max >= 0 ? max : undefined

  if (safeMin == null && safeMax == null) {
    return {}
  }

  // If both present but swapped, normalize.
  if (safeMin != null && safeMax != null) {
    return safeMin <= safeMax ? { min: safeMin, max: safeMax } : { min: safeMax, max: safeMin }
  }

  return { min: safeMin, max: safeMax }
}

// Custom hook for managing properties
export function useSearchProperties(options: UsePropertiesOptions = {}) {
  const router = useRouter()
  const { page = 1, limit = 10, location, listingType, type, budget } = options

  const queryParams = new URLSearchParams()
  if (location) {
    queryParams.set('q', location)
  }
  if (listingType) {
    queryParams.set('listing_type', listingType)
  }
  if (type) {
    queryParams.set('property_category_id', type)
  }

  const budgetRange = parseBudgetRange(budget)
  if (budgetRange.min != null && budgetRange.min > 0) {
    queryParams.set('price_min', String(budgetRange.min))
  }
  if (budgetRange.max != null && budgetRange.max > 0) {
    queryParams.set('price_max', String(budgetRange.max))
  }
  if (limit != null) {
    queryParams.set('limit', String(limit))
  }
  if (page != null) {
    queryParams.set('page', String(page))
  }

  // Note: API expects price_min/price_max, not a raw "budget" param.

  const swrKey = queryParams.toString() ? `${appEndpoints.getSearchByProperties}?${queryParams.toString()}` : appEndpoints.getSearchByProperties

  // Fetcher using our generic API helper
  const fetcher = async (url: string) => {
    const response = await getMethod(url)
    return response
  }
  // SWR handles caching, revalidation, and errors
  const { data, error, isLoading: isLoadingProperties, mutate: mutateProperties } = useSWR<ResponseDTO>(swrKey, fetcher)

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

  const handleView = (id: string) => {
    router.push(`/propertyDetails/${id}`)
  }
  const handleEdit = (id: string) => {
    router.push(`/properties-registration/${id}`)
  }
  const handleDelete = async (id: string, newStatus: boolean) => {
    try {
      // await patchMethod(`${appEndpoints.updatePropertyStatus(id.toString())}`)

      await deleteMethod(`${appEndpoints.deleteProperty(id.toString())}`)

      // Revalidate data after update
      mutateProperties()

      toast.success(`Property ${newStatus ? 'activated' : 'deactivated'}!`)
    } catch (err) {
      console.error('Failed to update status:', err)
      toast.error('Failed to update status')
    }
  }

  return {
    properties: data?.data?.data?.data ?? [],
    total: data?.data?.data?.total ?? data?.data?.data?.data?.length,
    error,
    handleView,
    handleEdit,
    handleDelete,
    isLoadingProperties,
    mutateProperties,
    handlePropertyAction,
  }
}
