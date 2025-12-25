'use client'

import { useEffect } from 'react'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import { useNotification } from './hooks/useNotification'

/**
 * NotificationBadge Component
 * 
 * Workflow:
 * 1. User logged out - don't show badge (handled by parent, but also checked here)
 * 2. User logged in:
 *    - No notifications - don't show badge (bell icon remains as is)
 *    - All notifications read (is_read: true) - don't show badge
 *    - Has unread notifications (is_read: false) - show red dot with count
 */
export default function NotificationBadge() {
  const { user } = useAuth()
  const { unreadCount, fetchUnreadCount } = useNotification({
    enableSSE: true, // Enable SSE to receive real-time updates
    initialLimit: 1, // We only need the count, but API requires at least 1
  })

  // Only fetch unread count when user is logged in
  useEffect(() => {
    if (user) {
      fetchUnreadCount()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]) // Only depend on user, fetchUnreadCount is stable

  // Don't show badge if:
  // 1. User is not logged in
  // 2. No unread notifications (unreadCount === 0)
  if (!user || unreadCount === 0) {
    return null
  }

  // Show red dot badge with count when there are unread notifications
  return (
    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center min-w-[20px] border-2 border-white">
      {unreadCount > 99 ? '99+' : unreadCount}
    </span>
  )
}
