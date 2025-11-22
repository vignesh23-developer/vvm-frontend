'use client'

import { Plus, Edit3, Trash2 } from 'lucide-react'
import { useCallback, useMemo } from 'react'
import DataTable from '@/components/ui/CustomComponent/Tables/DataTable'
import { useFeatureGroup } from '@/app/admin/dashboard/(master)/feature-group/(hooks)/useFeatureGroup'
import { FeatureGroup } from '@/app/admin/dashboard/(master)/feature-group/(dto)/FeatureGroupType'
import CustomLoader from '@/components/ui/CustomComponent/Loader/CustomLoader'

type FeatureGroupTableRow = FeatureGroup & Record<string, unknown>

export default function FeatureGroupPage() {
  const {
    groups,
    total,
    error,
    isLoading,
    handleAdd,
    handleEdit,
    handleDelete,
    mutateGroups, // now included
  } = useFeatureGroup()

  // Columns definition

  const columns = useMemo(
    () => [
      {
        field: 'name',
        title: 'Feature Group',
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
        onClick: (row: FeatureGroupTableRow) => {
          void handleEdit(row.id)
        },
        color: '#1e6897',
      },
      {
        label: 'Delete',
        icon: Trash2,
        onClick: (row: FeatureGroupTableRow) => {
          void handleDelete(row.id, !row.isActive)
        },
        color: '#e02424',
      },
    ],
    [handleDelete, handleEdit],
  )

  const fetchGroups = useCallback(async () => {
    const latestGroups = (groups ?? []) as FeatureGroupTableRow[]
    return {
      data: latestGroups,
      totalItems: latestGroups.length,
    }
  }, [groups])

  const handleRefresh = async () => {
    await mutateGroups()
  }

  //  Handle loading and error states
  if (error) return <div className="p-6 text-red-600">Failed to load feature group.</div>

  if (isLoading) return <CustomLoader text="Loading feature group..." />

  // Render UI
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Feature Groups</h1>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-[#7B1E1E] hover:bg-[#641717] cursor-pointer text-white px-4 py-2 rounded-md text-sm font-medium shadow-md transition"
        >
          <Plus size={16} /> Add Feature Group
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <DataTable<FeatureGroupTableRow>
          columns={columns}
          actions={actions}
          fetchData={fetchGroups}
          loading={isLoading}
          isPagination={true}
          allowExport
          allowGrouping
          allowRefresh
          totalItemsData={total}
          onRefresh={handleRefresh}
        />
      </div>
    </div>
  )
}
