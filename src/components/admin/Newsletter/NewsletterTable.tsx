'use client'

import { useState, useEffect, useCallback } from 'react'
import { useNewsLetter, Newsletter } from './hooks/useNewsLetter'
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, Mail, MapPin, Globe, ToggleLeft, ToggleRight } from 'lucide-react'

interface NewsletterTableProps {
  onRefresh?: () => void
}

export default function NewsletterTable({ onRefresh }: NewsletterTableProps) {
  const {
    newsletters,
    loading,
    error,
    total,
    page,
    limit,
    fetchNewsletters,
    unsubscribeNewsletter,
    subscribeNewsletter,
  } = useNewsLetter()

  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<'ASC' | 'DESC'>('DESC')
  const [orderBy, setOrderBy] = useState<string>('created_at')
  const [statusFilter, setStatusFilter] = useState<'all' | 'subscribed' | 'unsubscribed'>('all')

  // Fetch newsletters on mount and when filters change
  useEffect(() => {
    fetchNewsletters({
      page: 1,
      limit: 10,
      sort,
      orderBy,
      search: search || undefined,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort, orderBy])

  // Debounce search
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchNewsletters({
        page: 1,
        limit,
        sort,
        orderBy,
        search: search || undefined,
      })
    }, 300)

    return () => {
      clearTimeout(timeout)
    }
  }, [search, limit, sort, orderBy, fetchNewsletters])

  const handlePageChange = (newPage: number) => {
    fetchNewsletters({
      page: newPage,
      limit,
      sort,
      orderBy,
      search: search || undefined,
    })
  }

  const handleSortChange = (newOrderBy: string) => {
    const newSort = orderBy === newOrderBy && sort === 'DESC' ? 'ASC' : 'DESC'
    setOrderBy(newOrderBy)
    setSort(newSort)
  }

  const handleUnsubscribe = async (id: string) => {
    const success = await unsubscribeNewsletter(id)
    if (success && onRefresh) {
      onRefresh()
    }
  }

  const handleSubscribe = async (id: string) => {
    const success = await subscribeNewsletter(id)
    if (success && onRefresh) {
      onRefresh()
    }
  }

  // Filter newsletters by status
  const filteredNewsletters = newsletters.filter(newsletter => {
    if (statusFilter === 'all') return true
    if (statusFilter === 'subscribed') return newsletter.subscription_status
    return !newsletter.subscription_status
  })

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        {/* Status Filter */}
        <div className="flex gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === 'all'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('subscribed')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === 'subscribed'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Subscribed
          </button>
          <button
            onClick={() => setStatusFilter('unsubscribed')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === 'unsubscribed'
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Unsubscribed
          </button>
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => handleSortChange('email')}
          className={`px-3 py-1 rounded text-sm flex items-center gap-1 ${
            orderBy === 'email'
              ? 'bg-yellow-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Mail className="h-4 w-4" />
          Email
          <ArrowUpDown className="h-3 w-3" />
        </button>
        <button
          onClick={() => handleSortChange('created_at')}
          className={`px-3 py-1 rounded text-sm flex items-center gap-1 ${
            orderBy === 'created_at'
              ? 'bg-yellow-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Date
          <ArrowUpDown className="h-3 w-3" />
        </button>
        <button
          onClick={() => handleSortChange('subscription_status')}
          className={`px-3 py-1 rounded text-sm flex items-center gap-1 ${
            orderBy === 'subscription_status'
              ? 'bg-yellow-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Status
          <ArrowUpDown className="h-3 w-3" />
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-200 rounded-lg" />
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Platform User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredNewsletters.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No newsletters found
                    </td>
                  </tr>
                ) : (
                  filteredNewsletters.map((newsletter) => (
                    <tr key={newsletter.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">{newsletter.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                          <span>
                            {newsletter.city || newsletter.state || newsletter.country
                              ? `${newsletter.city || ''}${newsletter.city && newsletter.state ? ', ' : ''}${newsletter.state || ''}${(newsletter.city || newsletter.state) && newsletter.country ? ', ' : ''}${newsletter.country || ''}`
                              : 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            newsletter.subscription_status
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {newsletter.subscription_status ? 'Subscribed' : 'Unsubscribed'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {newsletter.isPlatformUser ? (
                          <span className="text-green-600 font-medium">Yes</span>
                        ) : (
                          <span className="text-gray-400">No</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {newsletter.subscription_status ? (
                          <button
                            onClick={() => handleUnsubscribe(newsletter.id)}
                            className="text-red-600 hover:text-red-900 flex items-center gap-1"
                          >
                            <ToggleLeft className="h-5 w-5" />
                            Unsubscribe
                          </button>
                        ) : (
                          <button
                            onClick={() => handleSubscribe(newsletter.id)}
                            className="text-green-600 hover:text-green-900 flex items-center gap-1"
                          >
                            <ToggleRight className="h-5 w-5" />
                            Subscribe
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} results
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className={`px-3 py-1 rounded border ${
                    page === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="px-4 py-1 text-sm text-gray-700">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages}
                  className={`px-3 py-1 rounded border ${
                    page >= totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

