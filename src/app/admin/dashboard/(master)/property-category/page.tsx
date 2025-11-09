'use client'

import { Plus, Settings, Edit3, Trash2 } from 'lucide-react'
import { useMemo, useCallback } from 'react'
import { usePropertyCategories } from '@/app/admin/dashboard/(master)/property-category/(hooks)/usePropertyCategories'
import { PropertyCategory } from '@/app/admin/dashboard/(master)/property-category/(dto)/propertyCategoryType'
import DataTable from '@/components/ui/CustomComponent/Tables/DataTable'
import Button from '@/components/ui/CustomComponent/Button/Button'

type PropertyCategoryTableRow = PropertyCategory & Record<string, unknown>

export default function PropertyCategoryPage() {
  const { categories, error, isLoading, handleAdd, handleCategoryMapping, handleEdit, handleDelete, mutateCategories } = usePropertyCategories()

  // ✅ Columns definition

  const columns = useMemo(
    () => [
      {
        field: 'name',
        title: 'Property Category',
        sortable: true,
        filterable: true,
      },
      {
        field: 'icon',
        title: 'Icon',
        sortable: true,
        filterable: true,
      },
      {
        field: 'description',
        title: 'Description',
        sortable: true,
        filterable: true,
      },
      {
        field: 'sortOrder',
        title: 'Sort Order',
        sortable: true,
        filterable: true,
      },
    ],
    [],
  )

  const actions = useMemo(
    () => [
      {
        label: 'Settings',
        icon: Settings,
        onClick: (row: PropertyCategoryTableRow) => handleCategoryMapping(row.id),
        color: '#1e6897',
      },
      {
        label: 'Edit',
        icon: Edit3,
        onClick: (row: PropertyCategoryTableRow) => {
          void handleEdit(row.id)
        },
        color: '#1e6897',
      },
      {
        label: 'Delete',
        icon: Trash2,
        onClick: (row: PropertyCategoryTableRow) => {
          void handleDelete(row.id, !row.isActive)
        },
        color: '#e02424',
      },
    ],
    [handleDelete, handleEdit, handleCategoryMapping],
  )

  const fetchCategories = useCallback(async () => {
    const latestCategories = (categories ?? []) as PropertyCategoryTableRow[]

    return {
      data: latestCategories,
      totalItems: latestCategories?.length,
    }
  }, [categories])

  // ✅ Handle loading and error states
  if (error) return <div className="p-6 text-red-600">Failed to load property categories.</div>

  if (isLoading) return <div className="p-6 text-gray-600 animate-pulse">Loading property categories...</div>

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Property Categories</h1>
        <Button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-2 bg-[#7B1E1E] px-4 py-2 text-sm font-medium text-white rounded-md shadow-md hover:bg-[#641717] transition"
        >
          <Plus size={16} /> Add Property Category
        </Button>
      </div>
      <DataTable<PropertyCategoryTableRow>
        columns={columns}
        actions={actions}
        fetchData={fetchCategories}
        loading={isLoading}
        allowExport
        allowGrouping
        allowRefresh
      />
    </div>
  )
}
