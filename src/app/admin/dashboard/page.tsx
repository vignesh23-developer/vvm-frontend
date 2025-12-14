'use client'

import React from 'react'
import { Users, FileText, Home, ChartBar, Eye, Wallet, BadgeCheck, Tag, HatGlasses } from 'lucide-react'
import { useDashboardHook } from './(hooks)/useDashboardHook'
import {
  ResponsiveContainer,
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart as RePieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import formatName from '@/utils/converter/formatName'

// Stat Card Component

type IconComponent = React.ComponentType<{ size?: number }>

function StatCard({ label, value, Icon }: { label: string; value: string | number; Icon?: IconComponent }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-yellow-100 bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(42,20,7,0.08)]">
      <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-gradient-to-br from-yellow-50 to-orange-50 opacity-50 blur-2xl transition-all group-hover:scale-150" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</p>
          <p className="mt-2 text-3xl font-extrabold text-[#2a1407]">{value}</p>
        </div>
        {Icon ? (
          <div className="rounded-xl bg-[#FFF8E8] p-3 text-yellow-700 shadow-sm ring-1 ring-yellow-100 transition-colors duration-300 group-hover:bg-[#2a1407] group-hover:text-yellow-400">
            <Icon size={24} />
          </div>
        ) : null}
      </div>
    </div>
  )
}

function Skeleton({ className }: { className?: string }) {
  return <div className={'animate-pulse rounded-lg bg-yellow-100/70 ' + (className ?? '')} />
}

function DashboardSkeleton() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-50 p-6">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <header className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-7 w-56" />
            <Skeleton className="h-4 w-80" />
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-yellow-200 bg-gradient-to-br from-white to-yellow-50/30 p-5 shadow-sm">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="mt-3 h-8 w-20" />
              <div className="mt-4 flex justify-end">
                <Skeleton className="h-12 w-12 rounded-lg" />
              </div>
            </div>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border border-yellow-200 bg-gradient-to-br from-white to-yellow-50/20 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-yellow-200 bg-gradient-to-br from-white to-yellow-50/30 p-5 shadow-sm">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="mt-3 h-7 w-16" />
                </div>
              ))}
            </div>

            <div className="mt-4 h-60 rounded-md border border-dashed border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100/30 p-3">
              <Skeleton className="h-full w-full rounded-md bg-yellow-200/40" />
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-yellow-200 bg-gradient-to-br from-white to-yellow-50/20 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-44" />
                <Skeleton className="h-5 w-5 rounded-full" />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded-xl border border-yellow-200 bg-white/70 p-3">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="mt-2 h-6 w-16" />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-yellow-200 bg-gradient-to-br from-white to-yellow-50/20 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-5 w-5 rounded-full" />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded-xl border border-yellow-200 bg-white/70 p-3">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="mt-2 h-6 w-14" />
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-yellow-200 bg-gradient-to-br from-white to-yellow-50/20 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-6 w-20" />
            </div>
            <div className="mt-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-yellow-200 bg-white/70 px-3 py-3">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="mt-2 h-3 w-64" />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-yellow-200 bg-gradient-to-br from-white to-yellow-50/20 p-6 shadow-sm">
            <Skeleton className="h-5 w-40" />
            <div className="mt-4 grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-yellow-200 bg-white/70 p-3">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="mt-2 h-6 w-16" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const { dashboardData, error, isLoading, handleRefresh } = useDashboardHook()

  const [financeSelection, setFinanceSelection] = React.useState<'WALLET' | 'SUBSCRIPTION'>('WALLET')
  const [propertyAdSelection, setPropertyAdSelection] = React.useState<'PROPERTIES' | 'ADS'>('PROPERTIES')
  const [statusMetricSelection, setStatusMetricSelection] = React.useState<'APPROVAL' | 'STATUS'>('APPROVAL')
  const [transactionFilter, setTransactionFilter] = React.useState<'ALL' | 'CREDIT' | 'DEBIT'>('ALL')

  type DashboardRole = 'ADMIN' | 'AGENT' | 'BUYER' | string

  type RecentEnquiry = {
    id: string
    name: string
    entityType: string
    status: string
    createdAt: string
  }

  type WalletSummary = {
    balance?: number
    lifetimeCredited?: number
    lifetimeDebited?: number
    lifetimeExpired?: number
  }

  type SubscriptionSummary = {
    hasActiveSubscription?: boolean
    planName?: string
    startDate?: string
    endDate?: string
    daysRemaining?: number
    status?: string
  }

  type WalletTransaction = {
    id: string
    type?: 'CREDIT' | 'DEBIT' | string
    source?: string
    amount?: number
    balanceAfter?: number
    description?: string
    createdAt?: string
  }

  type AgentDashboard = {
    propertyStats?: {
      total?: number
      active?: number
      sold?: number
      rented?: number
      byApprovalStatus?: { approved?: number; underReview?: number; rejected?: number }
      byStatus?: { available?: number; rented?: number; sold?: number; withdrawn?: number }
      byListingType?: { sale?: number; rent?: number; lease?: number }
    }
    adStats?: {
      total?: number
      active?: number
      sold?: number
      byApprovalStatus?: { approved?: number; underReview?: number; rejected?: number }
      byStatus?: { available?: number; reserved?: number; sold?: number }
    }
    engagementStats?: { totalViews?: number; totalFavorites?: number; totalContacts?: number; totalClicks?: number }
    enquiryStats?: { total?: number; newLast7Days?: number }
    // legacy/compat (if backend response is flattened)
    propertyStatsByApprovalStatus?: { approved?: number; underReview?: number; rejected?: number }
    adStatsByApprovalStatus?: { approved?: number; underReview?: number; rejected?: number }
    propertyStatsByListingType?: { sale?: number; rent?: number; lease?: number }
    recentEnquiries?: RecentEnquiry[]

    recentTransactions?: WalletTransaction[]

    wallet?: WalletSummary
    subscription?: SubscriptionSummary
  }

  // admin dashboard types
  type AdminDashboard = {
    adStats?: {
      total?: number
      byApprovalStatus?: { approved?: number; underReview?: number; rejected?: number }
      byStatus?: { available?: number; reserved?: number; sold?: number }
    }
    engagementStats?: { totalAdViews?: number; totalPropertyViews?: number; totalEnquiries?: number; totalFavorites?: number }
    moderationStats?: {
      adApprovalsTotal?: number
      adReportsPending?: number
      highSeverityReports?: number
      propertyApprovalsTotal?: number
      propertyReportsPending?: number
    }
    propertyStats?: {
      total?: number
      published?: number
      draft?: number
      byApprovalStatus?: { approved?: number; underReview?: number; rejected?: number }
      byStatus?: { available?: number; rented?: number; sold?: number; withdrawn?: number }
    }
    recentActivities?: unknown[]
    recentUsers?: Array<{
      id: string
      firstName?: string
      lastName?: string
      avatarUrl?: string
      email?: string
      roles?: []
      createdAt?: string
    }>
    recentPayments?: Array<{
      id?: string
      orderNumber?: string
      purpose?: string
      status?: string
      amount?: number
      createdAt?: string
    }>
    revenueStats?: {
      totalRevenue?: number
      revenueLast30Days?: number
      totalOrders?: number
      completedOrders?: number
      byPurpose?: {
        subscription?: number
        wallet?: number
        boost?: number
        topListing?: number
      }
    }
    // Some backends may expose this as recentAgents; treat it similarly.
    recentAgents?: Array<{
      id: string
      firstName?: string
      lastName?: string
      avatarUrl?: string
      email?: string
      roles?: []
      createdAt?: string
    }>
    userStats?: {
      total?: number
      newLast7Days?: number
      newLast30Days?: number
      kycVerified?: number
      kycPending?: number
      byRole?: { admins?: number; agents?: number; buyers?: number }
    }
    subscriptionStats?: {
      activeSubscriptions?: number
      expiringSoon?: number
    }
    propertyStatsByApprovalStatus?: { approved?: number; underReview?: number; rejected?: number }
    adStatsByApprovalStatus?: { approved?: number; underReview?: number; rejected?: number }
  }

  type BuyerDashboard = {
    enquiryStats?: { total?: number; closedCount?: number; newCount?: number; respondedCount?: number }
    quickStats?: {
      savedSearches?: number
      enquiriesSent?: number
      favoriteAds?: number
      favoriteProperties?: number
      propertiesViewed?: number
    }
    recentFavorites?: {
      total?: number
    }
    recentViews?: {
      total?: number
    }

    wallet?: WalletSummary
  }

  type DashboardPayload = {
    userRole?: DashboardRole
    agent?: AgentDashboard
    buyer?: BuyerDashboard
    admin?: AdminDashboard
  } | null

  const payload = (dashboardData ?? null) as DashboardPayload
  const role = payload?.userRole ? String(payload.userRole).toUpperCase() : undefined
  const agent = payload?.agent
  const buyer = payload?.buyer
  const admin = payload?.admin

  const walletSummary = role === 'AGENT' ? agent?.wallet : role === 'BUYER' ? buyer?.wallet : undefined
  const subscriptionSummary = role === 'AGENT' ? agent?.subscription : undefined
  const hasSubscriptionData = role === 'AGENT' ? !!subscriptionSummary : role === 'ADMIN' ? !!admin?.subscriptionStats : false

  const effectiveFinanceSelection: 'WALLET' | 'SUBSCRIPTION' = role === 'AGENT' ? financeSelection : role === 'BUYER' ? 'WALLET' : 'SUBSCRIPTION'

  const selectedApprovalStatus =
    propertyAdSelection === 'ADS'
      ? role === 'AGENT'
        ? agent?.adStats?.byApprovalStatus ?? agent?.adStatsByApprovalStatus
        : admin?.adStats?.byApprovalStatus ?? admin?.adStatsByApprovalStatus
      : role === 'AGENT'
      ? agent?.propertyStats?.byApprovalStatus ?? agent?.propertyStatsByApprovalStatus
      : admin?.propertyStats?.byApprovalStatus ?? admin?.propertyStatsByApprovalStatus

  const selectedByStatus =
    propertyAdSelection === 'ADS'
      ? role === 'AGENT'
        ? agent?.adStats?.byStatus
        : admin?.adStats?.byStatus
      : role === 'AGENT'
      ? agent?.propertyStats?.byStatus
      : admin?.propertyStats?.byStatus

  const hasByStatusSupport = role === 'AGENT' || role === 'ADMIN' ? !!selectedByStatus : false

  const approvalStatusTiles =
    role === 'AGENT' || role === 'ADMIN'
      ? [
          { label: 'Approved', value: selectedApprovalStatus?.approved ?? 0 },
          { label: 'Under Review', value: selectedApprovalStatus?.underReview ?? 0 },
          { label: 'Rejected', value: selectedApprovalStatus?.rejected ?? 0 },
        ]
      : []

  const byStatusTiles =
    role === 'AGENT' || role === 'ADMIN'
      ? propertyAdSelection === 'ADS'
        ? [
            { label: 'Available', value: (selectedByStatus as { available?: number } | undefined)?.available ?? 0 },
            { label: 'Reserved', value: (selectedByStatus as { reserved?: number } | undefined)?.reserved ?? 0 },
            { label: 'Sold', value: (selectedByStatus as { sold?: number } | undefined)?.sold ?? 0 },
          ]
        : [
            { label: 'Available', value: (selectedByStatus as { available?: number } | undefined)?.available ?? 0 },
            { label: 'Rented', value: (selectedByStatus as { rented?: number } | undefined)?.rented ?? 0 },
            { label: 'Sold', value: (selectedByStatus as { sold?: number } | undefined)?.sold ?? 0 },
            { label: 'Withdrawn', value: (selectedByStatus as { withdrawn?: number } | undefined)?.withdrawn ?? 0 },
          ]
      : []

  const propertyAdsStatusTiles = statusMetricSelection === 'STATUS' && hasByStatusSupport ? byStatusTiles : approvalStatusTiles

  const financeTiles =
    effectiveFinanceSelection === 'WALLET'
      ? [
          { label: 'Balance', value: walletSummary?.balance ?? 0 },
          { label: 'Credited', value: walletSummary?.lifetimeCredited ?? 0 },
          { label: 'Debited', value: walletSummary?.lifetimeDebited ?? 0 },
          { label: 'Expired', value: walletSummary?.lifetimeExpired ?? 0 },
        ]
      : role === 'AGENT'
      ? [
          { label: 'Plan', value: subscriptionSummary?.planName ?? (subscriptionSummary?.hasActiveSubscription ? '-' : 'No active plan') },
          { label: 'Status', value: subscriptionSummary?.status ?? (subscriptionSummary?.hasActiveSubscription ? '-' : 'inactive') },
          { label: 'Days Left', value: subscriptionSummary?.daysRemaining ?? 0 },
          {
            label: 'Ends',
            value: subscriptionSummary?.endDate ? new Date(subscriptionSummary.endDate).toLocaleDateString() : '-',
          },
        ]
      : role === 'ADMIN'
      ? [
          { label: 'Active', value: admin?.subscriptionStats?.activeSubscriptions ?? 0 },
          { label: 'Expiring Soon', value: admin?.subscriptionStats?.expiringSoon ?? 0 },
        ]
      : []

  const title =
    role === 'ADMIN'
      ? `Welcome Back, ${formatName(user?.firstName) + ' ' + formatName(user?.lastName) || 'Admin Dashboard'}`
      : role === 'AGENT'
      ? `Welcome Back, ${formatName(user?.firstName) + ' ' + formatName(user?.lastName) || 'Agent Dashboard'}`
      : role === 'BUYER'
      ? `Welcome Back, ${formatName(user?.firstName) + ' ' + formatName(user?.lastName)}`
      : 'Dashboard'

  // stats
  const stats =
    role === 'AGENT'
      ? [
          { label: 'Total Properties', value: agent?.propertyStats?.total ?? 0, Icon: FileText },
          { label: 'Total Ads', value: agent?.adStats?.total ?? 0, Icon: Home },
          { label: 'Total Enquiries', value: agent?.enquiryStats?.total ?? 0, Icon: Users },
          { label: 'Total Views', value: agent?.engagementStats?.totalViews ?? 0, Icon: Eye },
        ]
      : role === 'BUYER'
      ? [
          { label: 'Saved Searches', value: buyer?.quickStats?.savedSearches ?? 0, Icon: FileText },
          { label: 'Favorites Properties', value: buyer?.quickStats?.favoriteProperties ?? 0, Icon: Home },
          { label: 'Favorites Ads', value: buyer?.quickStats?.favoriteAds ?? 0, Icon: Users },
          { label: 'Enquiries Sent', value: buyer?.quickStats?.enquiriesSent ?? 0, Icon: ChartBar },
        ]
      : role === 'ADMIN'
      ? [
          { label: 'Total Users', value: admin?.userStats?.total ?? 0, Icon: Users },
          { label: 'Total Properties', value: admin?.propertyStats?.total ?? 0, Icon: FileText },
          { label: 'Total Ads', value: admin?.adStats?.total ?? 0, Icon: Tag },
          { label: 'Total Agents', value: admin?.userStats?.byRole?.agents ?? 0, Icon: HatGlasses },
        ]
      : [
          { label: 'Total Properties', value: 0, Icon: FileText },
          { label: 'Active Properties', value: 0, Icon: Home },
          { label: 'Total Enquiries', value: 0, Icon: Users },
          { label: 'Total Views', value: 0, Icon: ChartBar },
        ]

  const getStringField = (value: unknown, keys: string[]) => {
    if (!value || typeof value !== 'object') return undefined
    const record = value as Record<string, unknown>
    for (const key of keys) {
      const v = record[key]
      if (typeof v === 'string' && v.trim()) return v
    }
    return undefined
  }

  const getDateField = (value: unknown, keys: string[]) => {
    const raw = getStringField(value, keys)
    if (!raw) return undefined
    const d = new Date(raw)
    return Number.isNaN(d.getTime()) ? undefined : d
  }

  const recentItems =
    role === 'AGENT'
      ? (agent?.recentEnquiries ?? []).map(item => {
          const date = item.createdAt ? new Date(item.createdAt) : null
          return {
            id: item.id,
            title: item.name,
            meta: `${item.entityType} • ${item.status}${date ? ` • ${date.toLocaleDateString()}` : ''}`,
          }
        })
      : role === 'BUYER'
      ? [
          {
            id: 'buyer-favorites',
            title: 'Favorites',
            meta: `Total: ${buyer?.recentFavorites?.total ?? 0}`,
          },
          {
            id: 'buyer-views',
            title: 'Views',
            meta: `Total: ${buyer?.recentViews?.total ?? 0}`,
          },
          {
            id: 'buyer-enquiries',
            title: 'Enquiries',
            meta: `Total: ${buyer?.enquiryStats?.total ?? 0} • New: ${buyer?.enquiryStats?.newCount ?? 0} • Responded: ${
              buyer?.enquiryStats?.respondedCount ?? 0
            }`,
          },
        ]
      : []

  const getRoleLabel = (roles?: string[] | string): string => {
    const roleArray = Array.isArray(roles) ? roles : [roles]

    if (roleArray.length >= 3) return 'ADMIN'
    if (roleArray.length >= 2) return 'AGENT'
    if (roleArray.length > 0) return 'BUYER'
    return 'BUYER'
  }

  const isBuyerOrAgent = (roles?: string[] | string) => {
    const roleArray = Array.isArray(roles) ? roles : roles ? [roles] : []
    return roleArray.length > 0 && roleArray.length < 3
  }
  const adminRecentUsers =
    role === 'ADMIN'
      ? (() => {
          const candidates = (admin?.recentAgents ?? admin?.recentUsers ?? []).slice(0, 10)

          // Include BUYER + AGENT, exclude ADMIN
          const buyerAndAgents = candidates.filter(u => isBuyerOrAgent(u.roles))

          const rows = buyerAndAgents.map((u, index) => {
            const firstName = (u.firstName ?? '').trim()
            const lastName = (u.lastName ?? '').trim()
            const fullName = `${firstName} ${lastName}`.trim()
            const email = (u.email ?? '').trim()

            const roleLabel = getRoleLabel(u.roles)
            const createdAt = u.createdAt ? new Date(u.createdAt) : null

            const initials = `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.trim() || email?.[0]?.toUpperCase() || 'U'

            return {
              id: u.id ?? `${index}`,
              fullName: fullName || 'User',
              email,
              roleLabel,
              createdAt,
              avatarUrl: (u as { avatarUrl?: string }).avatarUrl,
              initials,
            }
          })

          return rows
        })()
      : []

  const graphStats =
    role === 'AGENT'
      ? [
          { name: 'properties sold', value: agent?.propertyStats?.sold ?? 0 },
          { name: 'properties rented', value: agent?.propertyStats?.rented ?? 0 },
          { name: 'properties active', value: agent?.propertyStats?.active ?? 0 },
          { name: 'ads sold', value: agent?.adStats?.sold ?? 0 },
          { name: 'ads active', value: agent?.adStats?.active ?? 0 },
        ]
      : role === 'BUYER'
      ? [
          { name: 'Total', value: buyer?.enquiryStats?.total ?? 0 },
          { name: 'New Count', value: buyer?.enquiryStats?.newCount ?? 0 },
          { name: 'Closed Count', value: buyer?.enquiryStats?.closedCount ?? 0 },
          { name: 'Responded Count', value: buyer?.enquiryStats?.respondedCount ?? 0 },
        ]
      : role === 'ADMIN'
      ? [
          { name: 'Buyers', value: admin?.userStats?.byRole?.buyers ?? 0 },
          { name: 'Agents', value: admin?.userStats?.byRole?.agents ?? 0 },
          { name: 'KYC Verified', value: admin?.userStats?.kycVerified ?? 0 },
          { name: 'KYC Pending', value: admin?.userStats?.kycPending ?? 0 },
        ]
      : []

  const agentBarData = (() => {
    if (role !== 'AGENT') return []

    if (propertyAdSelection === 'PROPERTIES') {
      const listingType = agent?.propertyStats?.byListingType ?? agent?.propertyStatsByListingType
      return [
        { name: 'Sale', value: listingType?.sale ?? 0 },
        { name: 'Rent', value: listingType?.rent ?? 0 },
        { name: 'Lease', value: listingType?.lease ?? 0 },
      ]
    }

    const approval = selectedApprovalStatus
    return [
      { name: 'Approved', value: approval?.approved ?? 0 },
      { name: 'Under Review', value: approval?.underReview ?? 0 },
      { name: 'Rejected', value: approval?.rejected ?? 0 },
    ]
  })()

  const recentTransactions = (role === 'AGENT' ? agent?.recentTransactions ?? [] : [])
    .map(t => {
      const date = t.createdAt ? new Date(t.createdAt) : null
      return {
        id: t.id,
        type: t.type ?? '-',
        source: t.source ?? '',
        amount: typeof t.amount === 'number' ? t.amount : 0,
        balanceAfter: typeof t.balanceAfter === 'number' ? t.balanceAfter : undefined,
        description: t.description ?? '',
        createdAtLabel: date ? date.toLocaleString() : '',
      }
    })
    .filter(t => {
      if (transactionFilter === 'ALL') return true
      return t.type === transactionFilter
    })

  const buyerPieData = [
    { name: 'Total', value: buyer?.enquiryStats?.total ?? 0 },
    { name: 'New Count', value: buyer?.enquiryStats?.newCount ?? 0 },
    { name: 'Closed Count', value: buyer?.enquiryStats?.closedCount ?? 0 },
    { name: 'Responded Count', value: buyer?.enquiryStats?.respondedCount ?? 0 },
  ].filter(d => typeof d.value === 'number')

  const adminGraphData = [
    { name: 'Users', value: admin?.userStats?.total ?? 0 },
    { name: 'Agents', value: admin?.userStats?.byRole?.agents ?? 0 },
    { name: 'Properties', value: admin?.propertyStats?.total ?? 0 },
    { name: 'Activity', value: admin?.recentActivities?.length ?? 0 },
  ]

  const adminRolePieData =
    role === 'ADMIN'
      ? [
          { name: 'Admins', value: admin?.userStats?.byRole?.admins ?? 0 },
          { name: 'Agents', value: admin?.userStats?.byRole?.agents ?? 0 },
          { name: 'Buyers', value: admin?.userStats?.byRole?.buyers ?? 0 },
        ].filter(d => typeof d.value === 'number' && d.value > 0)
      : []

  const engagementMetrics =
    role === 'AGENT'
      ? [
          { label: 'Views', value: agent?.engagementStats?.totalViews ?? 0 },
          { label: 'Favorites', value: agent?.engagementStats?.totalFavorites ?? 0 },
          { label: 'Contacts', value: agent?.engagementStats?.totalContacts ?? 0 },
          { label: 'Clicks', value: agent?.engagementStats?.totalClicks ?? 0 },
        ]
      : role === 'ADMIN'
      ? [
          { label: 'Total Ad Views', value: admin?.engagementStats?.totalAdViews ?? 0 },
          { label: 'Total Enquiries', value: admin?.engagementStats?.totalEnquiries ?? 0 },
          { label: 'Total Favorites', value: admin?.engagementStats?.totalFavorites ?? 0 },
          { label: 'Total Property Views', value: admin?.engagementStats?.totalPropertyViews ?? 0 },
        ]
      : []

  const moderationTiles =
    role === 'ADMIN'
      ? [
          { label: 'Property Approvals', value: admin?.moderationStats?.propertyApprovalsTotal ?? 0 },
          { label: 'Ad Approvals', value: admin?.moderationStats?.adApprovalsTotal ?? 0 },
          { label: 'Property Reports Pending', value: admin?.moderationStats?.propertyReportsPending ?? 0 },
          { label: 'Ad Reports Pending', value: admin?.moderationStats?.adReportsPending ?? 0 },
          { label: 'High Severity Reports', value: admin?.moderationStats?.highSeverityReports ?? 0 },
        ]
      : []

  const hasModerationData = moderationTiles.some(t => (typeof t.value === 'number' ? t.value : 0) > 0)

  const adminRecentPayments = role === 'ADMIN' ? admin?.recentPayments ?? [] : []

  const adminRevenueStats = role === 'ADMIN' ? admin?.revenueStats : undefined
  const revenueTiles =
    role === 'ADMIN'
      ? [
          { label: 'Total Revenue', value: adminRevenueStats?.totalRevenue ?? 0 },
          { label: 'Revenue (Last 30 Days)', value: adminRevenueStats?.revenueLast30Days ?? 0 },
          { label: 'Total Orders', value: adminRevenueStats?.totalOrders ?? 0 },
          { label: 'Completed Orders', value: adminRevenueStats?.completedOrders ?? 0 },
        ]
      : []

  const revenueByPurpose = adminRevenueStats?.byPurpose
  const revenuePurposeRows =
    role === 'ADMIN'
      ? [
          { label: 'Subscription', value: revenueByPurpose?.subscription ?? 0 },
          { label: 'Wallet', value: revenueByPurpose?.wallet ?? 0 },
          { label: 'Boost', value: revenueByPurpose?.boost ?? 0 },
          { label: 'Top Listing', value: revenueByPurpose?.topListing ?? 0 },
        ]
      : []

  const shouldShowSkeleton = isLoading && !payload && !error

  if (shouldShowSkeleton) return <DashboardSkeleton />

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-50 p-6">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#2a1407]">{title}</h1>
            <p className="mt-1 text-sm text-gray-600">Overview of system activity and recent events</p>
          </div>
        </header>

        {isLoading && payload ? (
          <div className="rounded-2xl border border-yellow-200 bg-white p-4 text-sm text-gray-700">Refreshing dashboard…</div>
        ) : null}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-white p-4 text-sm text-red-700">
            Failed to load dashboard.
            <button type="button" onClick={handleRefresh} className="ml-2 underline">
              Retry
            </button>
          </div>
        )}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(s => (
            <StatCard key={s.label} label={s.label} value={s.value} Icon={s.Icon} />
          ))}
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border border-yellow-200 bg-gradient-to-br from-white to-yellow-50/20 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#2a1407]">Activity Feed</h2>
              <div className="text-sm text-gray-600">Last 7 days</div>
            </div>

            <div className={'mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 ' + (role === 'ADMIN' ? 'lg:grid-cols-4' : 'lg:grid-cols-3')}>
              {graphStats.map(stat => (
                <StatCard key={stat.name} label={stat.name} value={stat.value} />
              ))}
            </div>

            <div className="mt-4 h-60 rounded-md border border-dashed border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100/30 p-3">
              {role === 'AGENT' ? (
                <div className="h-full text-[#2a1407]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReBarChart data={agentBarData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#b45309" stopOpacity={1} />
                          <stop offset="100%" stopColor="#2a1407" stopOpacity={0.8} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                      <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                        cursor={{ fill: '#f3f4f6' }}
                      />
                      <Bar dataKey="value" fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={40} />
                    </ReBarChart>
                  </ResponsiveContainer>
                </div>
              ) : role === 'BUYER' ? (
                <div className="h-full text-[#2a1407]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                      <Pie
                        data={buyerPieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        stroke="none"
                      >
                        {buyerPieData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={['#2a1407', '#b45309', '#d97706', '#fbbf24'][index % 4]} />
                        ))}
                      </Pie>
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              ) : role === 'ADMIN' ? (
                <div className="h-full text-[#2a1407]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={adminGraphData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="lineMobile" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2a1407" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#2a1407" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                      <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#2a1407"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#2a1407', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6, fill: '#b45309' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-yellow-600">
                  <div className="flex flex-col items-center">
                    <ChartBar size={36} />
                    <p className="mt-3 text-sm">No chart available.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-6">
            {role === 'AGENT' || role === 'ADMIN' ? (
              <div className="rounded-2xl border border-yellow-200 bg-gradient-to-br from-white to-yellow-50/20 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[#2a1407]">Properties & Ads Status</h3>
                  <div className="flex items-center gap-2 text-yellow-700">
                    {propertyAdSelection === 'PROPERTIES' ? <Home size={18} /> : <Tag size={18} />}
                  </div>
                </div>
                <div className="mt-4 inline-flex w-full rounded-xl border border-yellow-200 bg-white/70 p-1">
                  <button
                    type="button"
                    onClick={() => setPropertyAdSelection('PROPERTIES')}
                    className={
                      'flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ' +
                      (propertyAdSelection === 'PROPERTIES' ? 'bg-yellow-100 text-[#2a1407]' : 'text-gray-700 hover:bg-yellow-50')
                    }
                  >
                    Properties
                  </button>
                  <button
                    type="button"
                    onClick={() => setPropertyAdSelection('ADS')}
                    className={
                      'flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ' +
                      (propertyAdSelection === 'ADS' ? 'bg-yellow-100 text-[#2a1407]' : 'text-gray-700 hover:bg-yellow-50')
                    }
                  >
                    Ads
                  </button>
                </div>

                <div className="mt-3 inline-flex w-full rounded-xl border border-yellow-200 bg-white/70 p-1">
                  <button
                    type="button"
                    onClick={() => setStatusMetricSelection('APPROVAL')}
                    className={
                      'flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ' +
                      (statusMetricSelection === 'APPROVAL' ? 'bg-yellow-100 text-[#2a1407]' : 'text-gray-700 hover:bg-yellow-50')
                    }
                  >
                    Approval
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusMetricSelection('STATUS')}
                    disabled={!hasByStatusSupport}
                    className={
                      'flex-1 rounded-lg px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ' +
                      (statusMetricSelection === 'STATUS' ? 'bg-yellow-100 text-[#2a1407]' : 'text-gray-700 hover:bg-yellow-50')
                    }
                  >
                    Status
                  </button>
                </div>
                {propertyAdsStatusTiles.length === 0 ? (
                  <div className="mt-4 text-sm text-gray-600">No data available.</div>
                ) : (
                  <div className={'mt-4 grid gap-3 ' + (propertyAdsStatusTiles.length === 4 ? 'grid-cols-2' : 'grid-cols-3')}>
                    {propertyAdsStatusTiles.map(tile => (
                      <div key={tile.label} className="rounded-xl border border-yellow-200 bg-white/70 p-3">
                        <div className="text-[10px] font-medium uppercase text-gray-600">{tile.label}</div>
                        <div className="mt-1 text-lg font-bold text-[#2a1407]">{tile.value}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}

            <div className="rounded-2xl border border-yellow-200 bg-gradient-to-br from-white to-yellow-50/20 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#2a1407]">
                  {role === 'ADMIN' ? 'Subscription' : role === 'BUYER' ? 'Wallet' : 'Wallet & Subscription'}
                </h3>
                <div className="flex items-center gap-2 text-yellow-700">
                  {effectiveFinanceSelection === 'WALLET' ? <Wallet size={18} /> : <BadgeCheck size={18} />}
                </div>
              </div>

              {role === 'AGENT' ? (
                <div className="mt-4 inline-flex w-full rounded-xl border border-yellow-200 bg-white/70 p-1">
                  <button
                    type="button"
                    onClick={() => setFinanceSelection('WALLET')}
                    className={
                      'flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ' +
                      (financeSelection === 'WALLET' ? 'bg-yellow-100 text-[#2a1407]' : 'text-gray-700 hover:bg-yellow-50')
                    }
                  >
                    Wallet
                  </button>
                  <button
                    type="button"
                    onClick={() => setFinanceSelection('SUBSCRIPTION')}
                    disabled={!hasSubscriptionData}
                    className={
                      'flex-1 rounded-lg px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ' +
                      (financeSelection === 'SUBSCRIPTION' ? 'bg-yellow-100 text-[#2a1407]' : 'text-gray-700 hover:bg-yellow-50')
                    }
                  >
                    Subscription
                  </button>
                </div>
              ) : null}

              {financeTiles.length === 0 ? (
                <div className="mt-4 text-sm text-gray-600">No data available.</div>
              ) : (
                <div className={'mt-4 grid gap-3 ' + (financeTiles.length > 2 ? 'grid-cols-2' : 'grid-cols-2')}>
                  {financeTiles.map(tile => (
                    <div key={tile.label} className="rounded-xl border border-yellow-200 bg-white/70 p-3">
                      <div className="text-xs font-medium uppercase text-gray-600">{tile.label}</div>
                      <div className="mt-1 text-xl font-bold text-[#2a1407]">{tile.value}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </section>

        {role === 'ADMIN' ? (
          <section className="grid grid-cols-1 gap-6 text-sm text-gray-600 lg:grid-cols-3">
            <div className="rounded-2xl border border-yellow-200 bg-gradient-to-br from-white to-yellow-50/20 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[#2a1407]">Moderation Queue</h2>
              <div className="mt-4">
                {!hasModerationData ? (
                  <p className="text-sm text-gray-600">No items in the moderation queue.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {moderationTiles.map(tile => (
                      <div key={tile.label} className="rounded-xl border border-yellow-200 bg-white/70 p-3">
                        <div className="text-xs font-medium uppercase text-gray-600">{tile.label}</div>
                        <div className="mt-1 text-xl font-bold text-[#2a1407]">{tile.value}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-yellow-200 bg-gradient-to-br from-white to-yellow-50/20 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#2a1407]">Users by Role</h3>
              {adminRolePieData.length === 0 ? (
                <div className="mt-4 text-sm text-gray-600">No data available.</div>
              ) : (
                <>
                  <div className="mt-4 h-56 text-[#2a1407]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Tooltip />
                        <Pie data={adminRolePieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                          {adminRolePieData.map((_, index) => (
                            <Cell key={index} fill="currentColor" fillOpacity={0.25 + index * 0.2} />
                          ))}
                        </Pie>
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-2">
                    {adminRolePieData.map(row => (
                      <div key={row.name} className="flex items-center justify-between rounded-xl border border-yellow-200 bg-white/70 px-3 py-2">
                        <div className="text-xs font-medium uppercase text-gray-600">{row.name}</div>
                        <div className="text-sm font-semibold text-[#2a1407]">{row.value}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="rounded-2xl border border-yellow-200 bg-gradient-to-br from-white to-yellow-50/20 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#2a1407]">Engagement Metrics</h3>
              {engagementMetrics.length === 0 ? (
                <div className="mt-4 text-sm text-gray-600">No metrics available.</div>
              ) : (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {engagementMetrics.map(metric => (
                    <div key={metric.label} className="rounded-xl border border-yellow-200 bg-white/70 p-3">
                      <div className="text-xs font-medium uppercase text-gray-600">{metric.label}</div>
                      <div className="mt-1 text-xl font-bold text-[#2a1407]">{metric.value}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        ) : null}

        {role === 'ADMIN' ? (
          <section className="rounded-2xl border border-yellow-200 bg-gradient-to-br from-white to-yellow-50/20 p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg font-semibold text-[#2a1407]">Revenue</h3>
              <div className="text-sm text-gray-600">Summary</div>
            </div>

            {revenueTiles.every(t => (typeof t.value === 'number' ? t.value : 0) === 0) &&
            revenuePurposeRows.every(t => (typeof t.value === 'number' ? t.value : 0) === 0) ? (
              <div className="mt-4 text-sm text-gray-600">No revenue data available.</div>
            ) : (
              <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="grid grid-cols-2 gap-3">
                  {revenueTiles.map(tile => (
                    <div key={tile.label} className="rounded-xl border border-yellow-200 bg-white/70 p-3">
                      <div className="text-xs font-medium uppercase text-gray-600">{tile.label}</div>
                      <div className="mt-1 text-xl font-bold text-[#2a1407]">{tile.value}</div>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-yellow-200 bg-white/70 p-3">
                  <div className="text-xs font-medium uppercase text-gray-600">By Purpose</div>
                  <div className="mt-3 grid grid-cols-1 gap-2">
                    {revenuePurposeRows.map(row => (
                      <div key={row.label} className="flex items-center justify-between rounded-lg border border-yellow-200 bg-white/60 px-3 py-2">
                        <div className="text-xs font-medium uppercase text-gray-600">{row.label}</div>
                        <div className="text-sm font-semibold text-[#2a1407]">{row.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>
        ) : null}

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-yellow-200 bg-gradient-to-br from-white to-yellow-50/20 p-6 shadow-sm">
            {role === 'ADMIN' ? (
              <>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Users size={18} className="text-[#2a1407]" />
                    <h3 className="text-lg font-semibold text-[#2a1407]">Recent Users</h3>
                  </div>
                  <button type="button" className="rounded-md border border-yellow-200 bg-white/70 px-3 py-1.5 text-xs font-medium text-[#2a1407]">
                    View All
                  </button>
                </div>

                {adminRecentUsers.length === 0 ? (
                  <div className="mt-4 text-sm text-gray-600">No recent users.</div>
                ) : (
                  <ul className="mt-4 divide-y divide-yellow-100 rounded-xl border border-yellow-200 bg-white/70">
                    {adminRecentUsers.map(u => (
                      <li key={u.id} className="flex items-center gap-3 px-3 py-3 hover:bg-yellow-50">
                        <div className="h-10 w-10 overflow-hidden rounded-full border border-yellow-200 bg-yellow-100 text-[#2a1407] flex items-center justify-center text-sm font-semibold">
                          {u.avatarUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={u.avatarUrl} alt={u.fullName} className="h-full w-full object-cover" />
                          ) : (
                            u.initials
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-medium text-[#2a1407]">{u.fullName}</p>
                            <span className="rounded-md bg-yellow-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-[#2a1407]">
                              {u.roleLabel}
                            </span>
                          </div>
                          <p className="mt-0.5 truncate text-xs text-gray-600">
                            {u.email || '-'}
                            {u.createdAt ? ` • Joined ${u.createdAt.toLocaleString()}` : ''}
                          </p>
                        </div>

                        {/* <div className="text-xs text-yellow-700">View</div> */}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-[#2a1407]">
                  {role === 'AGENT' ? 'Recent Enquiries' : role === 'BUYER' ? 'Recent Summary' : 'Recent Items'}
                </h3>

                {recentItems.length === 0 ? (
                  <div className="mt-4 text-sm text-gray-600">No recent activity.</div>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {recentItems.map(item => (
                      <li key={item.id} className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-yellow-50">
                        <div>
                          <p className="text-sm font-medium text-[#2a1407]">{item.title}</p>
                          <p className="mt-1 text-xs text-gray-600">{item.meta}</p>
                        </div>
                        {/* <div className="text-xs text-yellow-700">View</div> */}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
          {/* Engagement Metrics */}
          {role === 'AGENT' && (
            <div className="rounded-2xl border border-yellow-200 bg-gradient-to-br from-white to-yellow-50/20 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#2a1407]">Engagement Metrics</h3>
              {engagementMetrics.length === 0 ? (
                <div className="mt-4 text-sm text-gray-600">No metrics available.</div>
              ) : (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {engagementMetrics.map(metric => (
                    <div key={metric.label} className="rounded-xl border border-yellow-200 bg-white/70 p-3">
                      <div className="text-xs font-medium uppercase text-gray-600">{metric.label}</div>
                      <div className="mt-1 text-xl font-bold text-[#2a1407]">{metric.value}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {role === 'ADMIN' && (
            <div className="rounded-2xl border border-yellow-200 bg-gradient-to-br from-white to-yellow-50/20 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#2a1407]">Recent Payments</h3>
              {adminRecentPayments.length === 0 ? (
                <div className="mt-4 text-sm text-gray-600">No recent payments.</div>
              ) : (
                <div className="mt-4 overflow-x-auto rounded-xl border border-yellow-200 bg-white/70">
                  <table className="min-w-full text-left text-sm">
                    <thead className="border-b border-yellow-200 bg-white/60">
                      <tr className="text-xs font-medium uppercase text-gray-600">
                        <th className="px-3 py-2">Order No</th>
                        <th className="px-3 py-2">Purpose</th>
                        <th className="px-3 py-2">Amount</th>
                        <th className="px-3 py-2">Status</th>
                        <th className="px-3 py-2">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-yellow-100">
                      {adminRecentPayments.map((payment, index) => {
                        const date = payment.createdAt ? new Date(payment.createdAt) : null
                        const orderNumber = (payment.orderNumber ?? '').trim() || '-'
                        const purpose = (payment.purpose ?? '').trim() || '-'
                        const status = (payment.status ?? '').trim() || '-'
                        const amountLabel = typeof payment.amount === 'number' ? String(payment.amount) : '-'
                        return (
                          <tr key={payment.id ?? payment.orderNumber ?? `${index}`} className="hover:bg-yellow-50">
                            <td className="px-3 py-2 font-medium text-[#2a1407]">{orderNumber}</td>
                            <td className="px-3 py-2 text-gray-700">{purpose}</td>
                            <td className="px-3 py-2 text-gray-700">{amountLabel}</td>
                            <td className="px-3 py-2 text-gray-700">{status}</td>
                            <td className="px-3 py-2 text-gray-700">{date ? date.toLocaleString() : '-'}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </section>
        {/* recent transactions (agent only) */}
        {role === 'AGENT' ? (
          <section className="rounded-2xl border border-yellow-200 bg-gradient-to-br from-white to-yellow-50/20 p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg font-semibold text-[#2a1407]">Recent Transactions</h3>

              <div className="inline-flex rounded-xl border border-yellow-200 bg-white/70 p-1">
                <button
                  type="button"
                  onClick={() => setTransactionFilter('ALL')}
                  className={
                    'rounded-lg px-3 py-2 text-xs font-medium uppercase transition ' +
                    (transactionFilter === 'ALL' ? 'bg-yellow-100 text-[#2a1407]' : 'text-gray-700 hover:bg-yellow-50')
                  }
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setTransactionFilter('CREDIT')}
                  className={
                    'rounded-lg px-3 py-2 text-xs font-medium uppercase transition ' +
                    (transactionFilter === 'CREDIT' ? 'bg-yellow-100 text-[#2a1407]' : 'text-gray-700 hover:bg-yellow-50')
                  }
                >
                  Credit
                </button>
                <button
                  type="button"
                  onClick={() => setTransactionFilter('DEBIT')}
                  className={
                    'rounded-lg px-3 py-2 text-xs font-medium uppercase transition ' +
                    (transactionFilter === 'DEBIT' ? 'bg-yellow-100 text-[#2a1407]' : 'text-gray-700 hover:bg-yellow-50')
                  }
                >
                  Debit
                </button>
              </div>
            </div>

            {recentTransactions.length === 0 ? (
              <div className="mt-4 text-sm text-gray-600">No recent transactions.</div>
            ) : (
              <ul className="mt-4 divide-y divide-yellow-100 rounded-xl border border-yellow-200 bg-white/70">
                {recentTransactions.map(t => (
                  <li key={t.id} className="flex items-start justify-between gap-4 p-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[#2a1407]">{t.type}</span>
                        {t.source ? <span className="text-xs text-gray-600">• {t.source}</span> : null}
                      </div>
                      {t.description ? <div className="mt-1 text-xs text-gray-600 truncate">{t.description}</div> : null}
                      {t.createdAtLabel ? <div className="mt-1 text-xs text-gray-600">{t.createdAtLabel}</div> : null}
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-semibold text-[#2a1407]">{t.amount}</div>
                      {typeof t.balanceAfter === 'number' ? <div className="mt-1 text-xs text-gray-600">Bal: {t.balanceAfter}</div> : null}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ) : null}
      </div>
    </main>
  )
}
