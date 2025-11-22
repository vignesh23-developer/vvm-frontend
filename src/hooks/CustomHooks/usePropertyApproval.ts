'use client'

import { useCallback } from 'react'
import useSWR from 'swr'
import { useRouter } from 'next/navigation'
import { appEndpoints } from '@/services/endpoints'
import { getMethod } from '@/services/service'
import toast from 'react-hot-toast'

// Strongly typed interface
export interface PropertyApproval {
  id: number
  name: string
  description?: string
  isActive?: boolean
  sortOrder?: number
}

interface UsePropertyApprovalsOptions {
  page?: number
  limit?: number
  status?: string
}

// Custom hook for managing property approvals
export function usePropertyApprovals(options: UsePropertyApprovalsOptions = {}) {
  const router = useRouter()

  const { page = 1, limit = 10, status = 'PENDING' } = options

  const queryParams = new URLSearchParams()
  if (status) {
    queryParams.set('status', status)
  }
  if (limit != null) {
    queryParams.set('limit', String(limit))
  }
  if (page != null) {
    queryParams.set('page', String(page))
  }

  const swrKey = `${appEndpoints.getAllPropertyApprovals}?${queryParams.toString()}`

  // Fetcher using our generic API helper
  const fetcher = async (url: string): Promise<PropertyApproval[]> => {
    try {
      const { data, error, message } = await getMethod<PropertyApproval[]>(url)
      console.log('Fetched property approvals ResponseDTO:', data)

      if (error) {
        console.error('API error while fetching approvals:', message)
        return []
      }

      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error('Failed to fetch property approvals:', error)
      return []
    }
  }

  // SWR handles caching, revalidation, and errors
  const { data, error, isLoading, mutate: mutateApprovals } = useSWR<PropertyApproval[]>(swrKey, fetcher)

  // CRUD handlers
  const handleEdit = useCallback(
    (id: number) => {
      router.push(`/admin/property-approval/edit/${id}`)
    },
    [router],
  )

  return {
    approvals: data ?? [],
    total: data?.length ?? 0,
    error,
    isLoading,
    handleEdit,
    mutateApprovals,
  }
}
