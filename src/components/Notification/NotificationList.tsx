'use client'

import { Notification } from './types'
import NotificationCard from './NotificationCard'

interface NotificationListProps {
  notifications: Notification[]
  loading?: boolean
  showCheckboxes?: boolean
  selectedIds?: string[]
  onSelect?: (id: string) => void
  onMarkAsRead?: (id: string) => void
  emptyMessage?: string
}

export default function NotificationList({
  notifications,
  loading = false,
  showCheckboxes = false,
  selectedIds = [],
  onSelect,
  onMarkAsRead,
  emptyMessage = 'No notifications found',
}: NotificationListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-20 bg-gray-200 rounded-lg" />
          </div>
        ))}
      </div>
    )
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-sm">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          showCheckbox={showCheckboxes}
          isSelected={selectedIds.includes(notification.id)}
          onSelect={onSelect}
          onMarkAsRead={onMarkAsRead}
        />
      ))}
    </div>
  )
}

