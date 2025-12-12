'use client'

import { motion } from 'framer-motion'
import { PricingPlansClientProps } from './types'
import { useUserSubscription } from './hooks/useUserSubscription'


/**
 * Main pricing plans client component
 * Handles subscription state and renders mobile/desktop views
 */
export default function PricingPlansClient({ plans, featuresList, apiPlans }: PricingPlansClientProps) {
  const { activeSubscription, error, loading: isLoading } = useUserSubscription()

  // Enrich plans with planAction field based on active subscription
  const enrichedPlans = plans.map(plan => {
    let planAction: 'current' | 'upgrade' | 'downgrade' | 'subscribe' = 'subscribe'

    if (activeSubscription) {
      const planPrice = parseFloat(plan.price.replace(/[₹,]/g, ''))

      // Get current plan price
      let currentPrice = 0
      if (activeSubscription.plan?.price) {
        currentPrice = typeof activeSubscription.plan.price === 'string'
          ? parseFloat(activeSubscription.plan.price)
          : activeSubscription.plan.price
      } else if (activeSubscription.paidAmount) {
        currentPrice = typeof activeSubscription.paidAmount === 'string'
          ? parseFloat(activeSubscription.paidAmount)
          : activeSubscription.paidAmount
      } else {
        // Find from apiPlans
        const apiPlan = apiPlans.find(p => p.id === activeSubscription.plan_id)
        if (apiPlan?.price) {
          currentPrice = parseFloat(apiPlan.price)
        }
      }

      // Determine action
      if (plan.id === activeSubscription.plan_id) {
        planAction = 'current'
      } else if (currentPrice > 0) {
        planAction = planPrice > currentPrice ? 'upgrade' : 'downgrade'
      }
    }

    return {
      ...plan,
      planAction,
    }
  })

  // Skeleton Loader for sleek feel
  if (isLoading) {
    return (
      <div className="w-full py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-10 w-64 bg-gray-200 rounded-full mx-auto mb-16 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[500px] bg-white rounded-3xl border border-gray-100 shadow-sm p-8 animate-pulse">
                <div className="h-8 w-32 bg-gray-100 rounded-lg mb-4" />
                <div className="h-12 w-48 bg-gray-100 rounded-lg mb-8" />
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map(j => (
                    <div key={j} className="h-4 w-full bg-gray-100 rounded" />
                  ))}
                </div>
                <div className="mt-8 h-12 w-full bg-gray-200 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full py-20 bg-gradient-to-br from-[#fffdf5] via-white to-yellow-50/30 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 rounded-full bg-yellow-100 text-yellow-800 text-sm font-semibold mb-4 border border-yellow-200"
          >
            Flexible Pricing
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-[#2a1407] mb-6 tracking-tight"
          >
            Choose the Perfect Plan for You
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-500 leading-relaxed"
          >
            Whether you're just starting out or scaling your real estate business, we have a plan that fits your needs.
          </motion.p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-center"
          >
            {error}
          </motion.div>
        )}

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2  gap-8 lg:gap-10 items-stretch">
          {enrichedPlans.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className={`relative flex flex-col p-8 rounded-3xl transition-all duration-300 ${plan.highlight
                ? 'bg-gradient-to-b from-[#2a1407] to-[#1a0a04] text-white shadow-2xl ring-4 ring-yellow-500/20 scale-105 z-10'
                : 'bg-white border border-yellow-100 hover:border-yellow-300 shadow-xl hover:shadow-2xl text-gray-900 group'
                }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-yellow-500 text-white px-6 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                  <span className="text-lg">👑</span> Most Popular
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-8">
                <h3 className={`text-2xl font-bold mb-2 ${plan.highlight ? 'text-white' : 'text-[#2a1407]'}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className={`text-4xl font-extrabold ${plan.highlight ? 'text-yellow-400' : 'text-[#2a1407]'}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm ${plan.highlight ? 'text-gray-400' : 'text-gray-500'}`}>
                    / month
                  </span>
                </div>
              </div>

              {/* Features List */}
              <div className="flex-1 space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`mt-0.5 rounded-full p-0.5 ${plan.highlight ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700'}`}>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className={`text-sm font-medium ${plan.highlight ? 'text-gray-300' : 'text-gray-600 group-hover:text-gray-900'}`}>
                      {feature.text} {feature.value && typeof feature.value === 'string' && feature.value !== 'Enabled' && (
                        <span className={`font-bold ${plan.highlight ? 'text-white' : 'text-[#2a1407]'}`}> - {feature.value}</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <button
                className={`w-full py-4 rounded-xl font-bold text-sm transition-all duration-300 ${plan.planAction === 'current'
                  ? 'bg-gray-100 text-gray-400 cursor-default'
                  : plan.highlight
                    ? 'bg-yellow-500 text-[#2a1407] hover:bg-yellow-400 shadow-lg hover:shadow-yellow-500/50'
                    : 'bg-[#2a1407] text-white hover:bg-[#4a2e1d] shadow-md hover:shadow-lg'
                  }`}
                disabled={plan.planAction === 'current'}
              >
                {plan.planAction === 'current' ? 'Current Plan' : plan.planAction === 'upgrade' ? 'Upgrade Plan' : plan.planAction === 'downgrade' ? 'Downgrade' : 'Get Started'}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

