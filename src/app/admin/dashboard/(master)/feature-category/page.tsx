'use client'

import { Plus, Edit3, Trash2 } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import DataTable from '@/components/ui/CustomComponent/Tables/DataTable'
import { useFeatureCategories } from '@/app/admin/dashboard/(master)/feature-category/(hooks)/useFeatureCategories'
import { FeatureCategory } from '@/app/admin/dashboard/(master)/feature-category/(dto)/featureCategoryType'
import CustomLoader from '@/components/ui/CustomComponent/Loader/CustomLoader'

type FeatureCategoryTableRow = FeatureCategory & Record<string, unknown>
export default function FeatureCategoryPage() {
  const { categories, error, isLoading, handleAdd, handleEdit, handleDelete } = useFeatureCategories()

  const columns = useMemo(
    () => [
      {
        field: 'code',
        title: 'Code',
        sortable: true,
        filterable: true,
      },

      {
        field: 'name',
        title: 'Feature Category',
        sortable: true,
        filterable: true,
      },
    ],
    [],
  )

  const actions = useMemo(
    () => [
      {
        label: 'Edit',
        icon: Edit3,
        onClick: (row: FeatureCategoryTableRow) => {
          void handleEdit(row.id)
        },
        color: '#1e6897',
      },
      {
        label: 'Delete',
        icon: Trash2,
        onClick: (row: FeatureCategoryTableRow) => {
          void handleDelete(row.id, !row.isActive)
        },
        color: '#e02424',
      },
    ],
    [handleDelete, handleEdit],
  )

  const fetchCategories = useCallback(async () => {
    const latestCategories = (categories ?? []) as FeatureCategoryTableRow[]

    return {
      data: latestCategories,
      totalItems: latestCategories.length,
    }
  }, [categories])

  if (error) return <div className="p-6 text-red-600">Failed to load feature categories.</div>
  if (isLoading) return <CustomLoader text="Loading feature categories..." />

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Feature Categories</h1>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-[#7B1E1E] hover:bg-[#641717] cursor-pointer text-white px-4 py-2 rounded-md text-sm font-medium shadow-md transition"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <DataTable<FeatureCategoryTableRow>
          columns={columns}
          actions={actions}
          fetchData={fetchCategories}
          loading={isLoading}
          allowExport
          allowGrouping
          allowRefresh
        />
      </div>
    </div>
  )
}
