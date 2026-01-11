import { useState, useEffect, useCallback, useRef } from 'react'
import { getMethod, patchMethod, postMethod, deleteMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'
import { getSSEService, SSEEventType } from '@/services/sse.service'
import { Notification, NotificationListResponse, NotificationFilterParams, UnreadCountResponse } from '../types'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'

// ============================================
// BADGE TYPES
// ============================================

export type BadgeType =
  | 'notifications'
  | 'favorites'
  | 'enquiries_sent'
  | 'new_enquiries'
  | 'wallet_balance'
  | 'pending_properties'
  | 'reported_properties'
  | 'pending_ads'
  | 'reported_ads'
  | 'kyc_requests'

export interface BadgeUpdateData {
  type?: BadgeType
  count?: number
  badges?: Partial<Record<BadgeType, number>>
  timestamp: string
}

interface UseNotificationOptions {
  initialPage?: number
  initialLimit?: number
  enableSSE?: boolean
  onBadgeUpdate?: (type: BadgeType, count: number) => void
}

/**
 * Custom hook to fetch and manage user notifications with SSE support
 * - Fetches notifications only when explicitly called (no auto-polling)
 * - Uses SSE to receive new notifications AND badge updates in real-time
 * - Only connects SSE when user is logged in
 */
export function useNotification(options: UseNotificationOptions = {}) {
  const {
    initialPage = 1,
    initialLimit = 20,
    enableSSE = true,
    onBadgeUpdate
  } = options
  const { user, token } = useAuth()

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(initialPage)
  const [total, setTotal] = useState(0)
  const sseSubscriptionRef = useRef<string | null>(null)
  const badgeSubscriptionRef = useRef<string | null>(null)

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
        setNotifications(prev => prev.map(notif => ({ ...notif, is_read: true, read_at: new Date().toISOString() })))
        setUnreadCount(0)
        await fetchUnreadCount()
        window.dispatchEvent(new CustomEvent('notifications-marked-all-read'))
        return response.data.markedCount || 0
      }
      return 0
    } catch (err) {
      console.error('Error marking all notifications as read:', err)
      return 0
    }
  }, [fetchUnreadCount])

  const markSelectedAsRead = useCallback(async (notificationIds: string[]) => {
    try {
      const response = await postMethod<{ success: boolean; markedCount: number }>(appEndpoints.markMultipleAsRead, {
        notificationIds,
      })

      if (!response.error && response.data?.success) {
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

  // SSE Setup - Listen for real-time notifications AND badge updates
  useEffect(() => {
    if (!enableSSE || !user || !token) {
      // Disconnect if user logs out
      if (sseSubscriptionRef.current) {
        const sseService = getSSEService()
        sseService.unsubscribe(sseSubscriptionRef.current)
        sseSubscriptionRef.current = null
      }
      if (badgeSubscriptionRef.current) {
        const sseService = getSSEService()
        sseService.unsubscribe(badgeSubscriptionRef.current)
        badgeSubscriptionRef.current = null
      }
      return
    }

    const sseService = getSSEService()

    // Subscribe to notification events
    const notificationSubId = sseService.subscribe(
      (message) => {
        if (message.event === 'notification' && message.data) {
          const newNotification = message.data as Notification

          setNotifications(prev => {
            const exists = prev.some(n => n.id === newNotification.id)
            if (exists) {
              return prev.map(n => (n.id === newNotification.id ? newNotification : n))
            }
            return [newNotification, ...prev]
          })

          if (!newNotification.is_read) {
            fetchUnreadCount()
          }
        }
      },
      'notification' as SSEEventType,
      token,
    )

    sseSubscriptionRef.current = notificationSubId

    // Subscribe to badge_update events
    const badgeSubId = sseService.subscribe(
      (message) => {
        if (message.event === 'badge_update' && message.data) {
          const badgeData = message.data as BadgeUpdateData

          // Handle multiple badges
          if (badgeData.badges && typeof badgeData.badges === 'object') {
            Object.entries(badgeData.badges).forEach(([type, count]) => {
              if (count !== undefined) {
                // Update notification count locally if it's the notifications badge
                if (type === 'notifications') {
                  setUnreadCount(count)
                }
                // Call callback for other components
                if (onBadgeUpdate) {
                  onBadgeUpdate(type as BadgeType, count)
                }
                // Dispatch custom event for global listeners
                window.dispatchEvent(new CustomEvent('badge-update', {
                  detail: { type, count }
                }))
              }
            })
          }
          // Handle single badge update
          else if (badgeData.type && badgeData.count !== undefined) {
            if (badgeData.type === 'notifications') {
              setUnreadCount(badgeData.count)
            }
            if (onBadgeUpdate) {
              onBadgeUpdate(badgeData.type, badgeData.count)
            }
            window.dispatchEvent(new CustomEvent('badge-update', {
              detail: { type: badgeData.type, count: badgeData.count }
            }))
          }
        }
      },
      'badge_update' as SSEEventType,
      token,
    )

    badgeSubscriptionRef.current = badgeSubId

    // Cleanup on unmount or when user/token changes
    return () => {
      if (notificationSubId) {
        sseService.unsubscribe(notificationSubId)
      }
      if (badgeSubId) {
        sseService.unsubscribe(badgeSubId)
      }
    }
  }, [enableSSE, user, token, fetchUnreadCount, onBadgeUpdate])

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