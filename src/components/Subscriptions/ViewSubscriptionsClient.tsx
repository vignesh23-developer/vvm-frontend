'use client'

import { motion } from 'framer-motion'
import { X, Package } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSubscriptionData } from './hooks/useSubscriptionData'
import { SubscriptionCard } from './SubscriptionCard'

/**
 * Main view subscriptions client component
 */
export default function ViewSubscriptionsClient() {
  const router = useRouter()
  const { subscriptions, loading, error, userId, refetch } = useSubscriptionData()

  if (loading) {
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
            My Subscriptions
          </h1>
          <p className="text-gray-600">View and manage your active subscriptions</p>
        </motion.div>

        {/* Subscriptions List */}
        {subscriptions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white border border-gray-200 rounded-lg p-12 text-center"
          >
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Subscriptions Found</h3>
            <p className="text-gray-600 mb-6">You don't have any active subscriptions yet.</p>
            <button
              onClick={() => router.push('/pricing')}
              className="px-6 py-2 bg-[#3b1804] text-white rounded hover:bg-[#5a2a0a] transition-colors"
            >
              Browse Plans
            </button>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            {subscriptions.map((subscription, index) => (
              <SubscriptionCard
                key={index}
                subscription={subscription}
                index={index}
                userId={userId || ''}
                onActionComplete={refetch}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

