'use client'

import React from 'react'
import Button from '../Button/Button'
import { ArrowRight, ArrowLeft, ChevronsRight, ChevronsLeft } from 'lucide-react'

type PaginationProps = {
  totalItems: number
  itemsPerPage?: number
  currentPage: number
  onPageChange: (page: number) => void
  siblingCount?: number
  boundaryCount?: number
  showFirstLast?: boolean
  className?: string
}

const DOTS = 'DOTS'

function range(start: number, end: number) {
  const length = end - start + 1
  return Array.from({ length }, (_, idx) => start + idx)
}

function getPaginationRange({
  totalItems,
  itemsPerPage,
  currentPage,
  siblingCount,
  boundaryCount,
}: {
  totalItems: number
  itemsPerPage: number
  currentPage: number
  siblingCount: number
  boundaryCount: number
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  if (totalPages === 0) return []

  const totalPageNumbers = boundaryCount * 2 + siblingCount * 2 + 3
  if (totalPageNumbers >= totalPages) return range(1, totalPages)

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)
  const showLeftDots = leftSiblingIndex > boundaryCount + 2
  const showRightDots = rightSiblingIndex < totalPages - (boundaryCount + 1)

  const pages: Array<number | typeof DOTS> = []
  for (const p of range(1, boundaryCount)) pages.push(p)
  if (showLeftDots) pages.push(DOTS)
  else for (const p of range(boundaryCount + 1, leftSiblingIndex - 1)) pages.push(p)

  for (const p of range(leftSiblingIndex, rightSiblingIndex)) pages.push(p)

  if (showRightDots) pages.push(DOTS)
  else for (const p of range(rightSiblingIndex + 1, totalPages - boundaryCount)) pages.push(p)

  for (const p of range(totalPages - boundaryCount + 1, totalPages)) pages.push(p)

  return [...new Set(pages)]
}

export default function Pagination({
  totalItems,
  itemsPerPage = 10,
  currentPage,
  onPageChange,
  siblingCount = 1,
  boundaryCount = 1,
  showFirstLast = true,
  className = '',
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  if (totalPages <= 1) return null

  const paginationRange = getPaginationRange({ totalItems, itemsPerPage, currentPage, siblingCount, boundaryCount })

  const handleChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return
    onPageChange(page)
  }

  return (
    <nav
      aria-label="Pagination"
      className={`flex flex-wrap items-center justify-center gap-2 p-3 bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}
    >
      {/* First Page Button */}
      {showFirstLast && (
        <Button
          aria-label="Go to first page"
          onClick={() => handleChange(1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 rounded-full border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <ChevronsLeft className="w-4 h-4" />
        </Button>
      )}

      {/* Previous Page */}
      <Button
        aria-label="Previous page"
        onClick={() => handleChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 rounded-full border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
      </Button>

      {/* Page Numbers */}
      <ul className="flex items-center gap-1 list-none p-0 m-0">
        {paginationRange.map((item, idx) => {
          if (item === DOTS) {
            return (
              <li key={`dots-${idx}`} className="px-2 text-gray-400 select-none text-sm font-medium">
                &#8230;
              </li>
            )
          }

          const pageNumber = item as number
          const isActive = pageNumber === currentPage

          return (
            <li key={pageNumber}>
              <Button
                onClick={() => handleChange(pageNumber)}
                aria-current={isActive ? 'page' : undefined}
                aria-label={`Go to page ${pageNumber}`}
                className={`min-w-[38px] h-9 flex items-center justify-center rounded-full text-sm font-medium transition-all border
                ${isActive ? 'bg-[#2a1407] text-white shadow-sm border-[#2a1407]' : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'}`}
              >
                {pageNumber}
              </Button>
            </li>
          )
        })}
      </ul>

      {/* Next Page */}
      <Button
        aria-label="Next page"
        onClick={() => handleChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 rounded-full border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <ArrowRight className="w-4 h-4" />
      </Button>

      {/* Last Page Button */}
      {showFirstLast && (
        <Button
          aria-label="Go to last page"
          onClick={() => handleChange(totalPages)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 rounded-full border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <ChevronsRight className="w-4 h-4" />
        </Button>
      )}
    </nav>
  )
}
