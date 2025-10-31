'use client'

import { useCallback } from 'react'
import useSWR from 'swr'
import { useRouter } from 'next/navigation'
import { appEndpoints } from '@/services/endpoints'
import { getMethod } from '@/services/service'
import toast from 'react-hot-toast'

// Strongly typed interface
export interface PropertyReports {
  id: number
  name: string
  description?: string
  isActive?: boolean
  sortOrder?: number
}
// Custom hook for managing property reports
export function usePropertyReports() {
  const router = useRouter()

  // Fetcher using our generic API helper
  const fetcher = async (url: string): Promise<PropertyReports[]> => {
    try {
      const response = await getMethod<PropertyReports[]>(url)
      console.log('Fetched property reports ResponseDTO:', response)

      if (response.error) {
        console.error('API error while fetching reports:', response.message)
        return []
      }

      // Safe extraction of data
      if (Array.isArray(response.data)) {
        return response.data
      }

      console.warn('Unexpected data format:', response.data)
      return []
    } catch (error) {
      console.error('Failed to fetch property categories:', error)
      return []
    }
  }

  // SWR handles caching, revalidation, and errors
  const {
    data: reports,
    error,
    isLoading,
    mutate: mutateReports,
  } = useSWR<PropertyReports[]>(
    `${appEndpoints.getAllPropertyReports}?activeOnly=true`,
    fetcher,
  )

  // CRUD handlers
  const handleAdd = useCallback(() => {
    router.push('/admin/dashboard/property-reports/add')
  }, [router])

  const handleEdit = useCallback(
    (id: number) => {
      router.push(`/admin/dashboard/property-reports/edit/${id}`)
    },
    [router],
  )

  return {
    reports: reports ?? [],
    error,
    isLoading,
    handleAdd,
    handleEdit,
    mutateReports,
  }
}
