import { useState, useEffect, useCallback, useRef } from 'react'
import { getMethod, patchMethod, postMethod, deleteMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'
import { getSSEService } from '@/services/sse.service'
import { Notification, NotificationListResponse, NotificationFilterParams, UnreadCountResponse } from '../types'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'

interface UseAdminNotificationOptions {
  initialPage?: number
  initialLimit?: number
  enableSSE?: boolean // Enable SSE for real-time notifications
}

/**
 * Custom hook to fetch and manage admin notifications with SSE support
 * - Fetches notifications only when explicitly called (no auto-polling)
 * - Uses SSE to receive new notifications in real-time
 * - Only connects SSE when user is logged in
 */
export function useAdminNotification(options: UseAdminNotificationOptions = {}) {
  const { initialPage = 1, initialLimit = 20, enableSSE = true } = options
  const { user, token } = useAuth()

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(initialPage)
  const [total, setTotal] = useState(0)
  const sseSubscriptionRef = useRef<string | null>(null)

  const fetchNotifications = useCallback(
    async (filterParams: NotificationFilterParams = {}) => {
      try {
        setLoading(true)
        setError(null)
        const params = {
          page: filterParams.page || page,
          limit: filterParams.limit || initialLimit,
          ...(filterParams.category && { category: filterParams.category }),
          ...(filterParams.unreadOnly !== undefined && { unreadOnly: filterParams.unreadOnly }),
        }

        const response = await getMethod<NotificationListResponse>(appEndpoints.getNotifications, params)

        if (response.error) {
          setError(response.message || 'Failed to fetch notifications')
          return
        }

        const data = response.data as NotificationListResponse
        if (data) {
          setNotifications(data.data || [])
          setTotal(data.total || 0)
          setUnreadCount(data.unreadCount || 0)
          if (filterParams.page) setPage(filterParams.page)
        }
      } catch (err) {
        console.error('Error fetching notifications:', err)
        setError('An error occurred while fetching notifications')
      } finally {
        setLoading(false)
      }
    },
    [page, initialLimit],
  )

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await getMethod<UnreadCountResponse>(appEndpoints.getUnreadCount)

      if (!response.error && response.data) {
        setUnreadCount(response.data.unreadCount || 0)
      }
    } catch (err) {
      console.error('Error fetching unread count:', err)
    }
  }, [])

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await patchMethod<{ success: boolean }>(appEndpoints.markNotificationAsRead(notificationId))

      if (!response.error && response.data?.success) {
        // Optimistic update
        setNotifications(prev =>
          prev.map(notif => (notif.id === notificationId ? { ...notif, is_read: true, read_at: new Date().toISOString() } : notif)),
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
        return true
      }
      return false
    } catch (err) {
      console.error('Error marking notification as read:', err)
      return false
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
    try {
      const response = await postMethod<{ success: boolean; markedCount: number }>(appEndpoints.markAllAsRead)

      if (!response.error && response.data?.success) {
        // Optimistic update
        setNotifications(prev => prev.map(notif => ({ ...notif, is_read: true, read_at: new Date().toISOString() })))
        setUnreadCount(0)
        return response.data.markedCount || 0
      }
      return 0
    } catch (err) {
      console.error('Error marking all notifications as read:', err)
      return 0
    }
  }, [])

  const markSelectedAsRead = useCallback(async (notificationIds: string[]) => {
    try {
      const response = await postMethod<{ success: boolean; markedCount: number }>(appEndpoints.markMultipleAsRead, {
        notificationIds,
      })

      if (!response.error && response.data?.success) {
        // Optimistic update
        const count = response.data.markedCount || 0
        setNotifications(prev =>
          prev.map(notif => (notificationIds.includes(notif.id) ? { ...notif, is_read: true, read_at: new Date().toISOString() } : notif)),
        )
        setUnreadCount(prev => Math.max(0, prev - count))
        return count
      }
      return 0
    } catch (err) {
      console.error('Error marking selected notifications as read:', err)
      return 0
    }
  }, [])

  const deleteNotification = useCallback(
    async (notificationId: string) => {
      try {
        const response = await deleteMethod<{ success: boolean }>(appEndpoints.deleteNotification(notificationId))

        if (!response.error && response.data?.success) {
          // Optimistic update
          const deletedNotif = notifications.find(n => n.id === notificationId)
          setNotifications(prev => prev.filter(notif => notif.id !== notificationId))
          if (deletedNotif && !deletedNotif.is_read) {
            setUnreadCount(prev => Math.max(0, prev - 1))
          }
          return true
        }
        return false
      } catch (err) {
        console.error('Error deleting notification:', err)
        return false
      }
    },
    [notifications],
  )

  const refetch = useCallback(() => {
    setLoading(true)
    fetchNotifications()
    fetchUnreadCount()
  }, [fetchNotifications, fetchUnreadCount])

  // SSE Setup - Listen for real-time notifications
  // Only connect when user is logged in and has a token
  useEffect(() => {
    if (!enableSSE || !user || !token) {
      // Disconnect if user logs out
      if (sseSubscriptionRef.current) {
        const sseService = getSSEService()
        sseService.unsubscribe(sseSubscriptionRef.current)
        sseSubscriptionRef.current = null
      }
      return
    }

    const sseService = getSSEService()

    // Subscribe to notification events with token
    const subscriptionId = sseService.subscribe(
      (message) => {
        if (message.event === 'notification' && message.data) {
          const newNotification = message.data as Notification

          // Add new notification to the list (prepend)
          setNotifications(prev => {
            // Check if notification already exists (avoid duplicates)
            const exists = prev.some(n => n.id === newNotification.id)
            if (exists) {
              // Update existing notification
              return prev.map(n => (n.id === newNotification.id ? newNotification : n))
            }
            // Add new notification at the beginning
            return [newNotification, ...prev]
          })

          // Update unread count if notification is unread
          if (!newNotification.is_read) {
            setUnreadCount(prev => prev + 1)
          }
        }
      },
      'notification',
      token, // Pass token to subscribe
    )

    sseSubscriptionRef.current = subscriptionId

    // Cleanup on unmount or when user/token changes
    return () => {
      if (subscriptionId) {
        sseService.unsubscribe(subscriptionId)
      }
    }
  }, [enableSSE, user, token]) // Depend on user and token

  return {
    notifications,
    unreadCount,
    loading,
    error,
    total,
    page,
    refetch,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    markSelectedAsRead,
    deleteNotification,
  }
}
