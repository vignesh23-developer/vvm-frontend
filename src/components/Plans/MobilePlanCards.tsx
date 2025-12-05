import { motion, Variants } from 'framer-motion'
import { Plan, ApiPlan } from './types'
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
    transition: { staggerChildren: 0.15 },
  },
}

/**
 * Mobile view - Plan cards in vertical layout
 */
export function MobilePlanCards({ 
  plans, 
  apiPlans,
  activeSubscriptionId
}: MobilePlanCardsProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid grid-cols-1 gap-8 md:hidden"
    >
      {plans.map((plan, idx) => {
        const apiPlan = apiPlans.find(p => p.id === plan.id)
        return (
          <PlanCard
            key={idx}
            plan={plan}
            apiPlan={apiPlan}
            activeSubscriptionId={activeSubscriptionId}
          />
        )
      })}
    </motion.div>
  )
}

