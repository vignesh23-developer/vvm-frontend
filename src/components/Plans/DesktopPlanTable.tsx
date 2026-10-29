'use client'

import { memo, useMemo } from 'react'
import { motion, type Variants } from 'framer-motion'

import type { Plan, ApiPlan } from './types'
import { PlanHeader } from './PlanHeader'
import { FeatureRow } from './FeatureRow'

interface DesktopPlanTableProps {
  plans: Plan[]
  featuresList: string[]
  apiPlans: ApiPlan[]
  activeSubscriptionId?: number
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 30,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
}

function DesktopPlanTableComponent({
  plans,
  featuresList,
  apiPlans,
  activeSubscriptionId,
}: DesktopPlanTableProps) {
  // Build a lookup map once instead of searching apiPlans for every plan.
  const apiPlansById = useMemo(
    () => new Map(apiPlans.map((apiPlan) => [apiPlan.id, apiPlan])),
    [apiPlans],
  )

  const gridTemplateColumns = useMemo(
    () => `220px repeat(${plans.length}, minmax(200px, 1fr))`,
    [plans.length],
  )

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="hidden overflow-x-auto md:block"
    >
      <motion.div
        variants={cardVariants}
        className="overflow-hidden border border-gray-200 bg-white shadow-lg"
      >
        {/* Table Headers */}
        <div
          className="grid"
          style={{ gridTemplateColumns }}
        >
          {/* Feature Column Header */}
          <div className="border-b border-r border-gray-200 bg-white p-6">
            <h3 className="text-base font-semibold text-gray-700">
              Feature / Benefit
            </h3>
          </div>

          {/* Plan Headers */}
          {plans.map((plan) => (
            <PlanHeader
              key={plan.id}
              plan={plan}
              apiPlan={apiPlansById.get(plan.id)}
              activeSubscriptionId={activeSubscriptionId}
            />
          ))}
        </div>

        {/* Feature Rows */}
        {featuresList.map((featureName) => (
          <FeatureRow
            key={featureName}
            featureName={featureName}
            plans={plans}
            apiPlans={apiPlans}
          />
        ))}
      </motion.div>
    </motion.div>
  )
}

export const DesktopPlanTable = memo(DesktopPlanTableComponent)

DesktopPlanTable.displayName = 'DesktopPlanTable'
