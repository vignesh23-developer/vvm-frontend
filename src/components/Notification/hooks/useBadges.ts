import { useState, useEffect, useCallback, useRef } from 'react'
import { getMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'
import { getSSEService, SSEEventType } from '@/services/sse.service'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'

// ============================================
// TYPES
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

export interface BuyerBadges {
  role: 'BUYER'
  notifications: number
  favorites: number
  enquiriesWithResponses: number
}

export interface AgentBadges {
  role: 'AGENT'
  notifications: number
  newEnquiries: number
  walletBalance: number
  subscriptionDaysRemaining?: number
  subscriptionExpiringSoon?: boolean
}

export interface AdminModerationBadges {
  pendingProperties: number
  reportedProperties: number
  pendingAds: number
  reportedAds: number
  kycRequests: number
}

export interface AdminBadges {
  role: 'ADMIN'
  notifications: number
  moderation: AdminModerationBadges
  totalPendingActions: number
}

export interface BadgeCountsResponse {
  role: 'BUYER' | 'AGENT' | 'ADMIN'
  buyer?: BuyerBadges
  agent?: AgentBadges
  admin?: AdminBadges
}

interface UseBadgesOptions {
  enableSSE?: boolean
  enableFetch?: boolean // Allow disabling fetch for testing
}

// ============================================
// HOOK
// ============================================

export function useBadges(options: UseBadgesOptions = {}) {
  const { enableSSE = true, enableFetch = true } = options
  const { user, token } = useAuth()

  const [badges, setBadges] = useState<BadgeCountsResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const sseSubscriptionRef = useRef<string | null>(null)
  const hasFetchedRef = useRef(false)

  // ============================================
  // FETCH INITIAL BADGES
  // ============================================

  const fetchBadges = useCallback(async () => {
    if (!user || !token) return

    try {
      setLoading(true)
      setError(null)

      const response = await getMethod<BadgeCountsResponse>(appEndpoints.getBadges)
      console.log('Fetched badges:', response)

      if (response.error) {
        // Don't show error to user, just log it - badges are not critical
        console.warn('Failed to fetch badges:', response.message)
        setError(null) // Don't set error state to avoid UI disruption
        return
      }

      if (response.data) {
        setBadges(response.data)
      }
    } catch (err) {
      // Silently fail - badges are enhancement, not critical functionality
      console.warn('Error fetching badges:', err)
    } finally {
      setLoading(false)
    }
  }, [user, token])

  // ============================================
  // FETCH ON MOUNT (only once per session)
  // ============================================

  useEffect(() => {
    if (user && token && enableFetch && !hasFetchedRef.current) {
      hasFetchedRef.current = true
      fetchBadges()
    }

    if (!user || !token) {
      // Clear badges and reset fetch flag on logout
      setBadges(null)
      hasFetchedRef.current = false
    }
  }, [user, token, enableFetch, fetchBadges])

  // ============================================
  // SSE SUBSCRIPTION FOR REAL-TIME UPDATES
  // Reuses existing SSE connection from useNotification
  // ============================================

  useEffect(() => {
    // Don't create new SSE subscription if disabled or no user
    if (!enableSSE || !user || !token) {
      if (sseSubscriptionRef.current) {
        try {
          const sseService = getSSEService()
          sseService.unsubscribe(sseSubscriptionRef.current)
        } catch (err) {
          // Ignore unsubscribe errors
        }
        sseSubscriptionRef.current = null
      }
      return
    }

    // Only subscribe to badge_update events
    // Don't pass token here - let existing SSE connection handle it
    // This avoids creating duplicate connections
    try {
      const sseService = getSSEService()

      // Check if SSE is already connected (by useNotification hook)
      // If not connected, don't try to connect - let useNotification handle it
      const isConnected = sseService.getConnectionStatus()

      if (!isConnected) {
        // SSE not connected yet, skip subscription for now
        // The badge updates will come through once useNotification establishes connection
        console.log('useBadges: SSE not connected, waiting for useNotification to establish connection')
        return
      }

      // Subscribe to badge_update events (connection already established)
      const subscriptionId = sseService.subscribe(
        message => {
          if (message.event === 'badge_update' && message.data) {
            const { type, count, badges: multipleBadges } = message.data

            setBadges(prev => {
              if (!prev) return prev

              // Handle multiple badge updates
              if (multipleBadges && typeof multipleBadges === 'object') {
                return updateMultipleBadges(prev, multipleBadges)
              }

              // Handle single badge update
              if (type && count !== undefined) {
                return updateSingleBadge(prev, type as BadgeType, count)
              }

              return prev
            })
          }
        },
        'badge_update' as SSEEventType,
        undefined, // Don't pass token - reuse existing connection
      )

      sseSubscriptionRef.current = subscriptionId
    } catch (err) {
      // SSE subscription failed - not critical, badges will still work via fetch
      console.warn('useBadges: SSE subscription failed, falling back to fetch-only mode')
    }

    // Cleanup on unmount
    return () => {
      if (sseSubscriptionRef.current) {
        try {
          const sseService = getSSEService()
          sseService.unsubscribe(sseSubscriptionRef.current)
        } catch (err) {
          // Ignore cleanup errors
        }
        sseSubscriptionRef.current = null
      }
    }
  }, [enableSSE, user, token])

  // ============================================
  // LISTEN FOR GLOBAL BADGE UPDATE EVENTS
  // This catches badge updates dispatched by useNotification
  // ============================================

  useEffect(() => {
    const handleBadgeUpdate = (event: CustomEvent) => {
      const { type, count, badges: multipleBadges } = event.detail || {}

      setBadges(prev => {
        if (!prev) return prev

        if (multipleBadges && typeof multipleBadges === 'object') {
          return updateMultipleBadges(prev, multipleBadges)
        }

        if (type && count !== undefined) {
          return updateSingleBadge(prev, type as BadgeType, count)
        }

        return prev
      })
    }

    // Listen for badge updates from useNotification or other sources
    window.addEventListener('badge-update', handleBadgeUpdate as EventListener)

    return () => {
      window.removeEventListener('badge-update', handleBadgeUpdate as EventListener)
    }
  }, [])

  // ============================================
  // UPDATE HELPERS
  // ============================================

  const updateSingleBadge = (prev: BadgeCountsResponse, type: BadgeType, count: number): BadgeCountsResponse => {
    const updated = { ...prev }

    switch (type) {
      case 'notifications':
        if (updated.buyer) updated.buyer = { ...updated.buyer, notifications: count }
        if (updated.agent) updated.agent = { ...updated.agent, notifications: count }
        if (updated.admin) updated.admin = { ...updated.admin, notifications: count }
        break

      case 'favorites':
        if (updated.buyer) updated.buyer = { ...updated.buyer, favorites: count }
        break

      case 'enquiries_sent':
        if (updated.buyer) updated.buyer = { ...updated.buyer, enquiriesWithResponses: count }
        break

      case 'new_enquiries':
        if (updated.agent) updated.agent = { ...updated.agent, newEnquiries: count }
        break

      case 'wallet_balance':
        if (updated.agent) updated.agent = { ...updated.agent, walletBalance: count }
        break

      case 'pending_properties':
        if (updated.admin?.moderation) {
          updated.admin = {
            ...updated.admin,
            moderation: { ...updated.admin.moderation, pendingProperties: count },
            totalPendingActions: recalculateTotalPending({
              ...updated.admin.moderation,
              pendingProperties: count,
            }),
          }
        }
        break

      case 'reported_properties':
        if (updated.admin?.moderation) {
          updated.admin = {
            ...updated.admin,
            moderation: { ...updated.admin.moderation, reportedProperties: count },
            totalPendingActions: recalculateTotalPending({
              ...updated.admin.moderation,
              reportedProperties: count,
            }),
          }
        }
        break

      case 'pending_ads':
        if (updated.admin?.moderation) {
          updated.admin = {
            ...updated.admin,
            moderation: { ...updated.admin.moderation, pendingAds: count },
            totalPendingActions: recalculateTotalPending({
              ...updated.admin.moderation,
              pendingAds: count,
            }),
          }
        }
        break

      case 'reported_ads':
        if (updated.admin?.moderation) {
          updated.admin = {
            ...updated.admin,
            moderation: { ...updated.admin.moderation, reportedAds: count },
            totalPendingActions: recalculateTotalPending({
              ...updated.admin.moderation,
              reportedAds: count,
            }),
          }
        }
        break

      case 'kyc_requests':
        if (updated.admin?.moderation) {
          updated.admin = {
            ...updated.admin,
            moderation: { ...updated.admin.moderation, kycRequests: count },
            totalPendingActions: recalculateTotalPending({
              ...updated.admin.moderation,
              kycRequests: count,
            }),
          }
        }
        break
    }

    return updated
  }

  const updateMultipleBadges = (prev: BadgeCountsResponse, updates: Partial<Record<BadgeType, number>>): BadgeCountsResponse => {
    let updated = { ...prev }

    for (const [type, count] of Object.entries(updates)) {
      if (count !== undefined) {
        updated = updateSingleBadge(updated, type as BadgeType, count)
      }
    }

    return updated
  }

  const recalculateTotalPending = (moderation: AdminModerationBadges): number => {
    return moderation.pendingProperties + moderation.reportedProperties + moderation.pendingAds + moderation.reportedAds + moderation.kycRequests
  }

  // ============================================
  // OPTIMISTIC UPDATE METHODS
  // ============================================

  const incrementBadge = useCallback((type: BadgeType, amount: number = 1) => {
    setBadges(prev => {
      if (!prev) return prev
      const currentCount = getBadgeCount(prev, type)
      return updateSingleBadge(prev, type, currentCount + amount)
    })
  }, [])

  const decrementBadge = useCallback((type: BadgeType, amount: number = 1) => {
    setBadges(prev => {
      if (!prev) return prev
      const currentCount = getBadgeCount(prev, type)
      return updateSingleBadge(prev, type, Math.max(0, currentCount - amount))
    })
  }, [])

  const getBadgeCount = (badges: BadgeCountsResponse, type: BadgeType): number => {
    switch (type) {
      case 'notifications':
        return badges.buyer?.notifications ?? badges.agent?.notifications ?? badges.admin?.notifications ?? 0
      case 'favorites':
        return badges.buyer?.favorites ?? 0
      case 'enquiries_sent':
        return badges.buyer?.enquiriesWithResponses ?? 0
      case 'new_enquiries':
        return badges.agent?.newEnquiries ?? 0
      case 'wallet_balance':
        return badges.agent?.walletBalance ?? 0
      case 'pending_properties':
        return badges.admin?.moderation.pendingProperties ?? 0
      case 'reported_properties':
        return badges.admin?.moderation.reportedProperties ?? 0
      case 'pending_ads':
        return badges.admin?.moderation.pendingAds ?? 0
      case 'reported_ads':
        return badges.admin?.moderation.reportedAds ?? 0
      case 'kyc_requests':
        return badges.admin?.moderation.kycRequests ?? 0
      default:
        return 0
    }
  }

  // ============================================
  // RETURN
  // ============================================

  return {
    badges,
    loading,
    error,
    refetch: fetchBadges,
    incrementBadge,
    decrementBadge,

    // Convenience getters (with safe defaults)
    role: badges?.role,

    // Common
    notifications: badges?.buyer?.notifications ?? badges?.agent?.notifications ?? badges?.admin?.notifications ?? 0,

    // Buyer specific
    favorites: badges?.buyer?.favorites ?? 0,
    enquiriesWithResponses: badges?.buyer?.enquiriesWithResponses ?? 0,

    // Agent specific
    newEnquiries: badges?.agent?.newEnquiries ?? 0,
    walletBalance: badges?.agent?.walletBalance ?? 0,
    subscriptionDaysRemaining: badges?.agent?.subscriptionDaysRemaining,
    subscriptionExpiringSoon: badges?.agent?.subscriptionExpiringSoon ?? false,

    // Admin specific
    moderation: badges?.admin?.moderation,
    totalPendingActions: badges?.admin?.totalPendingActions ?? 0,
  }
}
