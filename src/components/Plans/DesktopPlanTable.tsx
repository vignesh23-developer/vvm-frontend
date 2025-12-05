import { motion, Variants } from 'framer-motion'
import { Plan, ApiPlan } from './types'
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
    transition: { staggerChildren: 0.15 },
  },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

/**
 * Desktop view - Plan comparison table
 */
export function DesktopPlanTable({ 
  plans, 
  featuresList, 
  apiPlans,
  activeSubscriptionId
}: DesktopPlanTableProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="hidden md:block overflow-x-auto"
    >
      <motion.div
        variants={cardVariants}
        className="bg-white border border-gray-200 shadow-lg overflow-hidden"
      >
        {/* Table Headers */}
        <div
          className="grid"
          style={{ gridTemplateColumns: `220px repeat(${plans.length}, minmax(200px, 1fr))` }}
        >
          {/* Left Column Header */}
          <div className="bg-white p-6 border-b border-r border-gray-200">
            <h3 className="font-semibold text-gray-700 text-base">Feature / Benefit</h3>
          </div>

          {/* Plan Headers */}
          {plans.map((plan, idx) => {
            const apiPlan = apiPlans.find(p => p.id === plan.id)
            return (
              <PlanHeader
                key={idx}
                plan={plan}
                apiPlan={apiPlan}
                activeSubscriptionId={activeSubscriptionId}
              />
            )
          })}
        </div>

        {/* Feature Rows */}
        {featuresList.map((featureName, featureIdx) => (
          <FeatureRow
            key={featureIdx}
            featureName={featureName}
            plans={plans}
            apiPlans={apiPlans}
          />
        ))}
      </motion.div>
    </motion.div>
  )
}

