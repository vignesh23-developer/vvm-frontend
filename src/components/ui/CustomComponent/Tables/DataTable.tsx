// DataTable.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import * as XLSX from 'xlsx'
import TableHeader from './TableHeader'
import AdvancedFilters from './AdvancedFilters'
import TableContent from './TableContent'
import Pagination from './Pagination'

interface Html2PdfWorker {
  from: (element: HTMLElement) => Html2PdfWorker
  set: (options: Html2PdfOptions) => Html2PdfWorker
  save: () => Promise<void>
}

type Html2PdfFn = (options?: Partial<Html2PdfOptions>) => Html2PdfWorker

declare global {
  interface Window {
    html2pdf?: Html2PdfFn
  }
}

type RowData = Record<string, unknown>

interface Column<T extends RowData = RowData> {
  field: string
  title: string
  visible?: boolean
  sortable?: boolean
  groupable?: boolean
  render?: (value: unknown, item: T) => React.ReactNode
}

interface FetchResult<T extends RowData = RowData> {
  data: T[]
  totalItems?: number
}

interface DataTableAction<T extends RowData = RowData> {
  label?: string
  onClick: (row: T) => void
  icon?: React.ComponentType<{ size?: number; className?: string }>
  className?: string
  color?: string
  title?: string
  disabled?: boolean | ((row: T) => boolean)
  isVisible?: boolean | ((row: T) => boolean)
}

interface SortConfig {
  field?: string
  direction?: 'asc' | 'desc'
}

interface DataTableColors {
  primary: Record<number, string>
  secondary: Record<number, string>
  accent: string
}

interface DataTableProps<T extends RowData = RowData> {
  columns: Column<T>[]
  fetchData: () => Promise<FetchResult<T>>
  actions?: DataTableAction<T>[]
  loading?: boolean
  initialPage?: number
  totalItemsData?: number
  totalPageData?: number
  setPage?: (page: number) => void
  setCurrentPageSize?: (size: number) => void
  pageSize?: number
  pageSizeOptions?: number[]
  onError?: (error: Error) => void
  onRowSelect?: (row: T) => void
  tableName?: string
  allowExport?: boolean
  allowColumnSelection?: boolean
  allowGrouping?: boolean
  allowRefresh?: boolean
  isPagination?: boolean
  isFilter?: boolean
  isHeader?: boolean
  defaultVisibleColumns?: string[]
  initialSort?: SortConfig
  initialFilters?: Record<string, string>
  colors?: DataTableColors
  onRefresh?: () => Promise<void> | void
}

// Utility helpers for exporting data
type ExportColumn = Column<any>
type ExportRow = RowData

const exportToCSV = (data: ExportRow[], columns: ExportColumn[], filename: string = 'export.csv'): void => {
  // Only include visible columns
  const visibleColumns = columns.filter(col => col.visible !== false)

  // Create headers
  const headers: string[] = visibleColumns.map(col => col.title)

  // Create rows
  const rows: string[][] = data.map(item =>
    visibleColumns.map(col => {
      const value: any = item[col.field]
      // Handle special values like objects, null, etc.
      if (value === null || value === undefined) return ''
      if (typeof value === 'object') return JSON.stringify(value)
      return String(value).replace(/"/g, '""') // Escape quotes
    }),
  )

  // Combine headers and rows
  const csvContent: string = [headers.join(','), ...rows.map(row => row.join(','))].join('\n')

  // Create download link
  const blob: Blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url: string = URL.createObjectURL(blob)
  const link: HTMLAnchorElement = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const exportToExcel = (data: ExportRow[], columns: ExportColumn[], filename: string = 'export.xlsx'): void => {
  // Only include visible columns
  const visibleColumns = columns.filter(col => col.visible !== false)

  // Transform data to the format expected by xlsx
  const excelData = data.map(item => {
    const rowData: Record<string, string> = {}
    visibleColumns.forEach(col => {
      const cellValue = item[col.field]

      // Get rendered value if render function exists
      if (col.render && cellValue !== undefined && cellValue !== null) {
        // Try to extract text content from rendered value
        const renderedValue = col.render(cellValue, item)
        if (typeof renderedValue === 'string' || typeof renderedValue === 'number') {
          rowData[col.title] = String(renderedValue)
        } else {
          // For complex rendered components, fall back to cell value
          rowData[col.title] = cellValue != null ? String(cellValue) : ''
        }
      } else {
        rowData[col.title] = cellValue != null ? String(cellValue) : ''
      }
    })
    return rowData
  })

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(excelData)

  // Create workbook
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data')

  // Generate Excel file and trigger download
  XLSX.writeFile(workbook, filename)
}

interface Html2PdfOptions {
  margin: number
  filename: string
  image: {
    type: string
    quality: number
  }
  html2canvas: {
    scale: number
  }
  jsPDF: {
    unit: string
    format: string
    orientation: string
  }
}

const exportToPDF = async (data: ExportRow[], columns: ExportColumn[], filename: string = 'export.pdf'): Promise<void> => {
  // Only include visible columns
  const visibleColumns = columns.filter(col => col.visible !== false)

  // Create a temporary div to hold our table
  const element: HTMLDivElement = document.createElement('div')
  element.style.position = 'fixed'
  element.style.left = '-9999px'
  element.style.top = '0'
  element.style.zIndex = '-10'
  element.style.pointerEvents = 'none'
  element.style.backgroundColor = 'white'
  element.style.color = 'black'
  element.style.fontFamily = 'Arial, sans-serif'
  element.style.fontSize = '12px'
  element.style.width = '800px'
  element.style.minHeight = '100px'

  // Create HTML table
  const table: HTMLTableElement = document.createElement('table')
  table.style.width = '100%'
  table.style.borderCollapse = 'collapse'
  table.style.fontSize = '12px'

  // Create table header
  const thead: HTMLTableSectionElement = document.createElement('thead')
  const headerRow: HTMLTableRowElement = document.createElement('tr')
  visibleColumns.forEach(col => {
    const th: HTMLTableCellElement = document.createElement('th')
    th.textContent = col.title
    th.style.border = '1px solid #ddd'
    th.style.padding = '8px'
    th.style.backgroundColor = '#f5f5f5'
    th.style.fontWeight = 'bold'
    headerRow.appendChild(th)
  })
  thead.appendChild(headerRow)
  table.appendChild(thead)

  // Create table body
  const tbody: HTMLTableSectionElement = document.createElement('tbody')
  data.forEach(item => {
    const row: HTMLTableRowElement = document.createElement('tr')
    visibleColumns.forEach(col => {
      const td: HTMLTableCellElement = document.createElement('td')
      const value = item[col.field]

      // Get rendered value if render function exists
      if (col.render && value !== undefined && value !== null) {
        const renderedValue = col.render(value, item)
        if (typeof renderedValue === 'string' || typeof renderedValue === 'number') {
          td.textContent = String(renderedValue)
        } else {
          td.textContent = value != null ? String(value) : ''
        }
      } else {
        td.textContent = value != null ? String(value) : ''
      }

      td.style.border = '1px solid #ddd'
      td.style.padding = '8px'
      row.appendChild(td)
    })
    tbody.appendChild(row)
  })
  table.appendChild(tbody)

  // Add title
  const title: HTMLHeadingElement = document.createElement('h2')
  title.textContent = 'Data Export'
  title.style.marginBottom = '20px'
  title.style.textAlign = 'center'

  element.appendChild(title)
  element.appendChild(table)

  document.body.appendChild(element)

  // Wait for rendering
  await new Promise(resolve => setTimeout(resolve, 1500))

  try {
    // Load libraries if not already loaded
    await loadLibraries()

    const html2canvas = (window as any).html2canvas
    const pdf = new (window as any).jspdf.jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    if (!html2canvas || !pdf) {
      throw new Error('Required libraries not available. Ensure html2canvas and jsPDF are loaded correctly.')
    }

    // Convert element to canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      allowTaint: true,
      useCORS: true,
      backgroundColor: 'white',
      width: 800,
      height: element.scrollHeight,
      onclone: (clonedDoc: Document) => {
        // Remove external stylesheets but keep inline styles
        const stylesheets = clonedDoc.querySelectorAll('link[rel="stylesheet"]')
        stylesheets.forEach((link: any) => {
          link.remove()
        })

        // Remove problematic CSS custom properties and color functions
        const allElements = clonedDoc.querySelectorAll('*')
        allElements.forEach((el: any) => {
          if (el.style) {
            const cssText = el.style.cssText

            // Remove any CSS containing lab(), lch(), or other unsupported color functions
            if (cssText.includes('lab(') || cssText.includes('lch(') || cssText.includes('color(')) {
              el.style.cssText = cssText
                .replace(/lab\([^)]*\)/g, '')
                .replace(/lch\([^)]*\)/g, '')
                .replace(/color\([^)]*\)/g, '')
            }
          }
        })
      },
    })

    // Calculate PDF dimensions
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = pdfWidth - 20 // 10mm margin on each side
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    const pageContentHeight = pdfHeight - 20

    // Add image to PDF with pagination achieved via offsets
    const imgData = canvas.toDataURL('image/jpeg', 0.95)
    let heightLeft = imgHeight - pageContentHeight
    let position = 10

    pdf.addImage(imgData, 'JPEG', 10, position, imgWidth, imgHeight)

    while (heightLeft > 0) {
      position = 10 - (imgHeight - heightLeft)
      pdf.addPage()
      pdf.addImage(imgData, 'JPEG', 10, position, imgWidth, imgHeight)
      heightLeft -= pageContentHeight
    }

    pdf.save(filename)
  } catch (error) {
    console.error('Failed to export PDF:', error)
    throw error instanceof Error ? error : new Error('Failed to export PDF. Please try again.')
  } finally {
    document.body.removeChild(element)
  }
}

const loadLibraries = async (): Promise<void> => {
  if (typeof window === 'undefined') {
    throw new Error('Libraries can only be loaded in the browser')
  }

  if ((window as any).html2canvas && (window as any).jspdf) {
    return
  }

  const loadScript = (src: string, check: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if ((window as any)[check]) {
        resolve()
        return
      }

      const script = document.createElement('script')
      script.src = src
      script.async = true
      script.onload = () => resolve()
      script.onerror = () => reject(new Error(`Failed to load ${check}`))
      document.head.appendChild(script)
    })
  }

  try {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js', 'html2canvas')
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', 'jspdf')
  } catch (error) {
    console.error('Failed to load libraries:', error)
    throw error
  }
}

const defaultColors: DataTableColors = {
  primary: {
    800: '#1e293b',
    700: '#334155',
    600: '#475569',
    500: '#64748b',
  },
  secondary: {
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
  },
  accent: '#3981b9',
}

const DataTable = <T extends RowData = RowData>({
  columns: initialColumns,
  fetchData,
  actions = [],
  loading: externalLoading = true,
  initialPage = 1,
  totalItemsData,
  totalPageData,
  pageSize = 10,
  pageSizeOptions = [5, 10, 25, 50, 100],
  onError,
  onRowSelect,
  setPage: parentSetPage,
  setCurrentPageSize: parentSetCurrentPageSize,
  tableName = '',
  allowExport = true,
  allowColumnSelection = true,
  allowGrouping = true,
  allowRefresh = true,
  isPagination = true,
  isFilter = true,
  isHeader = true,
  defaultVisibleColumns = [],
  initialSort = { field: '', direction: 'asc' },
  initialFilters = {},
  colors = defaultColors,
  onRefresh,
}: DataTableProps<T>) => {
  // State for columns configuration
  const [columns, setColumns] = useState<Column<T>[]>(() => {
    if (defaultVisibleColumns.length > 0) {
      return initialColumns.map(col => ({
        ...col,
        visible: defaultVisibleColumns.includes(col.field),
      }))
    }

    return initialColumns.map(col => ({
      ...col,
      visible: col.visible !== false,
    }))
  })

  // State for the table
  const [data, setData] = useState<T[]>([])
  const [allData, setAllData] = useState<T[]>([])
  const [displayData, setDisplayData] = useState<T[]>([])
  const [totalItems, setTotalItems] = useState<number>(totalItemsData ?? 0)
  // Detect whether pagination is server-side (parent provides totals or fetcher returns totals)
  const [isServerSide, setIsServerSide] = useState<boolean>(typeof totalItemsData === 'number' || typeof totalPageData === 'number')
  const [loading, setLoading] = useState<boolean>(true)
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
  const [error, setError] = useState<string | undefined>()

  // State for pagination
  const [page, setPage] = useState<number>(initialPage)
  const [totalPages, setTotalPages] = useState<number>(totalPageData ?? 0)
  const [currentPageSize, setCurrentPageSize] = useState<number>(pageSize)

  // Keep internal `page` and `currentPageSize` in sync when parent controls them
  useEffect(() => {
    setPage(initialPage)
  }, [initialPage])

  useEffect(() => {
    setCurrentPageSize(pageSize)
  }, [pageSize])

  // If parent provides totals (server-side), keep totals in sync
  useEffect(() => {
    if (typeof totalItemsData === 'number' || typeof totalPageData === 'number') {
      // Parent provided pagination totals -> treat as server-side
      setIsServerSide(true)
    } else {
      setIsServerSide(false)
    }

    if (typeof totalItemsData === 'number') {
      setTotalItems(totalItemsData)
      const pages = currentPageSize > 0 ? Math.ceil(totalItemsData / currentPageSize) : 0
      setTotalPages(typeof totalPageData === 'number' ? totalPageData : pages)
    } else if (typeof totalPageData === 'number') {
      setTotalPages(totalPageData)
    }
  }, [totalItemsData, totalPageData, currentPageSize])

  // Debug: trace pagination totals and page changes
  useEffect(() => {
    try {
      console.debug('DataTable: pagination state', {
        totalItems,
        totalPages,
        page,
        currentPageSize,
      })
    } catch (err) {
      // ignore console errors in some environments
    }
  }, [totalItems, totalPages, page, currentPageSize])

  // State for sorting
  const [sortField, setSortField] = useState<string>(initialSort?.field ?? '')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(initialSort?.direction === 'desc' ? 'desc' : 'asc')

  // State for filters
  const [filters, setFilters] = useState<Record<string, string>>(initialFilters ?? {})
  const [filtersActive, setFiltersActive] = useState<boolean>(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false)

  // State for UI controls
  const [selectedRow, setSelectedRow] = useState<string | number | null>(null)
  const [showColumnMenu, setShowColumnMenu] = useState<boolean>(false)
  const [showTableOptions, setShowTableOptions] = useState<boolean>(false)

  // State for grouping
  const [groupByField, setGroupByField] = useState<string | null>(null)
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})

  // Flag to track if we need to reload data
  const [shouldReload, setShouldReload] = useState<boolean>(true)

  // Get visible columns
  const visibleColumns = useMemo(() => columns.filter(col => col.visible !== false), [columns])

  // Filter actions based on visibility
  const getVisibleActions = useCallback(
    (row: T) =>
      actions.filter(action => {
        if (typeof action.isVisible === 'function') {
          return action.isVisible(row)
        }
        if (typeof action.isVisible === 'boolean') {
          return action.isVisible
        }
        return true
      }),
    [actions],
  )

  // Check if any actions would be visible for this table
  const hasVisibleActions = useCallback(() => actions.some(action => action.isVisible !== false), [actions])

  const applyFiltersAndSort = useCallback(
    (dataArray: T[] | undefined | null, currentFilters: Record<string, string>, field?: string, direction: 'asc' | 'desc' = 'asc') => {
      const safeData = Array.isArray(dataArray) ? dataArray : []
      let filteredData = [...safeData]

      if (Object.keys(currentFilters)?.length > 0) {
        filteredData = filteredData.filter(item => {
          return Object.entries(currentFilters).every(([filterField, filterValue]) => {
            if (!filterValue.trim()) return true
            const itemValue = (item as Record<string, unknown>)[filterField]
            if (itemValue === undefined || itemValue === null) return false
            return String(itemValue).toLowerCase().includes(filterValue.toLowerCase())
          })
        })
        setFiltersActive(true)
      } else {
        setFiltersActive(false)
      }

      if (field) {
        filteredData.sort((a, b) => {
          const aValue = (a as Record<string, unknown>)[field]
          const bValue = (b as Record<string, unknown>)[field]

          const normalizedA = aValue == null ? '' : String(aValue)
          const normalizedB = bValue == null ? '' : String(bValue)

          if (normalizedA < normalizedB) return direction === 'asc' ? -1 : 1
          if (normalizedA > normalizedB) return direction === 'asc' ? 1 : -1
          return 0
        })
      }

      // Only update totals/pages when operating in client-side mode.
      if (!isServerSide) {
        setTotalItems(filteredData.length)
        const pages = currentPageSize > 0 ? Math.ceil(filteredData.length / currentPageSize) : 0
        setTotalPages(pages)
      }

      setDisplayData(filteredData)
    },
    [currentPageSize, page, isServerSide],
  )

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const result = await fetchData()
      const rows = result?.data ?? []

      setAllData(rows)
      setError(undefined)

      // If fetcher returned totalItems, treat as server-side pagination and use those totals
      if (result && typeof result.totalItems === 'number') {
        setIsServerSide(true)
        setTotalItems(result.totalItems)
        const pages = currentPageSize > 0 ? Math.ceil(result.totalItems / currentPageSize) : 0
        setTotalPages(typeof totalPageData === 'number' ? totalPageData : pages)

        // Server returns already-paged rows (or server-managed filtering). Do not re-filter/slice.
        setDisplayData(rows)
      } else if (typeof totalItemsData === 'number') {
        // Parent-provided totals -> server-side behavior
        setIsServerSide(true)
        setTotalItems(totalItemsData)
        const pages = currentPageSize > 0 ? Math.ceil(totalItemsData / currentPageSize) : 0
        setTotalPages(typeof totalPageData === 'number' ? totalPageData : pages)
        setDisplayData(rows)
      } else {
        // Client-side mode: apply filters/sort and compute totals from full dataset
        setIsServerSide(false)
        applyFiltersAndSort(rows, filters, sortField, sortDirection)
      }
    } catch (err) {
      const errorInstance = err instanceof Error ? err : new Error('Error loading data')
      setError(errorInstance.message)
      if (onError) {
        onError(errorInstance)
      }
    } finally {
      setLoading(false)
    }
  }, [applyFiltersAndSort, fetchData, filters, onError, sortDirection, sortField, currentPageSize, totalPageData, totalItemsData])

  useEffect(() => {
    if (!shouldReload) {
      return
    }

    void (async () => {
      await loadData()
      setShouldReload(false)
    })()
  }, [loadData, shouldReload])

  useEffect(() => {
    setShouldReload(true)
  }, [fetchData])

  // Sync external pageSize prop with internal state
  useEffect(() => {
    setCurrentPageSize(pageSize)
  }, [pageSize])

  useEffect(() => {
    if (isServerSide) {
      // When server-side, server is responsible for filtering/paging — just reflect rows
      setDisplayData(allData)
    } else {
      applyFiltersAndSort(allData, filters, sortField, sortDirection)
    }
  }, [applyFiltersAndSort, allData, filters, sortField, sortDirection, currentPageSize])

  useEffect(() => {
    if (displayData?.length > 0) {
      // Only slice when using client-side pagination. If server-side, displayData already contains page rows.
      if (!isServerSide && isPagination) {
        const startIndex = Math.max(0, (page - 1) * currentPageSize)
        const endIndex = startIndex + currentPageSize
        setData(displayData?.slice(startIndex, endIndex))
      } else {
        setData(displayData)
      }
    } else {
      setData([])
    }
  }, [currentPageSize, displayData, page, isPagination, isServerSide])

  // Handle sorting
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
    setPage(1)
  }

  // Handle filtering
  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => {
      const nextFilters: Record<string, string> = { ...prev }

      if (value && value.trim() !== '') {
        nextFilters[field] = value
      } else {
        delete nextFilters[field]
      }

      return nextFilters
    })
    setPage(1)
  }

  // Clear all filters
  const clearFilters = () => {
    setFilters({})
    setPage(1)
  }

  // Handle row selection
  const handleRowClick = (row: T) => {
    const identifier = (row as Record<string, unknown>).id
    if (typeof identifier === 'string' || typeof identifier === 'number') {
      setSelectedRow(identifier)
    } else {
      setSelectedRow(null)
    }
    if (onRowSelect) {
      onRowSelect(row)
    }
  }

  // Toggle column visibility
  const toggleColumnVisibility = (field: string) => {
    setColumns(cols => cols.map(col => (col.field === field ? { ...col, visible: col.visible === false ? true : false } : col)))
  }

  // Reset columns to default visibility
  const resetColumnVisibility = () => {
    setColumns(
      initialColumns.map(col => ({
        ...col,
        visible: col.visible !== false,
      })),
    )
  }

  // Handle group toggling
  const toggleGroup = (groupValue: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupValue]: !prev[groupValue],
    }))
  }

  // Set grouping field
  const setGroupBy = (field: string | null) => {
    if (!field || field === groupByField) {
      setGroupByField(null)
      setExpandedGroups({})
      return
    }

    setGroupByField(field)
    const groups: Record<string, boolean> = {}
    displayData.forEach(item => {
      const rawValue = (item as Record<string, unknown>)[field]
      const key = rawValue === undefined || rawValue === null ? 'Undefined' : String(rawValue)
      groups[key] = true
    })
    setExpandedGroups(groups)
  }

  // Refresh data: await parent onRefresh (if it returns a Promise) and show loading during refresh
  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      if (onRefresh) {
        const maybe = onRefresh()
        if (maybe && typeof (maybe as any).then === 'function') {
          await (maybe as Promise<void>)
        }
      }

      setShouldReload(true)
      await loadData()
    } catch (err) {
      console.warn('DataTable: refresh failed', err)
    } finally {
      setIsRefreshing(false)
    }
  }

  // Export data functions
  const handleExportCSV = () => {
    exportToCSV(displayData, columns, `${tableName.replace(/\s+/g, '_')}_export.csv`)
    setShowTableOptions(false)
  }

  const handleExportExcel = () => {
    exportToExcel(displayData, columns, `${tableName.replace(/\s+/g, '_')}_export.xlsx`)
    setShowTableOptions(false)
  }

  const handleExportPDF = () => {
    setShowTableOptions(false)

    void exportToPDF(displayData, columns, `${tableName.replace(/\s+/g, '_')}_export.pdf`).catch(error => {
      const exportError = error instanceof Error ? error : new Error('Failed to export PDF. Please try again.')

      if (onError) {
        onError(exportError)
      } else {
        console.error(exportError)
      }
    })
  }

  // Handle page size change
  const handlePageSizeChange = (size: number) => {
    setCurrentPageSize(size)
    setPage(1) // Reset to first page on page size change
  }

  // Process data for grouped display, including handling rendered values
  const groupedData = useMemo(() => {
    if (!groupByField || data.length === 0) {
      return undefined
    }

    const groupColumn = columns.find(col => col.field === groupByField)
    const result: Record<string, { items: T[]; displayValue: string; rawValue: unknown }> = {}

    data.forEach(item => {
      const rowRecord = item as Record<string, unknown>
      const rawValue = rowRecord[groupByField]
      let displayValue: string

      if (rawValue === undefined || rawValue === null) {
        displayValue = 'Undefined'
      } else if (groupColumn?.render) {
        const renderedValue = groupColumn.render(rawValue, item)
        if (typeof renderedValue === 'string' || typeof renderedValue === 'number') {
          displayValue = String(renderedValue)
        } else {
          displayValue = String(rawValue)
        }
      } else {
        displayValue = String(rawValue)
      }

      if (!result[displayValue]) {
        result[displayValue] = {
          items: [],
          displayValue,
          rawValue,
        }
      }
      result[displayValue].items.push(item)
    })

    return Object.keys(result).length ? result : undefined
  }, [columns, data, groupByField])

  const isLoading = loading || externalLoading || isRefreshing

  // Check if there are any visible actions for the current table
  const shouldShowActionsColumn = hasVisibleActions()

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Table Header Component */}
      {isHeader && (
        <TableHeader
          tableName={tableName}
          filtersActive={filtersActive}
          clearFilters={clearFilters}
          allowRefresh={allowRefresh}
          handleRefresh={handleRefresh}
          allowColumnSelection={allowColumnSelection}
          showColumnMenu={showColumnMenu}
          setShowColumnMenu={setShowColumnMenu}
          columns={columns}
          toggleColumnVisibility={toggleColumnVisibility}
          resetColumnVisibility={resetColumnVisibility}
          setShowAdvancedFilters={setShowAdvancedFilters}
          showAdvancedFilters={showAdvancedFilters}
          allowExport={allowExport}
          showTableOptions={showTableOptions}
          setShowTableOptions={setShowTableOptions}
          handleExportCSV={handleExportCSV}
          handleExportExcel={handleExportExcel}
          handleExportPDF={handleExportPDF}
          allowGrouping={allowGrouping}
          groupByField={groupByField}
          setGroupBy={setGroupBy}
        />
      )}

      {/* Advanced Filters Component */}
      {showAdvancedFilters && isFilter && (
        <AdvancedFilters columns={columns} filters={filters} handleFilterChange={handleFilterChange} clearFilters={clearFilters} />
      )}

      {/* Table Content Component */}
      <TableContent
        visibleColumns={visibleColumns}
        groupByField={groupByField ?? undefined}
        shouldShowActionsColumn={shouldShowActionsColumn}
        isLoading={isLoading}
        error={error}
        data={data}
        groupedData={groupedData}
        expandedGroups={expandedGroups}
        toggleGroup={toggleGroup}
        columns={columns}
        selectedRow={selectedRow}
        handleRowClick={handleRowClick}
        getVisibleActions={getVisibleActions}
        colors={colors}
        sortField={sortField}
        sortDirection={sortDirection}
        handleSort={handleSort}
      />

      {/* Pagination Component */}
      {isPagination && (
        <Pagination
          page={page}
          setPage={p => {
            const nextPage = typeof p === 'function' ? (p as (prev: number) => number)(page) : (p as number)
            // If parent provided a setter, notify parent (controlled); otherwise update internal state
            if (typeof parentSetPage === 'function') {
              try {
                // debug: notify parent
                console.debug('DataTable: calling parentSetPage', nextPage)
                parentSetPage(nextPage)
              } catch (err) {
                // ignore
              }
            } else {
              setPage(nextPage)
            }
          }}
          totalPages={totalPages}
          totalItems={totalItems}
          currentPageSize={currentPageSize}
          pageSizeOptions={pageSizeOptions}
          handlePageSizeChange={size => {
            // If parent provided callbacks, notify them in correct order
            if (typeof parentSetCurrentPageSize === 'function' || typeof parentSetPage === 'function') {
              try {
                if (typeof parentSetCurrentPageSize === 'function') {
                  console.debug('DataTable: calling parentSetCurrentPageSize', size)
                  parentSetCurrentPageSize(size)
                }
              } catch (err) {
                // ignore
              }
              try {
                if (typeof parentSetPage === 'function') parentSetPage(1)
              } catch (err) {
                // ignore
              }
            } else {
              handlePageSizeChange(size)
            }
          }}
          isLoading={isLoading}
          dataLength={data.length}
        />
      )}
    </div>
  )
}

export default DataTable
