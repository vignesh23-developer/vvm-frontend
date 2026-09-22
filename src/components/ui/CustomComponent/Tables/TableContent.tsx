import type { ComponentType, ReactNode } from 'react'
import { Fragment } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import DataRow from './DataRow'
import GroupHeader from './GroupHeader'

type RowData = Record<string, unknown>

type TableColumn<T extends RowData = RowData> = {
  field: string
  title: string
  sortable?: boolean
  groupable?: boolean
  visible?: boolean
}

type TableAction<T extends RowData = RowData> = {
  label?: string
  onClick: (row: T) => void
  icon?: ComponentType<{ size?: number; className?: string }>
  className?: string
  color?: string
  title?: string
  disabled?: boolean | ((row: T) => boolean)
}

type GroupedItems<T extends RowData = RowData> = {
  displayValue: string
  items: T[]
}

type TableContentProps<T extends RowData = RowData> = {
  visibleColumns: TableColumn<T>[]
  groupByField?: string
  shouldShowActionsColumn: boolean
  isLoading: boolean
  error?: string
  data: T[]
  groupedData?: Record<string, GroupedItems<T>>
  expandedGroups: Record<string, boolean>
  toggleGroup: (groupKey: string) => void
  columns: TableColumn<T>[]
  selectedRow?: string | number | null
  handleRowClick?: (row: T) => void
  getVisibleActions: (row: T) => TableAction<T>[]
  colors: { primary: Record<number, string>; accent: string }
  sortField?: string
  sortDirection?: 'asc' | 'desc'
  handleSort?: (field: string) => void
}

export default function TableContent<T extends RowData = RowData>({
  visibleColumns,
  groupByField,
  shouldShowActionsColumn,
  isLoading,
  error,
  data,
  groupedData,
  expandedGroups,
  toggleGroup,
  columns,
  selectedRow,
  handleRowClick,
  getVisibleActions,
  colors,
  sortField,
  sortDirection,
  handleSort,
}: TableContentProps<T>) {
  const columnSpan = visibleColumns.length + (shouldShowActionsColumn ? 1 : 0) + (groupByField ? 1 : 0)

  const safeHandleRowClick = handleRowClick ?? (() => undefined)

  const renderSortIndicator = (field: string): ReactNode => {
    if (!sortField || field !== sortField) return null
    return sortDirection === 'asc' ? <ChevronUp size={16} className="ml-1 inline" /> : <ChevronDown size={16} className="ml-1 inline" />
  }

  const renderDataRows = (rows: T[], isGrouped: boolean, groupKey?: string) =>
    rows.map((row, rowIndex) => {
      const rowId = (row as { id?: string | number }).id
      const key = typeof rowId === 'string' || typeof rowId === 'number' ? rowId : `${groupKey ?? 'row'}-${rowIndex}`

      return (
        <DataRow<T>
          key={key}
          row={row}
          rowIndex={rowIndex}
          visibleColumns={visibleColumns}
          shouldShowActionsColumn={shouldShowActionsColumn}
          selectedRow={selectedRow}
          handleRowClick={safeHandleRowClick}
          getVisibleActions={getVisibleActions}
          colors={colors}
          isGrouped={isGrouped}
          groupKey={groupKey}
        />
      )
    })

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50">
            {groupByField && (
              <th className="w-10 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.primary[800] }} />
            )}

            {visibleColumns.map(column => (
              <th
                key={column.field}
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: colors.primary[800] }}
              >
                <button
                  type="button"
                  className={`flex items-center gap-1 ${column.sortable ? 'hover:text-blue-600' : 'cursor-default'}`}
                  onClick={() => (column.sortable && handleSort ? handleSort(column.field) : undefined)}
                  disabled={!column.sortable || !handleSort}
                >
                  <span>{column.title}</span>
                  {column.sortable && renderSortIndicator(column.field)}
                </button>
              </th>
            ))}

            {shouldShowActionsColumn && (
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: colors.primary[800] }}>
                Actions
              </th>
            )}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 bg-white">
          {isLoading ? (
            <tr>
              <td colSpan={columnSpan} className="px-6 py-4 text-center text-sm text-gray-500">
                <div className="flex items-center justify-center space-x-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-b-2" style={{ borderColor: colors.accent }} />
                  <span>Loading...</span>
                </div>
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={columnSpan} className="px-6 py-4 text-center text-sm text-red-500">
                {error}
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columnSpan} className="px-6 py-4 text-center text-sm text-gray-500">
                No data available
              </td>
            </tr>
          ) : !groupByField ? (
            renderDataRows(data, false)
          ) : (
            Object.entries(groupedData ?? {}).map(([groupKey, group]) => {
              const isExpanded = expandedGroups[groupKey]

              return (
                <Fragment key={groupKey}>
                  <GroupHeader
                    groupKey={groupKey}
                    group={group}
                    isExpanded={isExpanded}
                    toggleGroup={key => toggleGroup(String(key))}
                    visibleColumns={visibleColumns}
                    shouldShowActionsColumn={shouldShowActionsColumn}
                    groupByField={groupByField}
                    columns={columns}
                  />

                  {isExpanded && renderDataRows(group.items, true, groupKey)}
                </Fragment>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
