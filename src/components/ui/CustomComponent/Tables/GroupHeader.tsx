import { ChevronDown, ChevronRight } from 'lucide-react'

type Column = {
  field: string
  title?: string
}

type GroupSummary<TItem> = {
  displayValue: string
  items: TItem[]
}

interface GroupHeaderProps<TItem = unknown> {
  groupKey: string | number
  group: GroupSummary<TItem>
  isExpanded: boolean
  toggleGroup: (key: string | number) => void
  visibleColumns: Column[]
  shouldShowActionsColumn: boolean
  groupByField: string
  columns: Column[]
}

export default function GroupHeader<TItem = unknown>({
  groupKey,
  group,
  isExpanded,
  toggleGroup,
  visibleColumns,
  shouldShowActionsColumn,
  groupByField,
  columns,
}: GroupHeaderProps<TItem>) {
  const groupColumn = columns.find(column => column.field === groupByField)
  const colSpan = visibleColumns.length + (shouldShowActionsColumn ? 1 : 0) + 1
  const itemCount = group.items.length

  return (
    <tr
      className="cursor-pointer bg-gray-100"
      onClick={() => toggleGroup(groupKey)}
    >
      <td
        colSpan={colSpan}
        className="px-6 py-3 text-sm font-medium text-gray-800"
      >
        <div className="flex items-center">
          {isExpanded ? (
            <ChevronDown size={16} className="mr-2" />
          ) : (
            <ChevronRight size={16} className="mr-2" />
          )}
          <span>{groupColumn?.title ?? groupByField}:</span>
          <span className="ml-1 font-semibold">{group.displayValue}</span>
          <span className="ml-2 text-xs text-gray-500">
            ({itemCount} items)
          </span>
        </div>
      </td>
    </tr>
  )
}
