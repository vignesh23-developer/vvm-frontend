'use client'

import { Edit3 } from 'lucide-react'
import { useCallback, useMemo } from 'react'
import { usePropertyApprovals, PropertyApproval } from '@/hooks/CustomHooks/usePropertyApproval'
import DataTable from '@/components/ui/CustomComponent/Tables/DataTable'

type PropertyApprovalTableRow = PropertyApproval & Record<string, unknown>
export default function PropertyApprovalPage() {
  const { approvals, total, error, isLoading, handleEdit } = usePropertyApprovals()

  const columns = useMemo(
    () => [
      {
        field: 'name',
        title: 'Property Category',
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
        onClick: (row: PropertyApprovalTableRow) => handleEdit(row.id),
        color: '#1e6897',
      },
    ],
    [handleEdit],
  )
  const fetchApprovals = useCallback(async () => {
    const latestApprovals = (approvals ?? []) as PropertyApprovalTableRow[]

    return {
      data: latestApprovals,
      totalItems: latestApprovals.length,
    }
  }, [approvals])

  //  Handle loading and error states
  if (error) return <div className="p-6 text-red-600">Failed to load property approvals.</div>

  if (isLoading) return <div className="p-6 text-gray-600 animate-pulse">Loading property approvals...</div>

  // Render UI
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Property Approvals</h1>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <DataTable<PropertyApprovalTableRow>
          columns={columns}
          actions={actions}
          fetchData={fetchApprovals}
          loading={isLoading}
          allowExport
          allowGrouping
          allowRefresh
        />
      </div>
    </div>
  )
}
