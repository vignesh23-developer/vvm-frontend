import type { ComponentType, ReactNode } from 'react'

type RowData = Record<string, unknown>

type Column<T extends RowData = RowData> = {
  field: string
  render?: (value: unknown, row: T) => ReactNode
}

type Action<T extends RowData = RowData> = {
  label?: string
  onClick: (row: T) => void
  icon?: ComponentType<{ size?: number; className?: string }>
  className?: string
  color?: string
  title?: string
  disabled?: boolean | ((row: T) => boolean)
}

interface DataRowProps<T extends RowData = RowData> {
  row: T
  rowIndex: number
  visibleColumns: Column<T>[]
  shouldShowActionsColumn: boolean
  selectedRow?: string | number | null
  handleRowClick: (row: T) => void
  getVisibleActions: (row: T) => Action<T>[]
  colors: { accent: string }
  isGrouped?: boolean
  groupKey?: string
}

export default function DataRow<T extends RowData = RowData>({
  row,
  rowIndex,
  visibleColumns,
  shouldShowActionsColumn,
  selectedRow,
  handleRowClick,
  getVisibleActions,
  colors,
  isGrouped = false,
  groupKey,
}: DataRowProps<T>) {
  const rowIdentifier = (row as RowData).id ?? rowIndex
  const isSelected = selectedRow === rowIdentifier
  const zebraBackground = isGrouped ? 'bg-white' : rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'

  const rowActions = getVisibleActions(row)
  const hasActions = rowActions.length > 0

  return (
    <tr className={`cursor-pointer hover:bg-blue-50 ${isSelected ? 'bg-blue-100' : zebraBackground}`} onClick={() => handleRowClick(row)}>
      {isGrouped && <td className="w-10 py-4 pl-9 pr-3" />}

      {visibleColumns.map(column => {
        const cellKey = `${isGrouped ? `${groupKey}-` : ''}${rowIndex}-${column.field}`
        const cellValue = row[column.field]
        const rendered = column.render ? column.render(cellValue, row) : cellValue
        const content = (rendered ?? '') as ReactNode

        return (
          <td key={cellKey} className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
            {content}
          </td>
        )
      })}

      {shouldShowActionsColumn && (
        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium" onClick={event => event.stopPropagation()}>
          {hasActions && (
            <div className="flex justify-end space-x-2">
              {rowActions.map((action, index) => {
                const isDisabled = typeof action.disabled === 'function' ? action.disabled(row) : Boolean(action.disabled)

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={event => {
                      event.stopPropagation()
                      if (!isDisabled) {
                        action.onClick(row)
                      }
                    }}
                    className={`inline-flex items-center rounded-md border px-3 py-1 text-sm font-medium ${
                      action.className ?? 'text-white shadow-sm hover:bg-opacity-90'
                    }`}
                    title={action.title ?? action.label}
                    style={{
                      backgroundColor: action.color ?? colors.accent,
                      opacity: isDisabled ? 0.5 : 1,
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                    }}
                    disabled={isDisabled}
                  >
                    {action.icon && <action.icon size={16} className="mr-1" />}
                    {action.label}
                  </button>
                )
              })}
            </div>
          )}
        </td>
      )}
    </tr>
  )
}
