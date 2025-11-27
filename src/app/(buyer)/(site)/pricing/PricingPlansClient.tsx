'use client'

import { useState, useEffect } from 'react'
import {
  Check,
  X,
  Megaphone,
  Star,
  Trophy,
  Award,
  Settings,
} from 'lucide-react'
import { motion, Variants } from 'framer-motion'
import RazorpayPayment from '@/components/payment/RazorpayPayment'
import { getLocalStorageItem } from '@/utils/local_storage/local_storage_handler'
import { LOCAL_STORAGE_NAME } from '@/utils/local_storage/local_storage_constant'

interface Feature {
  text: string
  value: string | boolean
}

interface Plan {
  id: number
  name: string
  price: string
  icon: 'megaphone' | 'star' | 'trophy' | 'award' | 'settings'
  highlight?: boolean
  bgColor?: string
  textColor?: string
  features: Feature[]
}

interface PlanItem {
  id: number
  plan_id: number
  item: {
    id: number
    name: string
    type: string
    valueType: 'NUMERIC' | 'BOOLEAN' | 'TEXT'
    category: string
    unit: string
    description: string
    iconName?: string
    displayOrder?: number
  }
  isIncluded: boolean
  numericValue: number | null
  textValue: string | null
  isUnlimited: boolean
}

interface ApiPlan {
  id: number
  name: string
  tagline: string
  price: string
  durationDays: number
  billingCycle: string
  isPopular: boolean
  isActive: boolean
  planItems: PlanItem[]
}

interface PricingPlansClientProps {
  plans: Plan[]
  featuresList: string[]
  apiPlans: ApiPlan[]
}

const iconMap = {
  megaphone: Megaphone,
  star: Star,
  trophy: Trophy,
  award: Award,
  settings: Settings,
}

function FeatureValue({ value }: { value: string | boolean }) {
  if (typeof value === 'boolean') {
    return value ? (
      <Check className="text-green-600 w-5 h-5 mx-auto" />
    ) : (
      <X className="text-red-500 w-5 h-5 mx-auto" />
    )
  }
  return <span className="block text-center">{value}</span>
}

// Animation Variants
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

function PlanCard({ plan, apiPlan }: { plan: Plan; apiPlan?: ApiPlan }) {
  const Icon = iconMap[plan.icon]
  const amount = apiPlan ? parseFloat(apiPlan.price) * 100 : 0 // Convert to paise
  
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{
        y: -8,
        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
        transition: { duration: 0.3 },
      }}
      className="bg-white border border-gray-200 shadow-lg transition-transform duration-300"
    >
      {/* Plan Header */}
      <div
        className={`p-6 flex flex-col items-center border-b border-gray-200 ${
          plan.bgColor || 'bg-gray-50'
        } transition-colors duration-300`}
      >
        <Icon
          className={`w-7 h-7 mb-3 transform transition-transform duration-300 hover:scale-110 ${
            plan.textColor || 'text-gray-800'
          }`}
        />
        <h3
          className={`text-lg font-semibold ${plan.textColor || 'text-gray-800'}`}
        >
          {plan.name}
        </h3>
        <p
          className={`text-2xl font-bold mt-2 ${
            plan.textColor || 'text-gray-800'
          }`}
        >
          {plan.price}
        </p>
      </div>

      {/* Features List */}
      <div className="p-6">
        <ul className="space-y-4 text-sm mb-6">
          {plan.features.map((f, i) => (
            <li key={i} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
              <span className="font-medium text-gray-700">{f.text}</span>
              <FeatureValue value={f.value} />
            </li>
          ))}
        </ul>
        
        {/* Subscribe Button */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <RazorpayPayment
            planId={plan.id}
            planName={plan.name}
            amount={amount}
          />
        </div>
      </div>
    </motion.div>
  )
}

export default function PricingPlansClient({ plans, featuresList, apiPlans }: PricingPlansClientProps) {
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const userData = getLocalStorageItem(LOCAL_STORAGE_NAME.userData) as { id: string } | null
    if (userData?.id) {
      setUserId(userData.id)
    }
  }, [])

  return (
    <div className="w-full py-16 bg-[#F8F9FA]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center text-3xl sm:text-4xl font-bold text-gray-800 mb-12"
        >
          Choose Your Plan
        </motion.h2>

        {/* Mobile Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-8 md:hidden"
        >
          {plans.map((plan, idx) => {
            const apiPlan = apiPlans.find(p => p.id === plan.id)
            return <PlanCard key={idx} plan={plan} apiPlan={apiPlan} />
          })}
        </motion.div>

        {/* Desktop Table */}
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
            style={{ gridTemplateColumns: `220px repeat(${plans.length}, minmax(200px, 1fr))` }}
          >
            <div className="grid" style={{ gridTemplateColumns: `220px repeat(${plans.length}, minmax(200px, 1fr))` }}>
              {/* Left Column Header */}
              <div className="bg-white p-6 border-b border-r border-gray-200">
                <h3 className="font-semibold text-gray-700 text-base">Feature / Benefit</h3>
              </div>

              {/* Plan Headers */}
              {plans.map((plan, idx) => {
                const Icon = iconMap[plan.icon]
                const apiPlan = apiPlans.find(p => p.id === plan.id)
                const amount = apiPlan ? parseFloat(apiPlan.price) * 100 : 0
                return (
                  <div
                    key={idx}
                    className={`p-6 text-center border-b border-r last:border-r-0 border-gray-200 ${
                      plan.bgColor || 'bg-gray-50'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <Icon
                        className={`w-7 h-7 mb-2 ${
                          plan.textColor || 'text-gray-800'
                        }`}
                      />
                      <h3
                        className={`text-base font-semibold ${
                          plan.textColor || 'text-gray-800'
                        }`}
                      >
                        {plan.name}
                      </h3>
                      <p
                        className={`text-xl font-bold mt-1 ${
                          plan.textColor || 'text-gray-800'
                        }`}
                      >
                        {plan.price}
                      </p>
                      {/* Subscribe Button */}
                      <div className="mt-4">
                        <RazorpayPayment
                          planId={plan.id}
                          planName={plan.name}
                          amount={amount}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Feature Rows */}
            {featuresList.map((featureName, featureIdx) => {
              const isLastRow = featureIdx === featuresList.length - 1
              return (
                <div
                  key={featureIdx}
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
                    
                    let featureValue: string | boolean = false
                    
                    if (planItem && planItem.isIncluded) {
                      if (planItem.item.valueType === 'BOOLEAN') {
                        featureValue = true
                      } else if (planItem.item.valueType === 'NUMERIC') {
                        if (planItem.isUnlimited) {
                          featureValue = 'Unlimited'
                        } else {
                          featureValue = planItem.numericValue?.toString() || '0'
                          if (planItem.item.unit && planItem.item.unit !== 'enabled' && planItem.item.unit !== 'listings') {
                            featureValue += ` ${planItem.item.unit}`
                          }
                        }
                      } else if (planItem.item.valueType === 'TEXT') {
                        featureValue = planItem.textValue || planItem.item.unit || 'Enabled'
                      } else {
                        featureValue = 'Enabled'
                      }
                    }
                    
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
            })}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

