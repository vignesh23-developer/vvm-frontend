'use client'

import { useState, useCallback, useEffect } from 'react'
import { CheckSquare, Square, Filter } from 'lucide-react'
import { useNotification } from './hooks/useNotification'
import NotificationList from './NotificationList'
import { NotificationCategory } from './types'
import Button from '@/components/ui/CustomComponent/Button/Button'

export default function BuyerNotification() {
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [selectionMode, setSelectionMode] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState<NotificationCategory | undefined>()
  const [unreadOnly, setUnreadOnly] = useState(false)

  const {
    notifications,
    unreadCount,
    loading,
    error,
    total,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    markSelectedAsRead,
  } = useNotification({
    enableSSE: true, // Enable SSE for real-time notifications
    initialPage: page,
    initialLimit: 25,
  })

  // Fetch notifications when component mounts
  useEffect(() => {
    fetchNotifications({ page: 1, limit: 25 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run once on mount

  const handleLoadMore = useCallback(() => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchNotifications({ page: nextPage, limit: 25, category: categoryFilter, unreadOnly })
  }, [page, categoryFilter, unreadOnly, fetchNotifications])

  const handleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }, [])

  const handleSelectAll = useCallback(() => {
    if (selectedIds.length === notifications.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(notifications.map((n) => n.id))
    }
  }, [selectedIds.length, notifications])

  const handleMarkSelectedAsRead = useCallback(async () => {
    if (selectedIds.length === 0) return
    await markSelectedAsRead(selectedIds)
    setSelectedIds([])
    setSelectionMode(false)
  }, [selectedIds, markSelectedAsRead])

  const handleMarkAllAsRead = useCallback(async () => {
    await markAllAsRead()
  }, [markAllAsRead])

  const handleFilterChange = useCallback(() => {
    setPage(1)
    fetchNotifications({ page: 1, limit: 25, category: categoryFilter, unreadOnly })
  }, [categoryFilter, unreadOnly, fetchNotifications])

  const clearFilters = useCallback(() => {
    setCategoryFilter(undefined)
    setUnreadOnly(false)
    setPage(1)
    fetchNotifications({ page: 1, limit: 25 })
  }, [fetchNotifications])

  const hasMore = total > notifications.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Filter size={16} />
            Filters
          </Button>
          {selectionMode ? (
            <>
              <Button
                onClick={handleMarkSelectedAsRead}
                disabled={selectedIds.length === 0}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Mark Selected as Read ({selectedIds.length})
              </Button>
              <Button
                onClick={() => {
                  setSelectionMode(false)
                  setSelectedIds([])
                }}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Mark All as Read
              </Button>
              <Button
                onClick={() => setSelectionMode(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Select
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Clear All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={categoryFilter || ''}
                onChange={(e) => setCategoryFilter(e.target.value as NotificationCategory || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {Object.values(NotificationCategory).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={unreadOnly}
                  onChange={(e) => setUnreadOnly(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Unread Only</span>
              </label>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              onClick={handleFilterChange}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      )}

      {/* Selection Mode Header */}
      {selectionMode && (
        <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectAll}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              {selectedIds.length === notifications.length ? (
                <CheckSquare size={18} className="text-blue-600" />
              ) : (
                <Square size={18} className="text-gray-400" />
              )}
              Select All ({selectedIds.length}/{notifications.length})
            </button>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Notifications List */}
      <NotificationList
        notifications={notifications}
        loading={loading}
        showCheckboxes={selectionMode}
        selectedIds={selectedIds}
        onSelect={handleSelect}
        onMarkAsRead={markAsRead}
        emptyMessage="No notifications found"
      />

      {/* Load More Button */}
      {hasMore && !loading && (
        <div className="flex justify-center">
          <Button
            onClick={handleLoadMore}
            className="px-6 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Load More ({total - notifications.length} remaining)
          </Button>
        </div>
      )}

      {/* Loading More Indicator */}
      {loading && notifications.length > 0 && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  )
}
