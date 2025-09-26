'use client'

import {
  Check,
  X,
  Megaphone,
  Star,
  Trophy,
  Award,
  Settings,
} from 'lucide-react'

interface Feature {
  text: string
  value: string | boolean
}

interface Plan {
  name: string
  price: string
  icon: keyof typeof iconMap
  highlight?: boolean
  bgColor?: string
  textColor?: string
  features: Feature[]
}

const featuresList = [
  'Listing Value Limit',
  'Active Listings',
  'Plan Validity',
  'Leaton Purchases',
  'Lead Protection',
  'Flag',
  'Protection',
]

const plans: Plan[] = [
  {
    name: 'Free Ad (Trial)',
    price: '₹0',
    icon: 'megaphone',
    bgColor: 'bg-gray-700',
    textColor: 'text-white',
    features: [
      { text: 'Listing Value Limit', value: 'Up to ₹26L' },
      { text: 'Active Listings', value: '1 Basic Ad' },
      { text: 'Plan Validity', value: 'Not available' },
      { text: 'Leaton Purchases', value: false },
      { text: 'Lead Protection', value: true },
      { text: 'Flag', value: true },
      { text: 'Protection', value: true },
    ],
  },
  {
    name: 'Silver',
    price: '₹499',
    icon: 'star',
    features: [
      { text: 'Listing Value Limit', value: 'Up to 5 bases up ₹5L' },
      { text: 'Active Listings', value: '39 (Optional)' },
      { text: 'Plan Validity', value: '₹999 (Optional)' },
      { text: 'Leaton Purchases', value: 'Chat / Email' },
      { text: 'Lead Protection', value: true },
      { text: 'Flag', value: true },
      { text: 'Protection', value: true },
    ],
  },
  {
    name: 'Gold',
    price: '₹999',
    icon: 'trophy',
    highlight: true,
    bgColor: 'bg-yellow-400',
    textColor: 'text-white',
    features: [
      { text: 'Listing Value Limit', value: '10 Listings' },
      { text: 'Active Listings', value: 'Free' },
      { text: 'Plan Validity', value: 'Free' },
      { text: 'Leaton Purchases', value: 'Priority Support' },
      { text: 'Lead Protection', value: true },
      { text: 'Flag', value: true },
      { text: 'Protection', value: true },
    ],
  },
  {
    name: 'Platinum',
    price: '₹1999',
    icon: 'award',
    features: [
      { text: 'Listing Value Limit', value: 'Up to 5 Listings' },
      { text: 'Active Listings', value: '20 Listings' },
      { text: 'Plan Validity', value: 'Free' },
      { text: 'Leaton Purchases', value: 'Priority Support' },
      { text: 'Lead Protection', value: true },
      { text: 'Flag', value: true },
      { text: 'Protection', value: true },
    ],
  },
  {
    name: 'Custom',
    price: 'Contact Admin',
    icon: 'settings',
    features: [
      { text: 'Listing Value Limit', value: 'Custom' },
      { text: 'Active Listings', value: 'Custom' },
      { text: 'Plan Validity', value: 'Free' },
      { text: 'Leaton Purchases', value: 'Free' },
      { text: 'Lead Protection', value: true },
      { text: 'Flag', value: true },
      { text: 'Protection', value: true },
    ],
  },
]

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
      <Check className="text-green-600 w-5 h-5" />
    ) : (
      <X className="text-red-500 w-5 h-5" />
    )
  }
  return <span>{value}</span>
}

function PlanCard({ plan }: { plan: Plan }) {
  const Icon = iconMap[plan.icon]
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div
        className={`rounded-lg p-3 flex flex-col items-center ${
          plan.bgColor || 'bg-gray-100'
        }`}
      >
        <Icon className={`w-6 h-6 ${plan.textColor || 'text-gray-800'}`} />
        <h3
          className={`mt-2 font-semibold ${plan.textColor || 'text-gray-800'}`}
        >
          {plan.name}
        </h3>
        <p
          className={`text-lg font-bold mt-1 ${
            plan.textColor || 'text-gray-800'
          }`}
        >
          {plan.price}
        </p>
      </div>
      <ul className="mt-6 space-y-4 text-sm text-gray-700">
        {plan.features.map((f, i) => (
          <li key={i} className="flex justify-between">
            <span className="font-medium">{f.text}</span>
            <FeatureValue value={f.value} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function PricingPlans() {
  return (
    <div className="w-full p-15 bg-[#F0F0F0]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Mobile stacked */}
        <div className="grid grid-cols-1 gap-8 md:hidden">
          {plans.map((plan, idx) => (
            <PlanCard key={idx} plan={plan} />
          ))}
        </div>

        {/* Desktop comparison table */}
        <div className="hidden md:block overflow-x-auto">
          <div className="grid grid-cols-[200px_repeat(5,minmax(180px,1fr))] rounded-2xl shadow-md overflow-hidden">
            {/* Left Features Column */}
            <div className="bg-white p-6 border-r">
              <h3 className="font-semibold text-gray-700">Feature / Benefit</h3>
              <ul className="mt-6 space-y-6 text-sm text-gray-600">
                {featuresList.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
            </div>

            {/* Plan Columns */}
            {plans.map((plan, idx) => {
              const Icon = iconMap[plan.icon]
              return (
                <div
                  key={idx}
                  className="p-6 text-center border-r last:border-r-0 bg-white"
                >
                  <div
                    className={`rounded-lg p-3 flex flex-col items-center ${
                      plan.bgColor || 'bg-gray-100'
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 ${plan.textColor || 'text-gray-800'}`}
                    />
                    <h3
                      className={`mt-2 font-semibold ${
                        plan.textColor || 'text-gray-800'
                      }`}
                    >
                      {plan.name}
                    </h3>
                    <p
                      className={`text-lg font-bold mt-1 ${
                        plan.textColor || 'text-gray-800'
                      }`}
                    >
                      {plan.price}
                    </p>
                  </div>
                  <ul className="mt-6 space-y-6 text-sm text-gray-700">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex justify-center">
                        <FeatureValue value={f.value} />
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
