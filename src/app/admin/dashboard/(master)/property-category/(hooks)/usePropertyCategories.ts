'use client'

import { useCallback } from 'react'
import useSWR from 'swr'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { appEndpoints } from '@/services/endpoints'
import { getMethod, patchMethod } from '@/services/service'
import { PropertyCategory, PropertyCategoryTableProps } from '@/app/admin/dashboard/(master)/property-category/(dto)/propertyCategoryType'
import { ResponseDTO } from '@/components/dto/response_dto'

// Hook
export function usePropertyCategories({ page = 1, limit = 10 } = {} as PropertyCategoryTableProps) {
  const router = useRouter()

  // 🔹 Generic fetcher for SWR
  const fetcher = async (url: string) => {
    const result = await getMethod(url)
    return result
  }

  // 🔹 SWR data hook
  const { data, error, isLoading, mutate } = useSWR<ResponseDTO>(
    `${appEndpoints.getAllPropertyCategories}?activeOnly=true&page=${page}&limit=${limit}`,
    fetcher,
  )

  // 🔹 Handlers
  const navigate = useCallback((path: string) => router.push(path), [router])

  const handleAdd = useCallback(() => navigate('/admin/dashboard/property-category/add'), [navigate])

  const handleEdit = useCallback((id: number) => navigate(`/admin/dashboard/property-category/edit/${id}`), [navigate])

  const handleCategoryMapping = useCallback((id: number) => navigate(`/admin/dashboard/category-mappings/add/${id}`), [navigate])

  const handleDelete = useCallback(
    async (id: number, newStatus: boolean) => {
      try {
        await patchMethod(`${appEndpoints.updatePropertyCategoryStatus(id.toString())}?isActive=${newStatus}`)

        await mutate()
        toast.success(`Category ${newStatus ? 'activated' : 'deactivated'}!`)
      } catch (err) {
        console.error('Failed to update category status:', err)
        toast.error('Failed to update status')
      }
    },
    [mutate],
  )

  return {
    categories: data?.data?.data as PropertyCategory[] | undefined,
    total: data?.data?.data?.total as number | undefined,
    error,
    isLoading,
    handleAdd,
    handleEdit,
    handleCategoryMapping,
    handleDelete,
    mutateCategories: mutate,
  }
}
