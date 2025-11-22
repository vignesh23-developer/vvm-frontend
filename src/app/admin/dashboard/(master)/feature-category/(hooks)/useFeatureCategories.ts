'use client'

import { useCallback } from 'react'
import useSWR, { mutate } from 'swr'
import { useRouter } from 'next/navigation'
import { appEndpoints } from '@/services/endpoints'
import { getMethod, patchMethod } from '@/services/service'
import { FeatureCategory } from '@/app/admin/dashboard/(master)/feature-category/(dto)/featureCategoryType'
import toast from 'react-hot-toast'
import { ResponseDTO } from '@/components/dto/response_dto'

// Custom Hook
export function useFeatureCategories() {
  const router = useRouter()

  // Fetcher function
  const fetcher = async (url: string) => {
    const response = await getMethod(url)
    return response
  }

  //  SWR Data Fetch
  const { data, error, isLoading, mutate: mutateCategories } = useSWR<ResponseDTO>(`${appEndpoints.getAllFeatureCategories}?activeOnly=true`, fetcher)

  // CRUD Operations
  const handleAdd = useCallback(() => {
    router.push('/admin/dashboard/feature-category/add')
  }, [router])

  const handleEdit = useCallback(
    (id: number) => {
      router.push(`/admin/dashboard/feature-category/edit/${id}`)
    },
    [router],
  )

  const handleRefresh = useCallback(() => {
    mutate(appEndpoints.getAllFeatureCategories)
  }, [])

  const handleDelete = async (id: number, newStatus: boolean) => {
    try {
      // Call your API helper
      await patchMethod(`${appEndpoints.updateFeatureCategoryStatus(id.toString())}?isActive=${newStatus}`)

      // Revalidate SWR data
      mutateCategories()

      // Show success toast
      toast.success(`Category ${newStatus ? 'activated' : 'deactivated'}!`)
    } catch (err) {
      console.error('Failed to update status:', err)

      // Show error toast
      toast.error('Failed to update status')
    }
  }

  return {
    categories: data?.data ?? [],
    total: data?.data?.total ?? 0,
    error,
    isLoading,
    handleAdd,
    handleEdit,
    handleDelete,
    handleRefresh,
    mutateCategories,
  }
}
