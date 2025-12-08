'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Receipt, Filter } from 'lucide-react'
import { useTransactionData } from './hooks/useTransactionData'
import { TransactionCard } from './TransactionCard'
import Pagination from '@/components/ui/CustomComponent/Paginations/Pagination'
import { TransactionQueryParams } from './types'

/**
 * Main view transactions client component
 */
export default function ViewTransactionsClient() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [filters, setFilters] = useState<TransactionQueryParams>({
    order: 'DESC',
    orderBy: 'created_at',
  })
  const [showFilters, setShowFilters] = useState(false)

  const { transactions, loading, error, total, refetch } = useTransactionData(page, limit, filters)

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = parseInt(e.target.value, 10)
    setLimit(newLimit)
    setPage(1)
  }

  const handleFilterChange = (key: keyof TransactionQueryParams, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
    setPage(1) // Reset to first page when filters change
  }

  const clearFilters = () => {
    setFilters({
      order: 'DESC',
      orderBy: 'created_at',
    })
    setPage(1)
  }

  if (loading && transactions.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3b1804] mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading transactions...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <X className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">My Transactions</h1>
              <p className="text-gray-600">View and manage your payment transactions</p>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="mt-4 sm:mt-0 px-4 py-2 bg-[#3b1804] text-white rounded-lg hover:bg-[#5a2a0a] transition-colors flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white border border-gray-200 rounded-lg p-6 mb-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={filters.status || ''}
                    onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3b1804] focus:border-transparent"
                  >
                    <option value="">All Statuses</option>
                    <option value="INITIATED">Initiated</option>
                    <option value="PENDING">Pending</option>
                    <option value="AUTHORIZED">Authorized</option>
                    <option value="CAPTURED">Captured</option>
                    <option value="FAILED">Failed</option>
                  </select>
                </div>

                {/* Method Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <select
                    value={filters.method || ''}
                    onChange={(e) => handleFilterChange('method', e.target.value || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3b1804] focus:border-transparent"
                  >
                    <option value="">All Methods</option>
                    <option value="UPI">UPI</option>
                    <option value="CARD">Card</option>
                    <option value="NETBANKING">Net Banking</option>
                    <option value="WALLET">Wallet</option>
                    <option value="EMI">EMI</option>
                  </select>
                </div>

                {/* Gateway Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gateway</label>
                  <select
                    value={filters.gateway || ''}
                    onChange={(e) => handleFilterChange('gateway', e.target.value || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3b1804] focus:border-transparent"
                  >
                    <option value="">All Gateways</option>
                    <option value="RAZORPAY">Razorpay</option>
                    <option value="PHONEPE">PhonePe</option>
                    <option value="PAYTM">Paytm</option>
                  </select>
                </div>

                {/* Sort Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
                  <select
                    value={filters.order || 'DESC'}
                    onChange={(e) => handleFilterChange('order', e.target.value as 'ASC' | 'DESC')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3b1804] focus:border-transparent"
                  >
                    <option value="DESC">Newest First</option>
                    <option value="ASC">Oldest First</option>
                  </select>
                </div>

                {/* Date Filter Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Filter</label>
                  <select
                    value={filters.dateFilter || ''}
                    onChange={(e) => handleFilterChange('dateFilter', e.target.value || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3b1804] focus:border-transparent"
                  >
                    <option value="">No Date Filter</option>
                    <option value="day">Today</option>
                    <option value="days">Last N Days</option>
                    <option value="month">Month</option>
                    <option value="year">Year</option>
                  </select>
                </div>

                {/* Date Value */}
                {filters.dateFilter && filters.dateFilter !== 'day' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {filters.dateFilter === 'days'
                        ? 'Number of Days'
                        : filters.dateFilter === 'month'
                          ? 'Month (1-12)'
                          : 'Year (YYYY)'}
                    </label>
                    <input
                      type="number"
                      value={filters.dateValue || ''}
                      onChange={(e) => handleFilterChange('dateValue', e.target.value ? parseInt(e.target.value, 10) : undefined)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3b1804] focus:border-transparent"
                      placeholder={filters.dateFilter === 'days' ? '7' : filters.dateFilter === 'month' ? '1-12' : '2024'}
                    />
                  </div>
                )}

                {/* Date Field */}
                {filters.dateFilter && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Field</label>
                    <select
                      value={filters.dateField || 'created_at'}
                      onChange={(e) => handleFilterChange('dateField', e.target.value as 'created_at' | 'updated_at' | 'verified_at')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3b1804] focus:border-transparent"
                    >
                      <option value="created_at">Created At</option>
                      <option value="updated_at">Updated At</option>
                      <option value="verified_at">Verified At</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Clear Filters Button */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </motion.div>
          )}

          {/* Results Count and Limit Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <p className="text-gray-600 mb-2 sm:mb-0">
              Showing {transactions.length} of {total} transactions
            </p>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Items per page:</label>
              <select
                value={limit}
                onChange={handleLimitChange}
                className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3b1804] focus:border-transparent"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Transactions List */}
        {transactions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white border border-gray-200 rounded-lg p-12 text-center"
          >
            <Receipt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Transactions Found</h3>
            <p className="text-gray-600">You don't have any transactions matching your filters.</p>
          </motion.div>
        ) : (
          <div className="grid gap-6 mb-8">
            {transactions.map((transaction, index) => (
              <TransactionCard key={transaction.id} transaction={transaction} index={index} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {total > limit && (
          <div className="mt-8">
            <Pagination
              totalItems={total}
              itemsPerPage={limit}
              currentPage={page}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  )
}

