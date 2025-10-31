import { useMemo } from 'react'
import { Search } from 'lucide-react'

type FilterableColumn = {
  field: string
  title: string
  filterable?: boolean
  visible?: boolean
}

interface AdvancedFiltersProps {
  columns: FilterableColumn[]
  filters: Record<string, string>
  handleFilterChange: (field: string, value: string) => void
  clearFilters: () => void
}

export default function AdvancedFilters({
  columns,
  filters,
  handleFilterChange,
  clearFilters,
}: AdvancedFiltersProps) {
  const filterableColumns = useMemo(
    () => columns.filter(col => col.filterable && col.visible !== false),
    [columns],
  )

  const hasActiveFilters = useMemo(
    () => filterableColumns.some(col => Boolean(filters[col.field])),
    [filterableColumns, filters],
  )

  if (!filterableColumns.length) {
    return null
  }

  return (
    <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Advanced Filters</h3>
        <button
          type="button"
          onClick={clearFilters}
          disabled={!hasActiveFilters}
          className="text-xs font-medium text-blue-600 transition hover:text-blue-800 disabled:cursor-not-allowed disabled:text-gray-400"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filterableColumns.map(col => (
          <label
            key={col.field}
            className="flex items-center rounded-md border border-gray-300 bg-white"
          >
            <span className="pl-2 text-gray-400">
              <Search size={14} aria-hidden />
            </span>
            <input
              type="text"
              value={filters[col.field] ?? ''}
              onChange={event =>
                handleFilterChange(col.field, event.target.value)
              }
              placeholder={`Filter ${col.title}`}
              className="w-full px-2 py-1 text-sm focus:outline-none"
              aria-label={`Filter by ${col.title}`}
            />
          </label>
        ))}
      </div>
    </div>
  )
}
