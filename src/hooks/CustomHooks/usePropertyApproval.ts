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
// Custom hook for managing property approvals
export function usePropertyApprovals() {
  const router = useRouter()

  // Fetcher using our generic API helper
  const fetcher = async (url: string): Promise<PropertyApproval[]> => {
    try {
      const response = await getMethod<PropertyApproval[]>(url)
      console.log('Fetched property approvals ResponseDTO:', response)

      if (response.error) {
        console.error('API error while fetching approvals:', response.message)
        return []
      }

      // Safe extraction of data
      if (Array.isArray(response.data)) {
        return response.data
      }

      console.warn('Unexpected data format:', response.data)
      return []
    } catch (error) {
      console.error('Failed to fetch property approvals:', error)
      return []
    }
  }

  // SWR handles caching, revalidation, and errors
  const {
    data: approvals,
    error,
    isLoading,
    mutate: mutateApprovals,
  } = useSWR<PropertyApproval[]>(
    `${
      appEndpoints.getAllPropertyApprovals
    }?status=PENDING&limit=${10}&page=${1}`,
    fetcher,
  )

  // CRUD handlers
  const handleEdit = useCallback(
    (id: number) => {
      router.push(`/admin/dashboard/property-approval/edit/${id}`)
    },
    [router],
  )

  return {
    approvals: approvals ?? [],
    error,
    isLoading,
    handleEdit,
    mutateApprovals,
  }
}
