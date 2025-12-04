'use client'

import { useCallback } from 'react'
import useSWR from 'swr'
import { useRouter } from 'next/navigation'
import { appEndpoints } from '@/services/endpoints'
import { getMethod, patchMethod } from '@/services/service'
import { FeatureGroup, FeatureGroupTableProps } from '@/app/admin/dashboard/(master)/feature-group/(dto)/FeatureGroupType'
import toast from 'react-hot-toast'
import { ResponseDTO } from '@/components/dto/response_dto'

// Custom hook for managing property categories
export function useFeatureGroup({ page = 1, limit = 10 } = {} as FeatureGroupTableProps) {
  const router = useRouter()

  // Fetcher using our generic API helper
  const fetcher = async (url: string) => {
    const response = await getMethod(url)
    return response
  }

  // SWR handles caching, revalidation, and errors
  const {
    data,
    error,
    isLoading,
    mutate: mutateGroups,
  } = useSWR<ResponseDTO>(`${appEndpoints.getAllFeatureGroups}?page=${page}&limit=${limit}`, fetcher)

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
      await patchMethod(`${appEndpoints.updateFeatureGroupStatus(id.toString())}`)

      // Revalidate data after update
      mutateGroups()

      toast.success(`Category ${newStatus ? 'activated' : 'deactivated'}!`)
    } catch (err) {
      console.error('Failed to update status:', err)
      toast.error('Failed to update status')
    }
  }

  return {
    groups: data?.data?.data as FeatureGroup[] | undefined,
    total: data?.data?.total as number | undefined,
    error,
    isLoading,
    handleAdd,
    handleEdit,
    handleDelete,
    mutateGroups,
  }
}
