'use client'

import { memo, useMemo } from 'react'
import { motion, type Variants } from 'framer-motion'

import type { Plan, ApiPlan } from './types'
import { PlanCard } from './PlanCard'

interface MobilePlanCardsProps {
  plans: Plan[]
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

function MobilePlanCardsComponent({
  plans,
  apiPlans,
  activeSubscriptionId,
}: MobilePlanCardsProps) {
  // Avoid searching the API plans array for every card.
  const apiPlansById = useMemo(
    () => new Map(apiPlans.map((apiPlan) => [apiPlan.id, apiPlan])),
    [apiPlans],
  )

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid grid-cols-1 gap-8 md:hidden"
    >
      {plans.map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          apiPlan={apiPlansById.get(plan.id)}
          activeSubscriptionId={activeSubscriptionId}
        />
      ))}
    </motion.div>
  )
}

export const MobilePlanCards = memo(MobilePlanCardsComponent)

MobilePlanCards.displayName = 'MobilePlanCards'

