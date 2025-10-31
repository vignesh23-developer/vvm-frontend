'use client'

import { useCallback } from 'react'
import useSWR from 'swr'
import { useRouter } from 'next/navigation'
import { appEndpoints } from '@/services/endpoints'
import { getMethod, patchMethod } from '@/services/service'
import toast from 'react-hot-toast'

// Strongly typed interface
export interface FeatureGroup {
  id: number
  name: string
  icon: string
  sortOrder: number
  isActive: boolean
}

// Custom hook for managing property categories
export function useFeatureGroup() {
  const router = useRouter()

  // Fetcher using our generic API helper
  const fetcher = async (url: string): Promise<FeatureGroup[]> => {
    try {
      const response = await getMethod<FeatureGroup[]>(url)
      console.log('Fetched feature group ResponseDTO:', response)

      if (response.error) {
        console.error('API error while fetching group:', response.message)
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
    data: groups,
    error,
    isLoading,
    mutate: mutateGroups,
  } = useSWR<FeatureGroup[]>(`${appEndpoints.getAllFeatureGroups}`, fetcher)

  // CRUD handlers
  const handleAdd = useCallback(() => {
    router.push('/admin/dashboard/feature-group/add')
  }, [router])

  const handleEdit = useCallback(
    (id: number) => {
      router.push(`/admin/dashboard/feature-group/edit/${id}`)
    },
    [router],
  )

  const handleDelete = async (id: number, newStatus: boolean) => {
    try {
      await patchMethod(
        `${appEndpoints.updateFeatureGroupStatus(id.toString())}`,
        false,
      )

      // ✅ Revalidate data after update
      mutateGroups()

      toast.success(`Category ${newStatus ? 'activated' : 'deactivated'}!`)
    } catch (err) {
      console.error('Failed to update status:', err)
      toast.error('Failed to update status')
    }
  }

  return {
    groups: groups ?? [],
    error,
    isLoading,
    handleAdd,
    handleEdit,
    handleDelete,
    mutateGroups,
  }
}
