import { X } from 'lucide-react'
import { Plan, ApiPlan } from './types'
import { FeatureValue } from './FeatureValue'
import { calculateFeatureValue } from './utils/featureUtils'

interface FeatureRowProps {
  featureName: string
  plans: Plan[]
  apiPlans: ApiPlan[]
}

/**
 * Desktop feature comparison row
 */
export function FeatureRow({ featureName, plans, apiPlans }: FeatureRowProps) {
  return (
    <div
      className="grid border-b border-gray-200 last:border-b-0"
      style={{ gridTemplateColumns: `220px repeat(${plans.length}, minmax(200px, 1fr))` }}
    >
      {/* Feature Name */}
      <div className="p-6 border-r border-gray-200 bg-white">
        <span className="text-sm text-gray-600 font-medium">{featureName}</span>
      </div>

      {/* Plan Values */}
      {plans.map((plan, planIdx) => {
        const apiPlan = apiPlans.find(p => p.name === plan.name)
        const planItem = apiPlan?.planItems.find(item => item.item.name === featureName)
        const featureValue = calculateFeatureValue(planItem)

        return (
          <div
            key={planIdx}
            className="p-6 text-center border-r last:border-r-0 border-gray-200 bg-white"
          >
            {planItem && planItem.isIncluded ? (
              <FeatureValue value={featureValue} />
            ) : (
              <X className="text-gray-300 w-5 h-5 mx-auto" />
            )}
          </div>
        )
      })}
    </div>
  )
}

