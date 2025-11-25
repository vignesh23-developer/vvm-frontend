'use client'

import { useCallback } from 'react'
import useSWR from 'swr'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { appEndpoints } from '@/services/endpoints'
import { getMethod, patchMethod } from '@/services/service'
import { AdsCategory } from '../(dto)/adsCategoryType'

// Hook
export function useAdsCategories() {
  const router = useRouter()

  // 🔹 Generic fetcher for SWR
  const fetcher = async (url: string): Promise<AdsCategory[]> => {
    try {
      const { data, error, message } = await getMethod<AdsCategory[]>(url)

      if (error) {
        toast.error(message || 'Failed to fetch categories')
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
  const { data: categories = [], error, isLoading, mutate } = useSWR(`${appEndpoints.getAllAdsCategories}?activeOnly=true`, fetcher)

  // 🔹 Handlers
  const navigate = useCallback((path: string) => router.push(path), [router])

  const handleAdd = useCallback(() => navigate('/admin/dashboard/ads-category/add'), [navigate])

  const handleEdit = useCallback((id: number) => navigate(`/admin/dashboard/ads-category/edit/${id}`), [navigate])

  const handleDelete = useCallback(
    async (id: number, newStatus: boolean) => {
      try {
        await patchMethod(`${appEndpoints.updateAdsCategoryStatus(id.toString())}?isActive=${newStatus}`)

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
    handleDelete,
    mutateCategories: mutate,
  }
}
