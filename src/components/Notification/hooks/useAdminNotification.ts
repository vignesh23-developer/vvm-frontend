import { useState, useEffect, useCallback, useRef } from 'react'
import { getMethod, patchMethod, postMethod, deleteMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'
import { Notification, NotificationListResponse, NotificationFilterParams, UnreadCountResponse } from '../types'

interface UseAdminNotificationOptions {
  autoPoll?: boolean
  pollInterval?: number
  initialPage?: number
  initialLimit?: number
}

/**
 * Custom hook to fetch and manage admin notifications with polling
 * Uses the same endpoints as regular notifications but can be extended for admin-specific features
 */
export function useAdminNotification(options: UseAdminNotificationOptions = {}) {
  const {
    autoPoll = true,
    pollInterval = 30000, // 30 seconds
    initialPage = 1,
    initialLimit = 20,
  } = options

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(initialPage)
  const [total, setTotal] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const fetchNotifications = useCallback(
    async (filterParams: NotificationFilterParams = {}) => {
      try {
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

  // Store latest functions in refs for polling
  const fetchNotificationsRef = useRef(fetchNotifications)
  const fetchUnreadCountRef = useRef(fetchUnreadCount)

  useEffect(() => {
    fetchNotificationsRef.current = fetchNotifications
    fetchUnreadCountRef.current = fetchUnreadCount
  }, [fetchNotifications, fetchUnreadCount])

  // Initial fetch
  useEffect(() => {
    setLoading(true)
    fetchNotifications()
    fetchUnreadCount()
  }, [])

  // Polling setup - only recreate interval when autoPoll or pollInterval changes
  // useEffect(() => {
  //   if (autoPoll) {
  //     intervalRef.current = setInterval(() => {
  //       fetchNotificationsRef.current()
  //       fetchUnreadCountRef.current()
  //     }, pollInterval)

  //     return () => {
  //       if (intervalRef.current) {
  //         clearInterval(intervalRef.current)
  //       }
  //     }
  //   }
  // }, [autoPoll, pollInterval])

  // Refetch on window focus
  // useEffect(() => {
  //   const handleFocus = () => {
  //     fetchNotifications()
  //     fetchUnreadCount()
  //   }

  //   window.addEventListener('focus', handleFocus)
  //   return () => window.removeEventListener('focus', handleFocus)
  //   // Only run once on mount, functions are stable
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  return {
    notifications,
    unreadCount,
    loading,
    error,
    total,
    page,
    // refetch,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    markSelectedAsRead,
    deleteNotification,
  }
}
