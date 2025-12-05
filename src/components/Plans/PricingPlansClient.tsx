'use client'

import { motion } from 'framer-motion'
import { PricingPlansClientProps } from './types'
import { useUserSubscription } from './hooks/useUserSubscription'
import { MobilePlanCards } from './MobilePlanCards'
import { DesktopPlanTable } from './DesktopPlanTable'

/**
 * Main pricing plans client component
 * Handles subscription state and renders mobile/desktop views
 */
export default function PricingPlansClient({ plans, featuresList, apiPlans }: PricingPlansClientProps) {
  const { activeSubscription, loading, error } = useUserSubscription()

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

  return (
    <div className="w-full py-16 bg-gradient-to-br from-yellow-50 via-white to-yellow-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center text-3xl sm:text-4xl font-bold text-[#2a1407] mb-12"
        >
          Choose Your Plan
        </motion.h2>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
            {error}
          </div>
        )}

        {/* Mobile Cards View */}
        <MobilePlanCards
          plans={enrichedPlans}
          apiPlans={apiPlans}
          activeSubscriptionId={activeSubscription?.id}
        />

        {/* Desktop Table View */}
        <DesktopPlanTable
          plans={enrichedPlans}
          featuresList={featuresList}
          apiPlans={apiPlans}
          activeSubscriptionId={activeSubscription?.id}
        />
      </div>
    </div>
  )
}

