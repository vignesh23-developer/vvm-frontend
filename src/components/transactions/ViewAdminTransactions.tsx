'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Filter, ChevronLeft, ChevronRight, DollarSign, Calendar, TrendingUp, BarChart3 } from 'lucide-react'
import { useAdminTransactions } from './hooks/useAdminTransactions'
import { useTransactionAnalytics } from './hooks/useTransactionAnalytics'
import { TransactionQueryParams } from './types'
import Pagination from '@/components/ui/CustomComponent/Paginations/Pagination'

/**
 * Admin view for all payment transactions in table format
 */
export default function ViewAdminTransactions() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [filters, setFilters] = useState<TransactionQueryParams>({
    order: 'DESC',
    orderBy: 'created_at',
  })
  const [showFilters, setShowFilters] = useState(false)

  const { transactions, loading, error, total, refetch } = useAdminTransactions(page, limit, filters)
  const { analytics, loading: analyticsLoading } = useTransactionAnalytics()

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
      [key]: value === '' ? undefined : value,
    }))
    setPage(1)
  }

  const clearFilters = () => {
    setFilters({
      order: 'DESC',
      orderBy: 'created_at',
    })
    setPage(1)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      INITIATED: 'bg-blue-100 text-blue-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      AUTHORIZED: 'bg-purple-100 text-purple-800',
      CAPTURED: 'bg-green-100 text-green-800',
      FAILED: 'bg-red-100 text-red-800',
    }
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    )
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
            <button
              onClick={() => refetch()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">All Transactions</h1>
              <p className="text-gray-600">View and manage all payment transactions</p>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="mt-4 sm:mt-0 px-4 py-2 bg-[#3b1804] text-white rounded-lg hover:bg-[#5a2a0a] transition-colors flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {/* Analytics Cards */}
          {!analyticsLoading && analytics && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
            >
              {/* Grand Total Card */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-500 rounded-lg">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">Grand Total</h3>
                <p className="text-2xl font-bold text-gray-800">{analytics.grandTotal.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-2">All time transactions</p>
              </div>

              {/* Today Card */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-500 rounded-lg">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">Today</h3>
                <p className="text-2xl font-bold text-gray-800">{analytics.today.count.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className={`w-4 h-4 ${analytics.today.growthPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                  <span className={`text-xs font-semibold ${analytics.today.growthPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {analytics.today.growthPercentage >= 0 ? '+' : ''}
                    {analytics.today.growthPercentage.toFixed(1)}%
                  </span>
                  <span className="text-xs text-gray-500">vs yesterday</span>
                </div>
              </div>

              {/* This Week Card */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-500 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">This Week</h3>
                <p className="text-2xl font-bold text-gray-800">{analytics.thisWeek.count.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className={`w-4 h-4 ${analytics.thisWeek.growthPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                  <span className={`text-xs font-semibold ${analytics.thisWeek.growthPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {analytics.thisWeek.growthPercentage >= 0 ? '+' : ''}
                    {analytics.thisWeek.growthPercentage.toFixed(1)}%
                  </span>
                  <span className="text-xs text-gray-500">vs last week</span>
                </div>
              </div>

              {/* This Month Card */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-orange-500 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">This Month</h3>
                <p className="text-2xl font-bold text-gray-800">{analytics.thisMonth.count.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className={`w-4 h-4 ${analytics.thisMonth.growthPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                  <span className={`text-xs font-semibold ${analytics.thisMonth.growthPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {analytics.thisMonth.growthPercentage >= 0 ? '+' : ''}
                    {analytics.thisMonth.growthPercentage.toFixed(1)}%
                  </span>
                  <span className="text-xs text-gray-500">vs last month</span>
                </div>
              </div>
            </motion.div>
          )}

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
                    onChange={(e) => handleFilterChange('status', e.target.value)}
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
                    onChange={(e) => handleFilterChange('method', e.target.value)}
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
                    onChange={(e) => handleFilterChange('gateway', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3b1804] focus:border-transparent"
                  >
                    <option value="">All Gateways</option>
                    <option value="RAZORPAY">Razorpay</option>
                    <option value="PHONEPE">PhonePe</option>
                    <option value="PAYTM">Paytm</option>
                  </select>
                </div>

                {/* Currency Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <select
                    value={filters.currency || ''}
                    onChange={(e) => handleFilterChange('currency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3b1804] focus:border-transparent"
                  >
                    <option value="">All Currencies</option>
                    <option value="INR">INR</option>
                  </select>
                </div>

                {/* Min Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Amount (₹)</label>
                  <input
                    type="number"
                    value={filters.minAmount || ''}
                    onChange={(e) => handleFilterChange('minAmount', e.target.value ? parseFloat(e.target.value) : undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3b1804] focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                {/* Max Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Amount (₹)</label>
                  <input
                    type="number"
                    value={filters.maxAmount || ''}
                    onChange={(e) => handleFilterChange('maxAmount', e.target.value ? parseFloat(e.target.value) : undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3b1804] focus:border-transparent"
                    placeholder="100000"
                  />
                </div>

                {/* Date Filter Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Filter Type</label>
                  <select
                    value={filters.dateFilter || ''}
                    onChange={(e) => handleFilterChange('dateFilter', e.target.value)}
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
                      placeholder={filters.dateFilter === 'days' ? '7' : filters.dateFilter === 'month' ? '1' : '2024'}
                    />
                  </div>
                )}

                {/* Date Field */}
                {filters.dateFilter && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Field</label>
                    <select
                      value={filters.dateField || 'created_at'}
                      onChange={(e) => handleFilterChange('dateField', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3b1804] focus:border-transparent"
                    >
                      <option value="created_at">Created At</option>
                      <option value="updated_at">Updated At</option>
                      <option value="verified_at">Verified At</option>
                    </select>
                  </div>
                )}

                {/* Sort Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
                  <select
                    value={filters.order || 'DESC'}
                    onChange={(e) => handleFilterChange('order', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3b1804] focus:border-transparent"
                  >
                    <option value="DESC">Descending</option>
                    <option value="ASC">Ascending</option>
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={filters.orderBy || 'created_at'}
                    onChange={(e) => handleFilterChange('orderBy', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3b1804] focus:border-transparent"
                  >
                    <option value="created_at">Created At</option>
                    <option value="updated_at">Updated At</option>
                    <option value="verified_at">Verified At</option>
                    <option value="amount">Amount</option>
                    <option value="attempt_number">Attempt Number</option>
                    <option value="status">Status</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Table */}
        {transactions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-lg p-12 text-center"
          >
            <p className="text-gray-600">No transactions found</p>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transaction ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Method
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gateway
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Attempt
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created At
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Verified At
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                          {transaction.id.substring(0, 8)}...
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.payment_order?.order_number || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.payment_order?.user_id ? (
                            <span className="font-mono text-xs">{transaction.payment_order.user_id.substring(0, 8)}...</span>
                          ) : (
                            'N/A'
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {formatCurrency(transaction.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {getStatusBadge(transaction.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.method || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.payment_order?.gateway || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.attempt_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(transaction.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(transaction.verified_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Pagination */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Show</span>
                <select
                  value={limit}
                  onChange={handleLimitChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3b1804] focus:border-transparent"
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
                <span className="text-sm text-gray-700">per page</span>
              </div>

              <div className="text-sm text-gray-700">
                Showing {Math.min((page - 1) * limit + 1, total)} to {Math.min(page * limit, total)} of {total} transactions
              </div>

              <Pagination
                totalItems={total}
                itemsPerPage={limit}
                currentPage={page}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

