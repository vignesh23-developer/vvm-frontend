import { useMemo } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'

type PaginationProps = {
  page: number
  setPage: (value: number | ((prev: number) => number)) => void
  totalPages: number
  totalItems: number
  currentPageSize: number
  pageSizeOptions: number[]
  handlePageSizeChange: (size: number) => void
  isLoading: boolean
  dataLength: number
}

const MAX_BUTTONS = 5

export default function Pagination({
  page,
  setPage,
  totalPages,
  totalItems,
  currentPageSize,
  pageSizeOptions,
  handlePageSizeChange,
  isLoading,
  dataLength,
}: PaginationProps) {
  const showingFrom = dataLength > 0 ? (page - 1) * currentPageSize + 1 : 0
  const showingTo = Math.min(page * currentPageSize, totalItems)
  const safeTotalPages = totalPages > 0 ? totalPages : 1

  const pageNumbers = useMemo(() => {
    if (safeTotalPages <= MAX_BUTTONS) {
      return Array.from({ length: safeTotalPages }, (_, index) => index + 1)
    }

    if (page <= 3) {
      return Array.from({ length: MAX_BUTTONS }, (_, index) => index + 1)
    }

    if (page >= safeTotalPages - 2) {
      return Array.from(
        { length: MAX_BUTTONS },
        (_, index) => safeTotalPages - (MAX_BUTTONS - 1) + index,
      )
    }

    return Array.from({ length: MAX_BUTTONS }, (_, index) => page - 2 + index)
  }, [page, safeTotalPages])

  const disablePrev = page === 1 || isLoading
  const disableNext = page === totalPages || totalPages === 0 || isLoading

  const navButtonClass = (disabled: boolean) =>
    `inline-flex items-center rounded-md border px-2 py-1 text-sm ${
      disabled
        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
        : 'bg-white text-gray-700 hover:bg-gray-50'
    }`

  return (
    <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 bg-gray-50 px-6 py-4 sm:flex-row">
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center">
        <div className="text-sm text-gray-700">
          Showing {showingFrom} to {showingTo} of {totalItems} entries
        </div>

        <label className="flex items-center text-sm text-gray-700">
          <span className="mr-2">Show</span>
          <select
            value={currentPageSize}
            onChange={event => handlePageSizeChange(Number(event.target.value))}
            className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {pageSizeOptions.map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="ml-2">per page</span>
        </label>
      </div>

      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={() => setPage(1)}
          disabled={disablePrev}
          className={navButtonClass(disablePrev)}
        >
          <ChevronsLeft size={16} />
        </button>
        <button
          type="button"
          onClick={() =>
            setPage(prev =>
              Math.max(typeof prev === 'number' ? prev - 1 : page - 1, 1),
            )
          }
          disabled={disablePrev}
          className={navButtonClass(disablePrev)}
        >
          <ChevronLeft size={16} />
        </button>

        <div className="hidden space-x-1 sm:flex">
          {pageNumbers.map(pageNumber => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => setPage(pageNumber)}
              disabled={isLoading}
              className={`inline-flex h-8 w-8 items-center justify-center rounded-md border text-sm ${
                page === pageNumber
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {pageNumber}
            </button>
          ))}
        </div>

        <span className="text-sm text-gray-700 sm:hidden">
          Page {page} of {safeTotalPages}
        </span>

        <button
          type="button"
          onClick={() =>
            setPage(prev =>
              Math.min(
                typeof prev === 'number' ? prev + 1 : page + 1,
                totalPages,
              ),
            )
          }
          disabled={disableNext}
          className={navButtonClass(disableNext)}
        >
          <ChevronRight size={16} />
        </button>
        <button
          type="button"
          onClick={() => setPage(totalPages)}
          disabled={disableNext}
          className={navButtonClass(disableNext)}
        >
          <ChevronsRight size={16} />
        </button>
      </div>
    </div>
  )
}
