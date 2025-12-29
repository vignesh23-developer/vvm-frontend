'use client'

import { Check } from 'lucide-react'
import { Notification } from './types'
import { formatRelativeTime } from '@/utils/date/formatRelativeTime'

interface NotificationCardProps {
  notification: Notification
  showCheckbox?: boolean
  isSelected?: boolean
  onSelect?: (id: string) => void
  onMarkAsRead?: (id: string) => void
}

export default function NotificationCard({
  notification,
  showCheckbox = false,
  isSelected = false,
  onSelect,
  onMarkAsRead,
}: NotificationCardProps) {
  const handleClick = () => {
    if (!notification.is_read && onMarkAsRead) {
      onMarkAsRead(notification.id)
    }
  }

  const formatDate = (date: Date | string) => {
    return formatRelativeTime(date)
  }

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer ${
        notification.is_read
          ? 'bg-white hover:bg-gray-50'
          : 'bg-blue-50 hover:bg-blue-100 border-l-4 border-blue-500'
      }`}
      onClick={handleClick}
    >
      {showCheckbox && (
        <div
          className="mt-1 flex-shrink-0"
          onClick={(e) => {
            e.stopPropagation()
            if (onSelect) {
              onSelect(notification.id)
            }
          }}
        >
          <div
            className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
              isSelected
                ? 'bg-blue-600 border-blue-600'
                : 'border-gray-300 hover:border-blue-400'
            }`}
          >
            {isSelected && <Check size={14} className="text-white" />}
          </div>
        </div>
      )}

      {notification.icon && (
        <div className="flex-shrink-0 mt-1">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-lg">{notification.icon}</span>
          </div>
        </div>
      )}

      {/* {notification.image_url && !notification.icon && (
        <div className="flex-shrink-0">
          <img
            src={notification.image_url}
            alt={notification.title}
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>
      )} */}

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4
            className={`text-sm font-medium ${
              notification.is_read ? 'text-gray-700' : 'text-gray-900 font-semibold'
            }`}
          >
            {notification.title}
          </h4>
          {!notification.is_read && (
            <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2" />
          )}
        </div>
        <p
          className={`text-sm mt-1 line-clamp-2 ${
            notification.is_read ? 'text-gray-600' : 'text-gray-800'
          }`}
        >
          {notification.body}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-gray-500">{formatDate(notification.created_at)}</span>
          {notification.category && (
            <>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500 capitalize">{notification.category.toLowerCase()}</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

