'use client'

import { useCallback } from 'react'
import useSWR from 'swr'
import { useRouter } from 'next/navigation'
import { appEndpoints } from '@/services/endpoints'
import { deleteMethod, getMethod } from '@/services/service'
import toast from 'react-hot-toast'

// Strongly typed interface
export interface RoleManagement {
  id: number
  name: string
  description?: string
}

// Custom hook for managing role management
export function useRoleManagement() {
  const router = useRouter()

  // Fetcher using our generic API helper
  const fetcher = async (url: string): Promise<RoleManagement[]> => {
    try {
      const response = await getMethod<RoleManagement[]>(url)
      console.log('Fetched role management ResponseDTO:', response)

      if (response.error) {
        console.error('API error while fetching roles:', response.message)
        return []
      }

      // Safe extraction of data
      if (Array.isArray(response.data)) {
        return response.data
      }

      console.warn('Unexpected data format:', response.data)
      return []
    } catch (error) {
      console.error('Failed to fetch role management:', error)
      return []
    }
  }

  // SWR handles caching, revalidation, and errors
  const {
    data: roles,
    error,
    isLoading,
    mutate: mutateRoles,
  } = useSWR<RoleManagement[]>(`${appEndpoints.getAllRoles}`, fetcher)

  // CRUD handlers
  const handleAdd = useCallback(() => {
    router.push('/admin/dashboard/role-management/add')
  }, [router])

  const handleEdit = useCallback(
    (id: number) => {
      router.push(`/admin/dashboard/role-management/edit/${id}`)
    },
    [router],
  )

  const handleDelete = useCallback(
    async (id: number) => {
      if (!window.confirm('Are you sure you want to delete this role?')) return

      try {
        const res = await deleteMethod(
          `${appEndpoints.deleteRole(id.toString())}`,
        )

        console.log('✅ Delete Response:', res.data)

        if (res.data?.error) {
          toast.error(res.data?.message || 'Failed to delete role')
          return
        }

        toast.success('Role deleted successfully')

        // Optimistically revalidate SWR cache
        mutateRoles()
      } catch (err) {
        console.error('Delete failed:', err)
      }
    },
    [mutateRoles],
  )

  return {
    roles: roles ?? [],
    error,
    isLoading,
    handleAdd,
    handleEdit,
    handleDelete,
    mutateRoles,
  }
}
