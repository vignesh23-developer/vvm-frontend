'use client'

import { useCallback } from 'react'
import useSWR from 'swr'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { appEndpoints } from '@/services/endpoints'
import { getMethod, patchMethod } from '@/services/service'
import { PropertyCategory } from '@/app/admin/dashboard/(master)/property-category/(dto)/propertyCategoryType'

// Hook
export function usePropertyCategories() {
  const router = useRouter()

  // 🔹 Generic fetcher for SWR
  const fetcher = async (url: string): Promise<PropertyCategory[]> => {
    try {
      const { data, error, message } = await getMethod<PropertyCategory[]>(url)

      if (error) {
        console.error('Error fetching categories:', message)
        return []
      }

      return Array.isArray(data) ? data : []
    } catch (err) {
      console.error('Failed to fetch categories:', err)
      return []
    }
  }

  // 🔹 SWR data hook
  const { data: categories = [], error, isLoading, mutate } = useSWR(`${appEndpoints.getAllPropertyCategories}?activeOnly=true`, fetcher)

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
    categories,
    error,
    isLoading,
    handleAdd,
    handleEdit,
    handleCategoryMapping,
    handleDelete,
    mutateCategories: mutate,
  }
}
