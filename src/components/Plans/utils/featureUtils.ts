import { PlanItem } from '../types'

/**
 * Calculate feature value based on plan item configuration
 */
export function calculateFeatureValue(planItem: PlanItem | undefined): string | boolean {
  if (!planItem || !planItem.isIncluded) {
    return false
  }

  switch (planItem.item.valueType) {
    case 'BOOLEAN':
      return true

    case 'NUMERIC':
      if (planItem.isUnlimited) {
        return 'Unlimited'
      }
      
      let value = planItem.numericValue?.toString() || '0'
      
      // Add unit if it exists and is not generic
      if (planItem.item.unit && 
          planItem.item.unit !== 'enabled' && 
          planItem.item.unit !== 'listings') {
        value += ` ${planItem.item.unit}`
      }
      
      return value

    case 'TEXT':
      return planItem.textValue || planItem.item.unit || 'Enabled'

    default:
      return 'Enabled'
  }
}

/**
 * Convert price to paise (for Razorpay)
 */
export function convertToPaise(price: string): number {
  return parseFloat(price) * 100
}

