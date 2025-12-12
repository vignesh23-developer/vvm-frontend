'use client'

import { Plus, Edit3, Trash2 } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import DataTable from '@/components/ui/CustomComponent/Tables/DataTable'
import { useFeatureCategories } from '@/app/admin/dashboard/(master)/feature-category/(hooks)/useFeatureCategories'
import { FeatureCategory } from '@/app/admin/dashboard/(master)/feature-category/(dto)/featureCategoryType'
import CustomLoader from '@/components/ui/CustomComponent/Loader/CustomLoader'

type FeatureCategoryTableRow = FeatureCategory & Record<string, unknown>
export default function FeatureCategoryPage() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const { categories, error, total, isLoading, handleAdd, handleEdit, handleDelete, mutateCategories } = useFeatureCategories({ page, limit })

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
        color: '#2a1407',
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

  const handleRefresh = async () => {
    await mutateCategories()
  }

  if (error) return <div className="p-6 text-red-600">Failed to load feature categories.</div>
  if (isLoading) return <CustomLoader text="Loading feature categories..." />

  return (
    <div className="p-6 bg-gradient-to-br from-yellow-50 via-white to-yellow-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-[#2a1407]">Feature Categories</h1>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-[#2a1407] hover:from-[#2a1407] hover:to-[#2a1407] cursor-pointer text-white px-4 py-2 rounded-md text-sm font-medium shadow-md transition"
        >
          <Plus size={16} /> Add Feature Category
        </button>
      </div>

      {/* Table */}
      <div className="bg-gradient-to-br from-white to-yellow-50/20 rounded-xl shadow-sm border border-yellow-200 p-4">
        <DataTable<FeatureCategoryTableRow>
          columns={columns}
          actions={actions}
          fetchData={fetchCategories}
          loading={isLoading}
          allowExport
          allowGrouping
          allowRefresh
          onRefresh={handleRefresh}
          isPagination={true}
          initialPage={page}
          pageSize={limit}
          totalItemsData={total}
          totalPageData={Math.ceil((total ?? 0) / (limit || 1))}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          setPage={setPage}
          setCurrentPageSize={setLimit}
        />
      </div>
    </div>
  )
}
