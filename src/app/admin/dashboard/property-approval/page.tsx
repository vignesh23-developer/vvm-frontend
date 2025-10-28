'use client'

import { Plus, Settings, Edit3, Trash2 } from 'lucide-react'
import { useMemo } from 'react'
import Table from '@/components/ui/CustomComponent/Table/Table'
import {
  usePropertyApprovals,
  PropertyApproval,
} from '@/hooks/CustomHooks/usePropertyApproval'

export default function PropertyApprovalPage() {
  const { approvals, error, isLoading, handleEdit, mutateApprovals } =
    usePropertyApprovals()

  // ✅ Columns definition
  const columns = useMemo(
    () => [
      { key: 'name', header: 'Property Category' },
      { key: 'description', header: 'Description' },
      { key: 'sortOrder', header: 'Sort Order' },
      {
        key: 'actions',
        header: 'Actions',
        render: (row: PropertyApproval) => (
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleEdit(row.id)}
              className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 cursor-pointer transition"
              title="Edit"
            >
              <Edit3 size={16} />
            </button>
          </div>
        ),
      },
    ],
    [handleEdit],
  )

  // ✅ Handle loading and error states
  if (error)
    return (
      <div className="p-6 text-red-600">Failed to load property approvals.</div>
    )

  if (isLoading)
    return (
      <div className="p-6 text-gray-600 animate-pulse">
        Loading property approvals...
      </div>
    )

  // ✅ Render UI
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">
          Property Approvals
        </h1>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <Table<PropertyApproval> columns={columns} data={approvals} />
      </div>
    </div>
  )
}
