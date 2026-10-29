'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { useNotification } from './hooks/useNotification'
import NotificationList from './NotificationList'
import Link from 'next/link'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import { getUserRoles, hasRole } from '@/utils/roles/roles'


interface NotificationPopupProps {
  isOpen: boolean
  onClose: () => void
}

export default function NotificationPopup({ isOpen, onClose }: NotificationPopupProps) {
  const { user } = useAuth()
  const popupRef = useRef<HTMLDivElement>(null)
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead, fetchNotifications } = useNotification({
    enableSSE: false, // GlobalNotificationListener handles SSE globally
    initialLimit: 10,
  })

  // Fetch notifications and mark all as read when popup opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications({ page: 1, limit: 10 })
      // Automatically mark all unread notifications as read when popup opens
      markAllAsRead()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]) // Only depend on isOpen, fetchNotifications and markAllAsRead are stable

  // Get first 10 notifications for popup
  const displayNotifications = notifications.slice(0, 10)

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  // Determine notification page route based on user role
  const getNotificationPageRoute = () => {
    if (!user) return '/notifications'
    const userRoles = getUserRoles(user)
    if (hasRole(userRoles, ['admin'])) {
      return '/admin/notifications'
    }
    return '/notifications'
  }

  return (
    <div className="relative" ref={popupRef}>
      <div
        className={`absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[600px] flex flex-col ${
          isOpen ? 'block' : 'hidden'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors" aria-label="Close notifications">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-2">
          {loading && notifications.length === 0 ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-20 bg-gray-200 rounded-lg" />
                </div>
              ))}
            </div>
          ) : displayNotifications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">No notifications</p>
            </div>
          ) : (
            <NotificationList notifications={displayNotifications} loading={false} onMarkAsRead={markAsRead} />
          )}
        </div>

        {/* Footer with View All */}
        {displayNotifications.length > 0 && (
          <div className="border-t border-gray-200 p-3">
            <Link
              href={getNotificationPageRoute()}
              onClick={onClose}
              className="block w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700 py-2 rounded-md hover:bg-blue-50 transition-colors"
            >
              View All Notifications
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
