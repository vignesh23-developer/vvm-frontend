'use client'

import { useEffect, useRef } from 'react'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import { getSSEService } from '@/services/sse.service'
import { useNotification } from './hooks/useNotification'
import { Notification } from './types'

/**
 * GlobalNotificationListener Component
 * 
 * Handles global SSE notification listening and toast display
 * - Only activates when user is logged in and auth is ready
 * - Maintains SSE connection for real-time notifications
 * - Shows toast notifications (max 3 at a time with queue)
 * - Refetches unread count from backend when notification arrives
 * - Marks notification as read when toast is clicked
 */
export default function GlobalNotificationListener() {
  const { user, token, loading: authLoading } = useAuth()
  const { fetchUnreadCount, markAsRead } = useNotification({
    enableSSE: false, // We handle SSE subscription manually here
    initialLimit: 1,
  })
  
  const sseSubscriptionRef = useRef<string | null>(null)
  const activeToastsRef = useRef<string[]>([]) // Max 3 toast IDs
  // Store functions in refs to avoid dependency issues
  const fetchUnreadCountRef = useRef(fetchUnreadCount)
  const markAsReadRef = useRef(markAsRead)

  // Update refs when functions change
  useEffect(() => {
    fetchUnreadCountRef.current = fetchUnreadCount
    markAsReadRef.current = markAsRead
  }, [fetchUnreadCount, markAsRead])

  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) {
      return
    }

    // Only activate SSE when user is logged in and has a valid token
    if (!user || !token) {
      // Cleanup if user logs out
      if (sseSubscriptionRef.current) {
        const sseService = getSSEService()
        sseService.unsubscribe(sseSubscriptionRef.current)
        sseSubscriptionRef.current = null
      }
      // Clear toast queue on logout
      activeToastsRef.current.forEach(toastId => toast.dismiss(toastId))
      activeToastsRef.current = []
      return
    }

    const sseService = getSSEService()

    // Subscribe to notification events
    const subscriptionId = sseService.subscribe(
      (message) => {
        if (message.event === 'notification' && message.data) {
          const notification = message.data as Notification

          // Manage toast queue - max 3 visible
          if (activeToastsRef.current.length >= 3) {
            // Dismiss the oldest toast
            const oldestToastId = activeToastsRef.current.shift()
            if (oldestToastId) {
              toast.dismiss(oldestToastId)
            }
          }

          // Show new toast notification
          const toastId = toast(
            (t) => (
              <div
                className="flex flex-col gap-1 cursor-pointer"
                onClick={async () => {
                  // Mark notification as read when toast is clicked
                  if (!notification.is_read) {
                    await markAsReadRef.current(notification.id)
                    // Refetch count after marking as read
                    fetchUnreadCountRef.current()
                  }
                  toast.dismiss(t.id)
                  // Remove from active toasts
                  activeToastsRef.current = activeToastsRef.current.filter(id => id !== t.id)
                }}
              >
                <div className="font-semibold text-sm">{notification.title}</div>
                <div className="text-xs text-gray-600">{notification.body}</div>
              </div>
            ),
            {
              duration: 5000,
              position: 'top-right',
            }
          )

          // Add to active toasts queue
          activeToastsRef.current.push(toastId)

          // Refetch unread count from backend (not manual update)
          fetchUnreadCountRef.current()
        }
      },
      'notification',
      token, // Pass token to auto-connect
    )

    sseSubscriptionRef.current = subscriptionId

    // Cleanup on unmount or when user/token changes
    return () => {
      if (subscriptionId) {
        sseService.unsubscribe(subscriptionId)
      }
    }
  }, [user, token, authLoading]) // Only depend on user, token, and authLoading

  // This component doesn't render anything
  return null
}

