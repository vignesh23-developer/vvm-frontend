'use client'

import { Plus, Settings, Edit3, Trash2 } from 'lucide-react'
import { use, useMemo } from 'react'
import Table from '@/components/ui/CustomComponent/Table/Table'
import {
  usePropertyReports,
  PropertyReports,
} from '@/hooks/CustomHooks/usePropertyReport'
import Breadcrumbs from '@/components/ui/CustomComponent/Breadcrumbs/Breadcrumbs'
import { PropertyCategory } from '../category-mappings/add/[id]/page'

export default function PropertyReportsPage() {
  const {
    reports,
    error,
    isLoading,
    handleAdd,
    handleEdit,
    mutateReports, // ✅ now included
  } = usePropertyReports()

  // ✅ Columns definition
  const columns = useMemo(
    () => [
      { key: 'name', header: 'Property Report' },
      { key: 'description', header: 'Description' },
      { key: 'sortOrder', header: 'Sort Order' },
      {
        key: 'actions',
        header: 'Actions',
        render: (row: PropertyReports) => (
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
      <div className="p-6 text-red-600">Failed to load property reports.</div>
    )

  if (isLoading)
    return (
      <div className="p-6 text-gray-600 animate-pulse">
        Loading property reports...
      </div>
    )

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">
          Property Reports
        </h1>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-[#7B1E1E] hover:bg-[#641717] cursor-pointer text-white px-4 py-2 rounded-md text-sm font-medium shadow-md transition"
        >
          <Plus size={16} /> Add Reports
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <Table<PropertyReports> columns={columns} data={reports} />
      </div>
    </div>
  )
}
