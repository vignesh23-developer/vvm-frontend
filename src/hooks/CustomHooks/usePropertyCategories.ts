'use client'

import { useCallback } from 'react'
import useSWR from 'swr'
import { useRouter } from 'next/navigation'
import { appEnpoints } from '@/services/endpoints'
import { deleteMethod, getMethod, putMethod } from '@/services/service'
import toast from 'react-hot-toast'

// Strongly typed interface
export interface PropertyCategory {
  id: string
  name: string
  description?: string
  isActive?: boolean
  sortOrder?: number
}

interface CategoryMappingsProps {
  id: number
}
// Custom hook for managing property categories
export function usePropertyCategories() {
  const router = useRouter()

  // Fetcher using our generic API helper
  const fetcher = async (url: string): Promise<PropertyCategory[]> => {
    try {
      const response = await getMethod<PropertyCategory[]>(url)
      console.log('Fetched property categories ResponseDTO:', response)

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

  // SWR handles caching, revalidation, and errors
  const {
    data: categories,
    error,
    isLoading,
    mutate: mutateCategories,
  } = useSWR<PropertyCategory[]>(
    `${appEnpoints.getAllPropertyCategories}?activeOnly=true`,
    fetcher,
  )

  // CRUD handlers
  const handleAdd = useCallback(() => {
    router.push('/admin/dashboard/property-category/add')
  }, [router])

  const handleCategoryMapping = useCallback(
    (id: number) => {
      router.push(`/admin/dashboard/category-mappings/add/${id}`)
    },
    [router],
  )

  const handleEdit = useCallback(
    (id: number) => {
      router.push(`/admin/dashboard/property-category/edit/${id}`)
    },
    [router],
  )

  // const handleDelete = useCallback(
  //   async (id: number) => {
  //     if (!window.confirm('Are you sure you want to delete this category?'))
  //       return

  //     try {
  //       const res = await deleteMethod(
  //         `${appEnpoints.deletePropertyCategory(id.toString())}`,
  //       )

  //       if (Number(res.status) !== 200 && Number(res.status) !== 204) {
  //         throw new Error('Failed to delete category')
  //       }

  //       // Optimistically revalidate SWR cache
  //       mutateCategories()
  //     } catch (err) {
  //       console.error('Delete failed:', err)
  //     }
  //   },
  //   [mutateCategories],
  // )

  const handleDelete = async (id: number, newStatus: boolean) => {
    try {
      await putMethod(appEnpoints.updatePropertyCategoryStatus(id.toString()), {
        isActive: newStatus,
      })

      // ✅ Revalidate data after update
      mutateCategories()

      toast.success(`Category ${newStatus ? 'activated' : 'deactivated'}!`)
    } catch (err) {
      console.error('Failed to update status:', err)
      toast.error('Failed to update status')
    }
  }

  return {
    categories: categories ?? [],
    error,
    isLoading,
    handleAdd,
    handleCategoryMapping,
    handleEdit,
    handleDelete,
    mutateCategories,
  }
}
