'use client'

import React, { useMemo, useState, useEffect } from 'react'

type Column<T> = {
  key: string
  header: React.ReactNode
  accessor?: (row: T) => any
  render?: (row: T) => React.ReactNode
  sortable?: boolean
  className?: string
  width?: string
}

type TableProps<T> = {
  columns: Column<T>[]
  data: T[]
  pageSize?: number
  enableSearch?: boolean
  enablePagination?: boolean
  enableSorting?: boolean
  enableSelection?: boolean
  enableStatusFilter?: boolean
  enableDateFilter?: boolean
  statusOptions?: string[]
  statusKey?: keyof T
  dateKey?: keyof T & string
  getRowKey?: (row: T, idx: number) => string
  onSelectionChange?: (selected: T[]) => void
}

export default function Table<T extends object>({
  columns,
  data,
  pageSize = 10,
  enableSearch = true,
  enablePagination = true,
  enableSorting = true,
  enableSelection = false,
  enableStatusFilter = false,
  enableDateFilter = false,
  statusOptions = [],
  statusKey,
  dateKey,
  getRowKey,
  onSelectionChange,
}: TableProps<T>) {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState<string>()
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [dateFilter, setDateFilter] = useState<string>('')

  const rowKey = (row: T, idx: number) =>
    getRowKey?.(row, idx) ?? `${(row as any).id ?? idx}`

  /** Filtering */
  const filtered = useMemo(() => {
    let result = data

    if (enableSearch && query.trim()) {
      const q = query.toLowerCase()
      result = result.filter(row =>
        columns.some(col => {
          const val = col.accessor?.(row) ?? (row as any)[col.key]
          return val && String(val).toLowerCase().includes(q)
        }),
      )
    }

    if (enableStatusFilter && statusFilter && statusKey) {
      result = result.filter(row => String(row[statusKey]) === statusFilter)
    }

    if (enableDateFilter && dateFilter && dateKey) {
      result = result.filter(row => {
        const val = row[dateKey]
        if (!val) return false

        const d = val instanceof Date ? val : new Date(String(val))
        if (isNaN(d.getTime())) return false

        const rowDate = d.toISOString().split('T')[0]
        return rowDate === dateFilter
      })
    }
    return result
  }, [
    data,
    query,
    statusFilter,
    dateFilter,
    columns,
    enableSearch,
    enableStatusFilter,
    enableDateFilter,
    statusKey,
    dateKey,
  ])

  /** Sorting */
  const sorted = useMemo(() => {
    if (!enableSorting || !sortBy) return filtered
    const col = columns.find(c => c.key === sortBy)
    if (!col) return filtered
    const accessor = col.accessor ?? ((r: T) => (r as any)[col.key])

    return [...filtered].sort((a, b) => {
      const va = accessor(a),
        vb = accessor(b)
      if (va == null || vb == null) return 0
      return typeof va === 'number' && typeof vb === 'number'
        ? sortDir === 'asc'
          ? va - vb
          : vb - va
        : sortDir === 'asc'
        ? String(va).localeCompare(String(vb))
        : String(vb).localeCompare(String(va))
    })
  }, [filtered, sortBy, sortDir, columns, enableSorting])

  /** Pagination */
  const total = sorted.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const paginated = useMemo(() => {
    if (!enablePagination) return sorted
    const start = (page - 1) * pageSize
    return sorted.slice(start, start + pageSize)
  }, [sorted, page, pageSize, enablePagination])

  /** Selection */
  useEffect(() => {
    if (!enableSelection || !onSelectionChange) return
    const selectedRows = data.filter((row, i) => selected[rowKey(row, i)])
    onSelectionChange(selectedRows)
  }, [selected, data, enableSelection, onSelectionChange])

  const toggleSort = (col: Column<T>) => {
    if (!enableSorting || !col.sortable) return
    if (sortBy !== col.key) {
      setSortBy(col.key)
      setSortDir('asc')
    } else {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    }
  }

  const toggleSelectAll = (checked: boolean) => {
    setSelected(
      checked
        ? Object.fromEntries(data.map((r, i) => [rowKey(r, i), true]))
        : {},
    )
  }

  return (
    <div className="w-full">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {enableSearch && (
            <input
              value={query}
              onChange={e => {
                setQuery(e.target.value)
                setPage(1)
              }}
              placeholder="Search..."
              className="px-3 py-2 border border-gray-300 rounded-lg w-full sm:w-48 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          )}

          {enableStatusFilter && statusOptions.length > 0 && (
            <select
              value={statusFilter}
              onChange={e => {
                setStatusFilter(e.target.value)
                setPage(1)
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
            >
              <option value="">All Status</option>
              {statusOptions.map(opt => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          )}

          {enableDateFilter && (
            <input
              type="date"
              value={dateFilter}
              onChange={e => {
                setDateFilter(e.target.value)
                setPage(1)
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
            />
          )}
        </div>

        <span className="text-sm text-gray-600 mt-2 sm:mt-0">
          {total} result{total !== 1 && 's'}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 hidden sm:table">
          <thead className="bg-gray-100">
            <tr>
              {enableSelection && (
                <th className="px-3 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={e => toggleSelectAll(e.target.checked)}
                    checked={
                      Object.keys(selected).length > 0 &&
                      Object.values(selected).every(Boolean)
                    }
                  />
                </th>
              )}
              {columns.map(col => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide ${
                    col.className ?? ''
                  }`}
                  style={{ width: col.width }}
                  onClick={() => toggleSort(col)}
                >
                  <div
                    className={`flex items-center gap-1 ${
                      enableSorting && col.sortable
                        ? 'cursor-pointer select-none hover:text-blue-600 transition-colors'
                        : ''
                    }`}
                  >
                    <span>{col.header}</span>
                    {enableSorting && col.sortable && sortBy === col.key && (
                      <span className="text-xs">
                        {sortDir === 'asc' ? '▲' : '▼'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100">
            {paginated.map((row, i) => {
              const key = rowKey(row, i + (page - 1) * pageSize)
              return (
                <tr key={key} className="hover:bg-gray-50 transition-colors">
                  {enableSelection && (
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        checked={!!selected[key]}
                        onChange={() =>
                          setSelected(s => ({ ...s, [key]: !s[key] }))
                        }
                      />
                    </td>
                  )}
                  {columns.map(col => (
                    <td
                      key={col.key}
                      className={`px-4 py-3 text-sm text-gray-700 ${
                        col.className ?? ''
                      }`}
                    >
                      {col.render?.(row) ??
                        String(
                          col.accessor?.(row) ?? (row as any)[col.key] ?? '',
                        )}
                    </td>
                  ))}
                </tr>
              )
            })}
            {!paginated.length && (
              <tr>
                <td
                  colSpan={columns.length + (enableSelection ? 1 : 0)}
                  className="px-3 py-6 text-sm text-gray-500 text-center"
                >
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* 📱 Mobile Card View */}
        <div className="sm:hidden divide-y divide-gray-200">
          {paginated.length ? (
            paginated.map((row, i) => {
              const key = rowKey(row, i + (page - 1) * pageSize)
              return (
                <div
                  key={key}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  {columns.map(col => (
                    <div
                      key={col.key}
                      className="flex justify-between py-1 text-sm"
                    >
                      <span className="font-medium text-gray-600">
                        {col.header}:
                      </span>
                      <span className="text-gray-800">
                        {col.render?.(row) ??
                          String(
                            col.accessor?.(row) ?? (row as any)[col.key] ?? '',
                          )}
                      </span>
                    </div>
                  ))}
                </div>
              )
            })
          ) : (
            <div className="p-4 text-sm text-gray-500 text-center">
              No results found
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {enablePagination && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-sm text-gray-700 gap-3">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              className="px-3 py-1.5 border rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              Prev
            </button>
            <button
              className="px-3 py-1.5 border rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
