'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { useBadges, BadgeType, BadgeCountsResponse, AdminModerationBadges } from '@/components/Notification/hooks/useBadges'

interface NavbarContextType {
  badges: BadgeCountsResponse | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  
  incrementBadge: (type: BadgeType, amount?: number) => void
  decrementBadge: (type: BadgeType, amount?: number) => void
  
  role: 'BUYER' | 'AGENT' | 'ADMIN' | undefined
  
  notifications: number
  
  favorites: number
  enquiriesWithResponses: number
  
  newEnquiries: number
  walletBalance: number
  subscriptionDaysRemaining?: number
  subscriptionExpiringSoon: boolean
  
  moderation?: AdminModerationBadges
  totalPendingActions: number
}

const NavbarContext = createContext<NavbarContextType | undefined>(undefined)

interface NavbarProviderProps {
  children: ReactNode
}

export function NavbarProvider({ children }: NavbarProviderProps) {
  const badgesHook = useBadges({ enableSSE: true })

  return (
    <NavbarContext.Provider value={badgesHook}>
      {children}
    </NavbarContext.Provider>
  )
}

export function useNavbarBadges(): NavbarContextType {
  const context = useContext(NavbarContext)
  
  if (context === undefined) {
    throw new Error('useNavbarBadges must be used within a NavbarProvider')
  }
  
  return context
}


export function useNavbarBadgesSafe(): NavbarContextType | null {
  const context = useContext(NavbarContext)
  return context ?? null
}