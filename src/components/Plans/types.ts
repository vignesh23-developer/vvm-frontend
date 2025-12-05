// Type definitions for pricing components

export interface Feature {
  text: string
  value: string | boolean
}

export interface Plan {
  id: number
  name: string
  price: string
  icon: 'megaphone' | 'star' | 'trophy' | 'award' | 'settings'
  highlight?: boolean
  bgColor?: string
  textColor?: string
  features: Feature[]
  planAction?: 'current' | 'upgrade' | 'downgrade' | 'subscribe'
}

export interface PlanItem {
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

export interface ApiPlan {
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

export interface PricingPlansClientProps {
  plans: Plan[]
  featuresList: string[]
  apiPlans: ApiPlan[]
}

