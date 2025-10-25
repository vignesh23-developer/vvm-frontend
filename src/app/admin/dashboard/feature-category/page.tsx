'use client'

import { Plus, Edit3, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import Table from '@/components/ui/CustomComponent/Table/Table'
import {
  useFeatureCategories,
  FeatureCategory,
} from '@/hooks/CustomHooks/useFeatureCategories'
// import IconPicker from '@/components/ui/CustomComponent/IconPicker/IconPicker'

export default function FeatureCategoryPage() {
  const { categories, error, isLoading, handleAdd, handleEdit, handleDelete } =
    useFeatureCategories()

  // const [icon, setIcon] = useState<string>('')

  const columns = useMemo(
    () => [
      { key: 'code', header: 'Code' },
      { key: 'name', header: 'Feature Category' },
      {
        key: 'actions',
        header: 'Actions',
        render: (row: FeatureCategory) => (
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleEdit(row.id)}
              className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 cursor-pointer transition"
              aria-label={`Edit ${row.name}`}
              title="Edit"
            >
              <Edit3 size={16} />
            </button>
            <button
              onClick={() => handleDelete(row.id, !row.isActive)}
              className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 cursor-pointer transition"
              aria-label={`Delete ${row.name}`}
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ),
      },
    ],
    [handleEdit, handleDelete],
  )

  if (error)
    return (
      <div className="p-6 text-red-600">Failed to load feature categories.</div>
    )
  if (isLoading)
    return (
      <div className="p-6 text-gray-600 animate-pulse">
        Loading feature categories...
      </div>
    )

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <span>Dashboard</span>
        <span className="text-gray-400">›</span>
        <span className="font-medium text-gray-700">
          Feature Category Master
        </span>
      </nav>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">
          Feature Categories
        </h1>

        {/* <div className="p-6">
          <h1 className="text-lg font-semibold mb-4">
            Lucide Icon Picker Demo
          </h1>
          <IconPicker value={icon} onChange={setIcon} />
          {icon && <p className="mt-3 text-gray-700">Selected Icon: {icon}</p>}
        </div> */}
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-[#7B1E1E] hover:bg-[#641717] cursor-pointer text-white px-4 py-2 rounded-md text-sm font-medium shadow-md transition"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <Table<FeatureCategory> columns={columns} data={categories} />
      </div>
    </div>
  )
}
