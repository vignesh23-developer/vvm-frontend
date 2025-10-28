import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react'
import {
  RefreshCw,
  Columns,
  Filter,
  Menu,
  Eye,
  EyeOff,
  X,
  FileText,
  Download,
  Layers,
} from 'lucide-react'

type TableColumn = {
  field: string
  title: string
  visible?: boolean
  groupable?: boolean
}

interface TableHeaderProps {
  tableName: string
  filtersActive: boolean
  clearFilters: () => void
  allowRefresh?: boolean
  handleRefresh?: () => void
  allowColumnSelection?: boolean
  showColumnMenu: boolean
  setShowColumnMenu: Dispatch<SetStateAction<boolean>>
  columns: TableColumn[]
  toggleColumnVisibility: (field: string) => void
  resetColumnVisibility: () => void
  setShowAdvancedFilters: Dispatch<SetStateAction<boolean>>
  showAdvancedFilters: boolean
  allowExport?: boolean
  showTableOptions: boolean
  setShowTableOptions: Dispatch<SetStateAction<boolean>>
  handleExportCSV: () => void
  handleExportExcel: () => void
  handleExportPDF: () => void
  allowGrouping?: boolean
  groupByField: string | null
  setGroupBy: (field: string | null) => void
}

export default function TableHeader({
  tableName,
  filtersActive,
  clearFilters,
  allowRefresh,
  handleRefresh,
  allowColumnSelection,
  showColumnMenu,
  setShowColumnMenu,
  columns,
  toggleColumnVisibility,
  resetColumnVisibility,
  setShowAdvancedFilters,
  showAdvancedFilters,
  allowExport,
  showTableOptions,
  setShowTableOptions,
  handleExportCSV,
  handleExportExcel,
  handleExportPDF,
  allowGrouping,
  groupByField,
  setGroupBy,
}: TableHeaderProps) {
  const [showGroupMenu, setShowGroupMenu] = useState(false)

  const tableOptionsRef = useRef<HTMLDivElement | null>(null)
  const columnMenuRef = useRef<HTMLDivElement | null>(null)
  const groupMenuRef = useRef<HTMLDivElement | null>(null)

  const groupableColumns = useMemo(
    () =>
      columns.filter(
        column => column.visible !== false && column.groupable !== false,
      ),
    [columns],
  )

  const selectedGroupLabel = useMemo(() => {
    if (!groupByField) return null
    const match = columns.find(column => column.field === groupByField)
    return match?.title ?? groupByField
  }, [columns, groupByField])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return

      if (
        showTableOptions &&
        tableOptionsRef.current &&
        !tableOptionsRef.current.contains(target)
      ) {
        setShowTableOptions(false)
      }

      if (
        showColumnMenu &&
        columnMenuRef.current &&
        !columnMenuRef.current.contains(target)
      ) {
        setShowColumnMenu(false)
      }

      if (
        showGroupMenu &&
        groupMenuRef.current &&
        !groupMenuRef.current.contains(target)
      ) {
        setShowGroupMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [
    showTableOptions,
    showColumnMenu,
    showGroupMenu,
    setShowTableOptions,
    setShowColumnMenu,
    setShowGroupMenu,
  ])

  const toggleGrouping = (field: string) => {
    setGroupBy(field === groupByField ? null : field)
    setShowGroupMenu(false)
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 bg-gray-50 px-4 py-3">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-medium text-gray-800">{tableName}</h2>

        {filtersActive && (
          <button
            type="button"
            onClick={clearFilters}
            className="flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800"
          >
            <span>Filters Active</span>
            <X size={14} className="ml-1" />
          </button>
        )}

        {groupByField && (
          <div className="flex items-center rounded-full bg-indigo-100 px-2 py-1 text-xs text-indigo-800">
            <span>Grouped by: {selectedGroupLabel}</span>
            <button
              type="button"
              className="ml-1"
              onClick={() => setGroupBy(null)}
              aria-label="Clear grouping"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {allowRefresh && (
          <button
            type="button"
            onClick={() => {
              void handleRefresh?.()
            }}
            className="rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            title="Refresh data"
          >
            <RefreshCw size={18} />
          </button>
        )}

        {allowColumnSelection && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowColumnMenu(prev => !prev)}
              className="rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              title="Select columns"
              aria-expanded={showColumnMenu}
            >
              <Columns size={18} />
            </button>

            {showColumnMenu && (
              <div
                ref={columnMenuRef}
                className="absolute right-0 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
              >
                <div className="border-b border-gray-200 px-4 py-2 text-sm font-medium text-gray-700">
                  Visible Columns
                </div>
                <div className="max-h-60 overflow-y-auto py-1">
                  {columns.map(column => {
                    const isHidden = column.visible === false
                    return (
                      <button
                        key={column.field}
                        type="button"
                        onClick={() => toggleColumnVisibility(column.field)}
                        className="flex w-full items-center justify-between px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <span>{column.title}</span>
                        <span
                          className={
                            isHidden ? 'text-gray-400' : 'text-blue-600'
                          }
                        >
                          {isHidden ? <EyeOff size={16} /> : <Eye size={16} />}
                        </span>
                      </button>
                    )
                  })}
                </div>
                <div className="border-t border-gray-200 py-1">
                  <button
                    type="button"
                    onClick={resetColumnVisibility}
                    className="block w-full px-4 py-2 text-left text-sm text-blue-600 hover:bg-gray-100"
                  >
                    Reset to Default
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {allowGrouping && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowGroupMenu(prev => !prev)}
              className={`rounded-md p-2 ${
                groupByField ? 'text-indigo-600' : 'text-gray-600'
              } hover:bg-gray-100 hover:text-gray-900`}
              title="Group data"
              aria-expanded={showGroupMenu}
            >
              <Layers size={18} />
            </button>

            {showGroupMenu && (
              <div
                ref={groupMenuRef}
                className="absolute right-0 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
              >
                <div className="border-b border-gray-200 px-4 py-2 text-sm font-medium text-gray-700">
                  Group By
                </div>
                <div className="max-h-60 overflow-y-auto py-1">
                  {groupableColumns.map(column => (
                    <button
                      key={column.field}
                      type="button"
                      onClick={() => toggleGrouping(column.field)}
                      className="flex w-full items-center justify-between px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <span>{column.title}</span>
                      <span
                        className={
                          groupByField === column.field
                            ? 'text-indigo-600'
                            : 'text-gray-500'
                        }
                      >
                        <Layers size={16} />
                      </span>
                    </button>
                  ))}
                </div>
                {groupByField && (
                  <div className="border-t border-gray-200 py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setGroupBy(null)
                        setShowGroupMenu(false)
                      }}
                      className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                    >
                      Clear Grouping
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowAdvancedFilters(prev => !prev)}
            className={`rounded-md p-2 ${
              filtersActive ? 'text-blue-600' : 'text-gray-600'
            } hover:bg-gray-100 hover:text-gray-900`}
            aria-expanded={showAdvancedFilters}
            title="Advanced filters"
          >
            <Filter size={18} />
          </button>
        </div>

        {allowExport && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowTableOptions(prev => !prev)}
              className="rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              title="Export options"
              aria-expanded={showTableOptions}
            >
              <Menu size={18} />
            </button>

            {showTableOptions && (
              <div
                ref={tableOptionsRef}
                className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
              >
                <div className="border-b border-gray-200 px-4 py-2 text-sm font-medium text-gray-700">
                  Export Options
                </div>

                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FileText size={16} className="mr-2" />
                  Export as CSV
                </button>

                <button
                  type="button"
                  onClick={handleExportExcel}
                  className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Download size={16} className="mr-2" />
                  Export as Excel
                </button>

                <button
                  type="button"
                  onClick={handleExportPDF}
                  className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FileText size={16} className="mr-2" />
                  Export as PDF
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
