// Type definitions for subscription components

export interface SubscriptionItem {
  id: number
  name: string
  type: string
  valueType: string
  category: string | null
  unit: string | null
  description: string | null
  basePrice: string
  defaultValue: number
  isPremium: boolean
  isAddon: boolean
  displayOrder: number
  iconName: string | null
  isActive: boolean
}

export interface SubscriptionPlanItem {
  id: number
  plan_id: number
  item_id: number
  item: SubscriptionItem
  isIncluded: boolean
  isConfigurable: boolean
  price: string
  numericValue: number
  textValue: string | null
  durationDays: number
  isUnlimited: boolean
  isHighlighted: boolean
  customSettings: any
}

export interface SubscriptionPlan {
  id: number
  name: string
  tagline: string
  price: string
  description: string
  durationDays: number
  billingCycle: string
  planItems?: SubscriptionPlanItem[]
}

export interface UserSubscription {
  id: number
  user_id: string
  plan_id: number
  plan?: SubscriptionPlan
  startDate: string
  endDate: string
  isActive: boolean
  autoRenew: boolean
  paidAmount: string
  status: string
  paymentStatus: string
  transactionId: string | null
  promoCodeUsed: string | null
  canceledAt: string | null
  cancellationReason: string | null
}

