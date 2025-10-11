'use client'

import { Trash2, Edit3 } from 'lucide-react'
import Table from '../../../../components/ui/CustomComponent/Table/Table'

interface PropertyCategory {
  id: number
  name: string
  status: string
  created: string
  edited: string
}

// Define a type for your table columns
interface TableColumn<T> {
  key: keyof T | string
  header: string
  render?: (row: T) => React.ReactNode
}

export default function ReferralManagementPage() {
  const data: PropertyCategory[] = [
    {
      id: 1,
      name: 'Land',
      status: 'Active',
      created: '21.03.2021',
      edited: '14.07.2021',
    },
    {
      id: 2,
      name: 'Flat',
      status: 'In-Active',
      created: '21.03.2021',
      edited: '14.07.2021',
    },
    {
      id: 3,
      name: 'InvHouse',
      status: 'Active',
      created: '21.03.2021',
      edited: '14.07.2021',
    },
  ]

  const columns: TableColumn<PropertyCategory>[] = [
    { key: 'name', header: 'Property Category' },
    {
      key: 'status',
      header: 'Status',
      render: row => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.status === 'Active'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-600'
          }`}
        >
          {row.status}
        </span>
      ),
    },
    { key: 'created', header: 'Created' },
    { key: 'edited', header: 'Edited' },
    {
      key: 'actions',
      header: 'Actions',
      render: row => (
        <div className="flex items-center gap-3">
          <button className="text-gray-500 hover:text-red-500 transition">
            <Trash2 size={16} />
          </button>
          <button className="text-gray-500 hover:text-blue-500 transition">
            <Edit3 size={16} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4 flex items-center gap-2">
        <span>Dashboard</span>
        <span className="text-gray-400">›</span>
        <span className="font-medium text-gray-700">Role</span>
      </div>

      {/* Header Tabs + Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <button className="px-4 py-2 rounded-md bg-orange-100 border border-orange-300 text-orange-700 text-sm font-medium">
          All
        </button>
        <button className="px-4 py-2 rounded-md bg-white border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-100">
          Projection
        </button>
        <button className="px-4 py-2 rounded-md bg-white border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-100">
          Comparable
        </button>
        <button className="px-4 py-2 rounded-md bg-white border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-100">
          Merger
        </button>

        <select className="ml-auto border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-600 focus:outline-none">
          <option>All industries</option>
        </select>

        <div className="flex items-center border border-gray-200 rounded-md px-3 py-2 bg-white text-sm text-gray-600">
          Created
        </div>

        <button className="p-2 border border-gray-200 rounded-md bg-white">
          🔍
        </button>

        <button className="ml-2 bg-orange-100 hover:bg-orange-200 text-orange-700 px-4 py-2 rounded-md text-sm font-medium border border-orange-200 transition">
          + Add Role
        </button>
      </div>

      {/* Table */}
      <Table columns={columns} data={data} />
    </div>
  )
}
