'use client'

import { Plus, Settings, Edit3, Trash2 } from 'lucide-react'
import { useMemo } from 'react'
import Table from '@/components/ui/CustomComponent/Table/Table'
import {
  usePropertyCategories,
  PropertyCategory,
} from '@/hooks/CustomHooks/usePropertyCategories'

export default function PropertyCategoryPage() {
  const {
    categories,
    error,
    isLoading,
    handleAdd,
    handleCategoryMapping,
    handleEdit,
    handleDelete,
    mutateCategories, // ✅ now included
  } = usePropertyCategories()

  // ✅ Columns definition
  const columns = useMemo(
    () => [
      { key: 'name', header: 'Property Category' },
      { key: 'description', header: 'Description' },
      { key: 'sortOrder', header: 'Sort Order' },
      {
        key: 'actions',
        header: 'Actions',
        render: (row: PropertyCategory) => (
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleCategoryMapping(row.id)}
              className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 cursor-pointer transition"
              title="Category Mappings"
            >
              <Settings size={16} />
            </button>
            <button
              onClick={() => handleEdit(row.id)}
              className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 cursor-pointer transition"
              title="Edit"
            >
              <Edit3 size={16} />
            </button>
            <button
              onClick={() => handleDelete(row.id, !row.isActive)}
              className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 cursor-pointer transition"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ),
      },
    ],
    [handleEdit, handleDelete, handleCategoryMapping], // ✅ added missing dependency
  )

  // ✅ Handle loading and error states
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

  // ✅ Render UI
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <span>Dashboard</span>
        <span className="text-gray-400">›</span>
        <span className="font-medium text-gray-700">
          Property Category Master
        </span>
      </nav>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">
          Property Categories
        </h1>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-[#7B1E1E] hover:bg-[#641717] cursor-pointer text-white px-4 py-2 rounded-md text-sm font-medium shadow-md transition"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <Table<PropertyCategory> columns={columns} data={categories} />
      </div>
    </div>
  )
}
