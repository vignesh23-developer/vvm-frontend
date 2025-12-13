'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Package, TrendingUp, TrendingDown, DollarSign, Users, Calendar } from 'lucide-react'
import { useAllSubscriptionData } from './hooks/useAllSubscriptionsData'
import { useSubscriptionPlanAnalytics } from './hooks/useSubscriptionPlanAnalytics'
import Pagination from '@/components/ui/CustomComponent/Paginations/Pagination'
import { UserSubscription } from './types'

/**
 * Admin view for all subscriptions with analytics cards and table
 */
export default function ViewSubscriptionsAdmin() {
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(20)
    const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null)

    const { subscriptions, loading, error, total, refetch } = useAllSubscriptionData({
        page,
        limit,
        orderBy: 'startDate',
        order: 'DESC',
        status: 'all',
        planId: selectedPlanId,
    })

    const { analytics, loading: analyticsLoading } = useSubscriptionPlanAnalytics()

    const handlePageChange = (newPage: number) => {
        setPage(newPage)
    }

    const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLimit = parseInt(e.target.value, 10)
        setLimit(newLimit)
        setPage(1)
    }

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A'
        return new Date(dateString).toLocaleString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    const formatCurrency = (amount: string | number | null) => {
        if (!amount) return '₹0.00'
        const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
        return `₹${numAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }

    const getStatusBadge = (subscription: UserSubscription) => {
        const now = new Date()
        const endDate = new Date(subscription.endDate)

        if (!subscription.isActive) {
            return (
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                    Inactive
                </span>
            )
        }

        if (endDate < now) {
            return (
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                    Expired
                </span>
            )
        }

        return (
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Active
            </span>
        )
    }

    const getPaymentStatusBadge = (status: string | null) => {
        const statusColors: Record<string, string> = {
            paid: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            failed: 'bg-red-100 text-red-800',
        }
        const colorClass = statusColors[status?.toLowerCase() || ''] || 'bg-gray-100 text-gray-800'
        return (
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colorClass}`}>
                {status || 'N/A'}
            </span>
        )
    }

    if (loading && subscriptions.length === 0) {
        return (
            <div className="min-h-screen bg-[#F8F9FA] py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3b1804] mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading subscriptions...</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#F8F9FA] py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <X className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
                        <p className="text-red-600">{error}</p>
                        <button
                            onClick={() => refetch()}
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#F8F9FA] py-16">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
                        Subscription Analytics
                    </h1>
                    <p className="text-gray-600">View plan analytics and manage all subscriptions</p>
                </motion.div>

                {/* Analytics Cards */}
                {!analyticsLoading && analytics && analytics.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="mb-8 space-y-4"
                    >
                        {analytics.map((plan) => (
                            <div
                                key={plan.plan_id}
                                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                                    {/* Plan Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-3 bg-[#3b1804] rounded-lg">
                                                <Package className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-800">{plan.plan_name}</h3>
                                                <p className="text-lg font-semibold text-[#3b1804]">
                                                    {formatCurrency(plan.plan_price)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {/* Total Subscriptions */}
                                            <div className="bg-blue-50 rounded-lg p-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Users className="w-4 h-4 text-blue-600" />
                                                    <span className="text-sm font-medium text-gray-600">Total</span>
                                                </div>
                                                <p className="text-2xl font-bold text-gray-800">{plan.total_subscriptions}</p>
                                            </div>

                                            {/* Active Subscriptions */}
                                            <div className="bg-green-50 rounded-lg p-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Users className="w-4 h-4 text-green-600" />
                                                    <span className="text-sm font-medium text-gray-600">Active</span>
                                                </div>
                                                <p className="text-2xl font-bold text-gray-800">{plan.active_subscriptions}</p>
                                            </div>

                                            {/* Expired Subscriptions */}
                                            <div className="bg-red-50 rounded-lg p-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Users className="w-4 h-4 text-red-600" />
                                                    <span className="text-sm font-medium text-gray-600">Expired</span>
                                                </div>
                                                <p className="text-2xl font-bold text-gray-800">{plan.expired_subscriptions}</p>
                                            </div>

                                            {/* Total Revenue */}
                                            <div className="bg-purple-50 rounded-lg p-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <DollarSign className="w-4 h-4 text-purple-600" />
                                                    <span className="text-sm font-medium text-gray-600">Revenue</span>
                                                </div>
                                                <p className="text-2xl font-bold text-gray-800">
                                                    {formatCurrency(plan.total_revenue)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Growth Indicators */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                            {/* Today Growth */}
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-gray-500" />
                                                <span className="text-sm text-gray-600">Today:</span>
                                                <span className="text-sm font-semibold text-gray-800">{plan.growth.today.count}</span>
                                                {plan.growth.today.growthPercentage !== 0 && (
                                                    <div className="flex items-center gap-1">
                                                        {plan.growth.today.growthPercentage >= 0 ? (
                                                            <TrendingUp className="w-4 h-4 text-green-600" />
                                                        ) : (
                                                            <TrendingDown className="w-4 h-4 text-red-600" />
                                                        )}
                                                        <span
                                                            className={`text-xs font-semibold ${
                                                                plan.growth.today.growthPercentage >= 0 ? 'text-green-600' : 'text-red-600'
                                                            }`}
                                                        >
                                                            {plan.growth.today.growthPercentage >= 0 ? '+' : ''}
                                                            {plan.growth.today.growthPercentage.toFixed(1)}%
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Week Growth */}
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-gray-500" />
                                                <span className="text-sm text-gray-600">Week:</span>
                                                <span className="text-sm font-semibold text-gray-800">{plan.growth.thisWeek.count}</span>
                                                {plan.growth.thisWeek.growthPercentage !== 0 && (
                                                    <div className="flex items-center gap-1">
                                                        {plan.growth.thisWeek.growthPercentage >= 0 ? (
                                                            <TrendingUp className="w-4 h-4 text-green-600" />
                                                        ) : (
                                                            <TrendingDown className="w-4 h-4 text-red-600" />
                                                        )}
                                                        <span
                                                            className={`text-xs font-semibold ${
                                                                plan.growth.thisWeek.growthPercentage >= 0 ? 'text-green-600' : 'text-red-600'
                                                            }`}
                                                        >
                                                            {plan.growth.thisWeek.growthPercentage >= 0 ? '+' : ''}
                                                            {plan.growth.thisWeek.growthPercentage.toFixed(1)}%
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Month Growth */}
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-gray-500" />
                                                <span className="text-sm text-gray-600">Month:</span>
                                                <span className="text-sm font-semibold text-gray-800">{plan.growth.thisMonth.count}</span>
                                                {plan.growth.thisMonth.growthPercentage !== 0 && (
                                                    <div className="flex items-center gap-1">
                                                        {plan.growth.thisMonth.growthPercentage >= 0 ? (
                                                            <TrendingUp className="w-4 h-4 text-green-600" />
                                                        ) : (
                                                            <TrendingDown className="w-4 h-4 text-red-600" />
                                                        )}
                                                        <span
                                                            className={`text-xs font-semibold ${
                                                                plan.growth.thisMonth.growthPercentage >= 0 ? 'text-green-600' : 'text-red-600'
                                                            }`}
                                                        >
                                                            {plan.growth.thisMonth.growthPercentage >= 0 ? '+' : ''}
                                                            {plan.growth.thisMonth.growthPercentage.toFixed(1)}%
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Year Growth */}
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-gray-500" />
                                                <span className="text-sm text-gray-600">Year:</span>
                                                <span className="text-sm font-semibold text-gray-800">{plan.growth.thisYear.count}</span>
                                                {plan.growth.thisYear.growthPercentage !== 0 && (
                                                    <div className="flex items-center gap-1">
                                                        {plan.growth.thisYear.growthPercentage >= 0 ? (
                                                            <TrendingUp className="w-4 h-4 text-green-600" />
                                                        ) : (
                                                            <TrendingDown className="w-4 h-4 text-red-600" />
                                                        )}
                                                        <span
                                                            className={`text-xs font-semibold ${
                                                                plan.growth.thisYear.growthPercentage >= 0 ? 'text-green-600' : 'text-red-600'
                                                            }`}
                                                        >
                                                            {plan.growth.thisYear.growthPercentage >= 0 ? '+' : ''}
                                                            {plan.growth.thisYear.growthPercentage.toFixed(1)}%
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}

                {/* Plan Filter and Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {/* Plan Filter */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                Filter by Plan:
                            </label>
                            <select
                                value={selectedPlanId || ''}
                                onChange={(e) => {
                                    setSelectedPlanId(e.target.value ? parseInt(e.target.value, 10) : null)
                                    setPage(1)
                                }}
                                className="flex-1 max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3b1804] focus:border-transparent"
                            >
                                <option value="">All Plans</option>
                                {analytics?.map((plan) => (
                                    <option key={plan.plan_id} value={plan.plan_id}>
                                        {plan.plan_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Subscriptions Table */}
                    {subscriptions.length === 0 ? (
                        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Subscriptions Found</h3>
                            <p className="text-gray-600">No subscriptions match the current filters.</p>
                        </div>
                    ) : (
                        <>
                            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    User ID
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Plan Name
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Start Date
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    End Date
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Payment Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Amount Paid
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Created At
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {subscriptions.map((subscription) => (
                                                <tr key={subscription.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                                                        {subscription.user_id.substring(0, 8)}...
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {subscription.plan?.name || `Plan #${subscription.plan_id}`}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatDate(subscription.startDate)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatDate(subscription.endDate)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        {getStatusBadge(subscription)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        {getPaymentStatusBadge(subscription.paymentStatus)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                                        {formatCurrency(subscription.paidAmount)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatDate(subscription.startDate)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Pagination */}
                            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-700">Show</span>
                                    <select
                                        value={limit}
                                        onChange={handleLimitChange}
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3b1804] focus:border-transparent"
                                    >
                                        <option value="10">10</option>
                                        <option value="20">20</option>
                                        <option value="50">50</option>
                                    </select>
                                    <span className="text-sm text-gray-700">per page</span>
                                </div>

                                <div className="text-sm text-gray-700">
                                    Showing {Math.min((page - 1) * limit + 1, total)} to {Math.min(page * limit, total)} of {total} subscriptions
                                </div>

                                <Pagination
                                    totalItems={total}
                                    itemsPerPage={limit}
                                    currentPage={page}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        </>
                    )}
                </motion.div>
            </div>
        </div>
    )
}
