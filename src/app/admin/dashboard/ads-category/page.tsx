'use client'

import { Plus, Settings, Edit3, Trash2 } from 'lucide-react'
import CustomLoader from '@/components/ui/CustomComponent/Loader/CustomLoader'
import { useMemo, useCallback } from 'react'
import { useAdsCategories } from '@/app/admin/dashboard/ads-category/(hooks)/useAdsCategories'
import DataTable from '@/components/ui/CustomComponent/Tables/DataTable'
import Button from '@/components/ui/CustomComponent/Button/Button'
import { AdsCategory } from './(dto)/adsCategoryType'

type AdsCategoryTableRow = AdsCategory & Record<string, unknown>

export default function AdsCategoryPage() {
  const { categories, error, isLoading, handleAdd, handleEdit, handleDelete } = useAdsCategories()

  // ✅ Columns definition

  const columns = useMemo(
    () => [
      {
        field: 'name',
        title: 'Ads Category',
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
        label: 'Edit',
        icon: Edit3,
        onClick: (row: AdsCategoryTableRow) => {
          void handleEdit(row.id)
        },
        color: '#1e6897',
      },
      {
        label: 'Delete',
        icon: Trash2,
        onClick: (row: AdsCategoryTableRow) => {
          void handleDelete(row.id, !row.isActive)
        },
        color: '#e02424',
      },
    ],
    [handleDelete, handleEdit],
  )

  const fetchCategories = useCallback(async () => {
    const latestCategories = (categories ?? []) as AdsCategoryTableRow[]

    return {
      data: latestCategories,
      totalItems: latestCategories?.length,
    }
  }, [categories])

  // ✅ Handle loading and error states
  if (error) return <div className="p-6 text-red-600">Failed to load ads categories.</div>

  if (isLoading) return <CustomLoader text="Loading ads categories..." />
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Ads Categories</h1>
        <Button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-2 bg-[#7B1E1E] px-4 py-2 text-sm font-medium text-white rounded-md shadow-md hover:bg-[#641717] transition"
        >
          <Plus size={16} /> Add Ads Category
        </Button>
      </div>
      <DataTable<AdsCategoryTableRow>
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