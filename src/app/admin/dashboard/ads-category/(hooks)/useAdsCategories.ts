'use client'

import { useCallback } from 'react'
import useSWR from 'swr'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { appEndpoints } from '@/services/endpoints'
import { getMethod, patchMethod } from '@/services/service'
import { AdsCategory, AdsCategoryProps } from '../(dto)/adsCategoryType'
import { ResponseDTO } from '@/components/dto/response_dto'

// Hook
export function useAdsCategories({ page = 1, limit = 10 } = {} as AdsCategoryProps) {
  const router = useRouter()

  // 🔹 Generic fetcher for SWR
  const fetcher = async (url: string) => {
    const response = await getMethod(url)
    return response
  }

  // 🔹 SWR data hook
  const { data, error, isLoading, mutate } = useSWR<ResponseDTO>(
    `${appEndpoints.getAllAdsCategories}?activeOnly=true&page=${page}&limit=${limit}`,
    fetcher,
  )

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

  console.log('Ads Categories Data:', data, data?.data)
  return {
    categories: data?.data?.data ?? [],
    total: data?.data?.total ?? 0,
    error,
    isLoading,
    handleAdd,
    handleEdit,
    handleDelete,
    mutateCategories: mutate,
  }
}
