'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, CreditCard, Check, ChevronDown } from 'lucide-react'
import { UserSubscription } from './types'
import { formatDate, formatCurrency } from './utils/subscriptionUtils'
import { SubscriptionActions } from './SubscriptionActions'
import AddonList from './addons/AddonList'

interface SubscriptionCardProps {
  subscription: UserSubscription
  index: number
  userId: string
  onActionComplete?: () => void
  isAdmin?: boolean
}

function getStatusBadge(status: string, isActive: boolean) {
  if (!isActive || status === 'expired' || status === 'canceled') {
    return (
      <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
        {status === 'canceled'
          ? 'Canceled'
          : status === 'expired'
            ? 'Expired'
            : 'Inactive'}
      </span>
    )
  }
  return (
    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
      Active
    </span>
  )
}

export function SubscriptionCard({
  subscription,
  index,
  userId,
  onActionComplete,
  isAdmin = false,
}: SubscriptionCardProps) {
  const [showAddons, setShowAddons] = useState(false)

  // ------------------------------------------
  // 🚀 Only the OWNER of the subscription can manage it
  // ------------------------------------------
  const isOwner = subscription.user_id === userId

  const showActions =
    isOwner && subscription.isActive && !subscription.canceledAt

  const showAddonSection =
    isOwner &&
    subscription.plan?.planItems?.some((pi) => pi.item?.isAddon)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-gradient-to-br from-white to-yellow-50/20 border border-yellow-200 rounded-lg shadow-sm overflow-hidden"
    >
      <div className="p-6">

        {/* ------------------------------------------ */}
        {/* Header */}
        {/* ------------------------------------------ */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-[#2a1407] mb-1">
              {subscription.plan?.name || 'Unknown Plan'}
            </h3>
            {subscription.plan?.tagline && (
              <p className="text-gray-600">{subscription.plan.tagline}</p>
            )}
          </div>

          {getStatusBadge(subscription.status, subscription.isActive)}
        </div>

        {/* ------------------------------------------ */}
        {/* Details Grid */}
        {/* ------------------------------------------ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

          {/* Start Date */}
          <div className="flex items-start">
            <Calendar className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500 mb-1">Start Date</p>
              <p className="font-semibold text-[#2a1407]">
                {formatDate(subscription.startDate)}
              </p>
            </div>
          </div>

          {/* End Date */}
          <div className="flex items-start">
            <Calendar className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500 mb-1">End Date</p>
              <p className="font-semibold text-gray-800">
                {formatDate(subscription.endDate)}
              </p>
            </div>
          </div>

          {/* Paid Amount */}
          <div className="flex items-start">
            <CreditCard className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500 mb-1">Amount Paid</p>
              <p className="font-semibold text-gray-800">
                {subscription.paidAmount
                  ? formatCurrency(subscription.paidAmount)
                  : 'N/A'}
              </p>
            </div>
          </div>

          {/* Payment Status */}
          <div className="flex items-start">
            <Check className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500 mb-1">Payment Status</p>
              <p className="font-semibold text-gray-800">
                {subscription.paymentStatus || 'N/A'}
              </p>
            </div>
          </div>

        </div>

        {/* ------------------------------------------ */}
        {/* Additional Info */}
        {/* ------------------------------------------ */}
        <div className="border-t border-yellow-200 pt-4 mb-6">
          <div className="flex flex-wrap gap-4 text-sm">
            {subscription.autoRenew && (
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-gray-600">Auto-renewal enabled</span>
              </div>
            )}

            {subscription.transactionId && (
              <div>
                <span className="text-gray-500">Transaction ID:</span>{' '}
                <span className="text-gray-800 font-mono text-xs">
                  {subscription.transactionId}
                </span>
              </div>
            )}

            {subscription.promoCodeUsed && (
              <div>
                <span className="text-gray-500">Promo Code:</span>{' '}
                <span className="text-gray-800">
                  {subscription.promoCodeUsed}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ------------------------------------------ */}
        {/* Actions (ONLY if owner) */}
        {/* ------------------------------------------ */}
        {showActions && (
          <>
            <SubscriptionActions
              subscription={subscription}
              userId={userId}
              onActionComplete={onActionComplete}
            />

            {/* Addon section also only for owner */}
            {showAddonSection && (
              <div className="mt-4 pt-4 border-t border-yellow-200">
                <button
                  onClick={() => setShowAddons(!showAddons)}
                  className="flex items-center justify-between w-full px-4 py-2 
                    bg-gradient-to-r from-yellow-50 to-yellow-100/50 
                    hover:from-yellow-100 hover:to-yellow-200/50 
                    rounded transition-colors"
                >
                  <span className="font-medium text-[#2a1407]">
                    Addon Features
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-600 transition-transform ${showAddons ? 'rotate-180' : ''
                      }`}
                  />
                </button>

                {showAddons && (
                  <div className="mt-4">
                    <AddonList subscription={subscription} userId={userId} />
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* ------------------------------------------ */}
        {/* Cancellation Info */}
        {/* ------------------------------------------ */}
        {subscription.canceledAt && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
            <p className="text-sm text-red-800">
              <strong>Canceled on:</strong>{' '}
              {formatDate(subscription.canceledAt)}
            </p>
            {subscription.cancellationReason && (
              <p className="text-sm text-red-700 mt-1">
                <strong>Reason:</strong> {subscription.cancellationReason}
              </p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
