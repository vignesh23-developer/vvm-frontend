import { appEndpoints } from '@/services/endpoints'
import PricingPlansClient from './PricingPlansClient'

// API Response Types
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

// Icon mapping based on plan name
function getIconForPlan(planName: string): Plan['icon'] {
  const name = planName.toLowerCase()
  if (name.includes('bronze') || name.includes('free') || name.includes('trial')) return 'megaphone'
  if (name.includes('silver')) return 'star'
  if (name.includes('gold')) return 'trophy'
  if (name.includes('platinum')) return 'award'
  if (name.includes('custom')) return 'settings'
  return 'star' // default
}

// Transform API plan to component Plan
function transformPlan(apiPlan: ApiPlan, allFeatureNames?: Set<string>): Plan {
  const icon = getIconForPlan(apiPlan.name)
  
  // Determine styling based on plan
  let bgColor: string | undefined
  let textColor: string | undefined
  let highlight = false

  if (apiPlan.isPopular) {
    highlight = true
    bgColor = 'bg-yellow-400'
    textColor = 'text-white'
  } else if (apiPlan.name.toLowerCase().includes('bronze') || apiPlan.name.toLowerCase().includes('free')) {
    bgColor = 'bg-gray-700'
    textColor = 'text-white'
  }

  // Create a map of planItems by item name for quick lookup
  const planItemsMap = new Map<string, PlanItem>()
  apiPlan.planItems.forEach(item => {
    planItemsMap.set(item.item.name, item)
  })

  // Transform planItems to features
  // For mobile: only show included items
  // For desktop: show all features (handled in client component)
  const features: Feature[] = apiPlan.planItems
    .filter(item => item.isIncluded) // Mobile view: only included items
    .map(item => {
      const featureText = item.item.name
      let featureValue: string | boolean

      if (item.item.valueType === 'BOOLEAN') {
        featureValue = item.isIncluded
      } else if (item.item.valueType === 'NUMERIC') {
        if (item.isUnlimited) {
          featureValue = 'Unlimited'
        } else {
          featureValue = item.numericValue?.toString() || '0'
          if (item.item.unit && item.item.unit !== 'enabled' && item.item.unit !== 'listings') {
            featureValue += ` ${item.item.unit}`
          }
        }
      } else if (item.item.valueType === 'TEXT') {
        featureValue = item.textValue || item.item.unit || 'Enabled'
      } else {
        featureValue = item.isIncluded ? 'Enabled' : 'Disabled'
      }

      return {
        text: featureText,
        value: featureValue,
      }
    })

  // Format price
  const formattedPrice = apiPlan.price ? `₹${parseFloat(apiPlan.price).toLocaleString('en-IN')}` : 'Contact Admin'

  return {
    id: apiPlan.id,
    name: apiPlan.name,
    price: formattedPrice,
    icon,
    highlight,
    bgColor,
    textColor,
    features,
  }
}

// Get unique feature list from all plans for the desktop table
function getUniqueFeatures(apiPlans: ApiPlan[]): string[] {
  const featureSet = new Set<string>()
  const featureOrderMap = new Map<string, number>()
  
  apiPlans.forEach(plan => {
    plan.planItems.forEach(item => {
      featureSet.add(item.item.name)
      // Store the minimum display order for each feature
      const currentOrder = featureOrderMap.get(item.item.name)
      const itemOrder = item.item.displayOrder ?? 999
      if (currentOrder === undefined || itemOrder < currentOrder) {
        featureOrderMap.set(item.item.name, itemOrder)
      }
    })
  })
  
  return Array.from(featureSet).sort((a, b) => {
    const orderA = featureOrderMap.get(a) ?? 999
    const orderB = featureOrderMap.get(b) ?? 999
    if (orderA !== orderB) return orderA - orderB
    return a.localeCompare(b)
  })
}

async function fetchPricingPlans(): Promise<ApiPlan[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
    const url = `${apiUrl}${appEndpoints.getPublicPlans}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'force-cache', // Static page - cache the data
      next: { revalidate: 3600 }, // Revalidate every hour
    })

    if (!response.ok) {
      console.error('Failed to fetch pricing plans:', response.statusText)
      return []
    }

    const data = await response.json()
    
    // Handle the response structure: response.data.data (as shown in console.log)
    // The API returns: { data: { data: [...] } }
    const plans = data?.data?.data || data?.data || (Array.isArray(data) ? data : [])
    
    if (Array.isArray(plans)) {
      return plans.filter((plan: ApiPlan) => plan.isActive)
    }
    
    return []
  } catch (error) {
    console.error('Error fetching pricing plans:', error)
    return []
  }
}

export default async function PricingPlans() {
  const apiPlans = await fetchPricingPlans()
  const plans = apiPlans.map(plan => transformPlan(plan))
  const featuresList = getUniqueFeatures(apiPlans)

  return <PricingPlansClient plans={plans} featuresList={featuresList} apiPlans={apiPlans} />
}
