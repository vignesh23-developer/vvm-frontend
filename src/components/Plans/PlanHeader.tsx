import { Megaphone, Star, Trophy, Award, Settings, LucideIcon } from 'lucide-react'
import RazorpayPayment from '@/components/payment/RazorpayPayment'
import { Plan, ApiPlan } from './types'
import { convertToPaise } from './utils/featureUtils'

interface PlanHeaderProps {
  plan: Plan
  apiPlan?: ApiPlan
  activeSubscriptionId?: number
}

const iconMap: Record<string, LucideIcon> = {
  megaphone: Megaphone,
  star: Star,
  trophy: Trophy,
  award: Award,
  settings: Settings,
}

/**
 * Desktop plan header in table view
 */
export function PlanHeader({ 
  plan, 
  apiPlan,
  activeSubscriptionId
}: PlanHeaderProps) {
  const Icon = iconMap[plan.icon]
  const amount = apiPlan ? convertToPaise(apiPlan.price) : 0

  return (
    <div
      className={`p-6 text-center border-b border-r last:border-r-0 border-gray-200 ${
        plan.bgColor || 'bg-gray-50'
      }`}
    >
      <div className="flex flex-col items-center">
        <Icon className={`w-7 h-7 mb-2 ${plan.textColor || 'text-gray-800'}`} />
        <h3 className={`text-base font-semibold ${plan.textColor || 'text-gray-800'}`}>
          {plan.name}
        </h3>
        <p className={`text-xl font-bold mt-1 ${plan.textColor || 'text-gray-800'}`}>
          {plan.price}
        </p>
        
        {/* Subscribe Button */}
        <div className="mt-4">
          <RazorpayPayment
            planId={plan.id}
            planName={plan.name}
            amount={amount}
            planAction={plan.planAction || 'subscribe'}
            activeSubscriptionId={activeSubscriptionId}
          />
        </div>
      </div>
    </div>
  )
}

