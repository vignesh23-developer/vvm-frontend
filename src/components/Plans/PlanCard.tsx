import { motion, Variants } from 'framer-motion'
import { Megaphone, Star, Trophy, Award, Settings } from 'lucide-react'
import RazorpayPayment from '@/components/payment/RazorpayPayment'
import { Plan, ApiPlan } from './types'
import { FeatureValue } from './FeatureValue'
import { convertToPaise } from './utils/featureUtils'

interface PlanCardProps {
  plan: Plan
  apiPlan?: ApiPlan
  activeSubscriptionId?: number
}

const iconMap = {
  megaphone: Megaphone,
  star: Star,
  trophy: Trophy,
  award: Award,
  settings: Settings,
}

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as any },
  },
}

/**
 * Mobile plan card component
 */
export function PlanCard({
  plan,
  apiPlan,
  activeSubscriptionId
}: PlanCardProps) {
  const Icon = iconMap[plan.icon]
  const amount = apiPlan ? convertToPaise(apiPlan.price) : 0

  console.log("Plan ", plan)

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{
        y: -8,
        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
        transition: { duration: 0.3 },
      }}
      className="bg-gradient-to-br from-white to-yellow-50/20 border border-yellow-200 shadow-lg transition-transform duration-300"
    >
      {/* Plan Header */}
      <div
        className={`p-6 flex flex-col items-center border-b border-yellow-200 ${plan.bgColor || 'bg-gradient-to-br from-yellow-50 to-yellow-100/50'
          } transition-colors duration-300`}
      >
        <Icon
          className={`w-7 h-7 mb-3 transform transition-transform duration-300 hover:scale-110 ${plan.textColor || 'text-[#2a1407]'
            }`}
        />
        <h3 className={`text-lg font-semibold ${plan.textColor || 'text-[#2a1407]'}`}>
          {plan.name}
        </h3>
        <p className={`text-2xl font-bold mt-2 ${plan.textColor || 'text-[#2a1407]'}`}>
          {plan.price}
        </p>
      </div>

      {/* Features List */}
      <div className="p-6">
        <ul className="space-y-4 text-sm mb-6">
          {plan.features.map((f, i) => (
            <li
              key={i}
              className="flex justify-between items-center py-2 border-b border-yellow-100 last:border-b-0"
            >
              <span className="font-medium text-gray-700">{f.text}</span>
              <FeatureValue value={f.value} />
            </li>
          ))}
        </ul>

        {/* Subscribe Button */}
        <div className="mt-4 pt-4 border-t border-yellow-200">
          <RazorpayPayment
            planId={plan.id}
            planName={plan.name}
            amount={amount}
            planAction={plan.planAction || 'subscribe'}
            activeSubscriptionId={activeSubscriptionId}
          />
        </div>
      </div>
    </motion.div>
  )
}

