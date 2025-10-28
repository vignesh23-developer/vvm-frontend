'use client'

import { useCallback } from 'react'
import useSWR, { mutate } from 'swr'
import { useRouter } from 'next/navigation'
import { appEndpoints } from '@/services/endpoints'
import { getMethod, patchMethod } from '@/services/service'
import toast from 'react-hot-toast'

// ✅ Define type
export interface FeatureOption {
  id: number
  name: string
  value: string
  sortOrder: number
  isActive: boolean
  featureCategoryId: string
  createdAt: string
  updatedAt: string
}

export interface FeatureCategory {
  id: number
  code: string
  name: string
  description?: string
  featureGroupId: string
  featureGroupName?: string
  featureGroupSortOrder?: string
  inputType:
    | 'single_select'
    | 'multi_select'
    | 'text'
    | 'numeric'
    | 'boolean'
    | 'units'
    | string
  isFilterable: boolean
  isMandatory: boolean
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  options?: FeatureOption[]
}

// ✅ Custom Hook
export function useFeatureCategories() {
  const router = useRouter()

  // ✅ Fetcher function
  // Fetcher using our generic API helper
  const fetcher = async (url: string): Promise<FeatureCategory[]> => {
    try {
      const response = await getMethod<FeatureCategory[]>(url)
      console.log('Fetched feature categories ResponseDTO:', response)

      if (response.error) {
        console.error('API error while fetching categories:', response.message)
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

  //  SWR Data Fetch
  const {
    data: categories,
    error,
    isLoading,
    mutate: mutateCategories,
  } = useSWR<FeatureCategory[]>(
    `${appEndpoints.getAllFeatureCategories}?activeOnly=true`,
    fetcher,
  )

  console.log('useFeatureCategories - categories:', categories)
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
      // ✅ Call your API helper
      await patchMethod(
        `${appEndpoints.updateFeatureCategoryStatus(
          id.toString(),
        )}?isActive=${newStatus}`,
        false,
      )

      // ✅ Revalidate SWR data
      mutateCategories()

      // ✅ Show success toast
      toast.success(`Category ${newStatus ? 'activated' : 'deactivated'}!`)
    } catch (err) {
      console.error('Failed to update status:', err)

      // ✅ Show error toast
      toast.error('Failed to update status')
    }
  }

  return {
    categories: categories ?? [],
    error,
    isLoading,
    handleAdd,
    handleEdit,
    handleDelete,
    handleRefresh,
    mutateCategories,
  }
}
