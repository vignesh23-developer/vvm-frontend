'use client'

import { Trash2, Edit3, Plus } from 'lucide-react'
import useSWR, { mutate } from 'swr'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import Table from '@/components/ui/CustomComponent/Table/Table'
import { appEnpoints } from '@/services/endpoints'
import { getMethod } from '@/services/service'

interface PropertyCategory {
  id: number
  name: string
  description?: string
  isActive?: boolean
  sortOrder?: number
}

export default function PropertyCategoryPage() {
  const router = useRouter()

  const fetcher = async (url: string) => {
    const response = await getMethod<any>(url)

    // Normalize common wrappers to an array of PropertyCategory
    if (Array.isArray(response)) return response as PropertyCategory[]
    if (response && typeof response === 'object') {
      if (Array.isArray((response as any).data))
        return (response as any).data as PropertyCategory[]
      if (Array.isArray((response as any).items))
        return (response as any).items as PropertyCategory[]
      if (Array.isArray((response as any).result))
        return (response as any).result as PropertyCategory[]
    }

    // Fallback to empty array
    return [] as PropertyCategory[]
  }
  const {
    data: categories,
    error,
    isLoading,
  } = useSWR<PropertyCategory[]>(appEnpoints.getAllPropertyCategories, fetcher)
  const data = categories ?? []

  const handleAdd = useCallback(
    () => router.push('/admin/dashboard/property-category/add'),
    [router],
  )
  const handleEdit = useCallback(
    (id: number) =>
      router.push(`/admin/dashboard/property-category/edit/${id}`),
    [router],
  )
  const handleDelete = useCallback(async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return
    try {
      await fetch(`${appEnpoints.deletePropertyCategory}/${id}`, {
        method: 'DELETE',
      })
      mutate(appEnpoints.getAllPropertyCategories)
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }, [])
  const handleRefresh = useCallback(
    () => mutate(appEnpoints.getAllPropertyCategories),
    [],
  )

  const columns = useMemo(
    () => [
      { key: 'name', header: 'Property Category' },
      { key: 'description', header: 'Description' },
      {
        key: 'isActive',
        header: 'Status',
        render: (row: PropertyCategory) => (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              row.isActive
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-600'
            }`}
          >
            {row.isActive ? 'Active' : 'Inactive'}
          </span>
        ),
      },
      { key: 'sortOrder', header: 'Sort Order' },

      {
        key: 'actions',
        header: 'Actions',
        render: (row: PropertyCategory) => (
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleEdit(row.id)}
              className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition"
              aria-label={`Edit ${row.name}`}
            >
              <Edit3 size={16} />
            </button>
            <button
              onClick={() => handleDelete(row.id)}
              className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition"
              aria-label={`Delete ${row.name}`}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ),
      },
    ],
    [handleEdit, handleDelete],
  )

  if (error)
    return (
      <div className="p-6 text-red-600">
        Failed to load property categories.
      </div>
    )
  if (isLoading)
    return (
      <div className="p-6 text-gray-600 animate-pulse">
        Loading property categories...
      </div>
    )

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* ✅ Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <span>Dashboard</span>
        <span className="text-gray-400">›</span>
        <span className="font-medium text-gray-700">
          Property Category Master
        </span>
      </nav>

      {/* ✅ Page Header */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">
          Property Categories
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-[#7B1E1E] hover:bg-[#641717] cursor-pointer text-white px-4 py-2 rounded-md text-sm font-medium shadow-md transition"
            aria-label="Add category"
          >
            <Plus size={16} /> Add Category
          </button>
        </div>
      </div>

      {/* ✅ Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <Table<PropertyCategory> columns={columns} data={data} />
      </div>
    </div>
  )
}
