'use client'

import { memo } from 'react'
import { motion, type Variants } from 'framer-motion'
import {
  Megaphone,
  Star,
  Trophy,
  Award,
  Settings,
} from 'lucide-react'

import RazorpayPayment from '@/components/payment/RazorpayPayment'
import type { Plan, ApiPlan } from './types'
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
} as const

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

function PlanCardComponent({
  plan,
  apiPlan,
  activeSubscriptionId,
}: PlanCardProps) {
  const Icon = iconMap[plan.icon]
  const amount = apiPlan ? convertToPaise(apiPlan.price) : 0

  
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{
        y: -8,
        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
        transition: { duration: 0.3 },
      }}
      className="border border-yellow-200 bg-gradient-to-br from-white to-yellow-50/20 shadow-lg transition-transform duration-300"
    >
      {/* Plan Header */}
      <div
        className={`flex flex-col items-center border-b border-yellow-200 p-6 transition-colors duration-300 ${
          plan.bgColor ||
          'bg-gradient-to-br from-yellow-50 to-yellow-100/50'
        }`}
      >
        <Icon
          aria-hidden="true"
          className={`mb-3 h-7 w-7 transform transition-transform duration-300 hover:scale-110 ${
            plan.textColor || 'text-[#2a1407]'
          }`}
        />

        <h3
          className={`text-lg font-semibold ${
            plan.textColor || 'text-[#2a1407]'
          }`}
        >
          {plan.name}
        </h3>

        <p
          className={`mt-2 text-2xl font-bold ${
            plan.textColor || 'text-[#2a1407]'
          }`}
        >
          {plan.price}
        </p>
      </div>

      {/* Features List */}
      <div className="p-6">
        <ul className="mb-6 space-y-4 text-sm">
          {plan.features.map((feature) => (
            <li
              key={feature.text}
              className="flex items-center justify-between border-b border-yellow-100 py-2 last:border-b-0"
            >
              <span className="font-medium text-gray-700">
                {feature.text}
              </span>

              <FeatureValue value={feature.value} />
            </li>
          ))}
        </ul>

        {/* Subscribe Button */}
        <div className="mt-4 border-t border-yellow-200 pt-4">
          <RazorpayPayment
            planId={plan.id}
            planName={plan.name}
            amount={amount}
            planAction={plan.planAction ?? 'subscribe'}
            activeSubscriptionId={activeSubscriptionId}
          />
        </div>
      </div>
    </motion.div>
  )
}

export const PlanCard = memo(PlanCardComponent)

PlanCard.displayName = 'PlanCard'

