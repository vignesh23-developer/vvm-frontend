import { appEndpoints } from '@/services/endpoints'
import PricingPlansClient from '@/components/Plans/PricingPlansClient'
import { generateStaticPageMetadata } from '@/lib/seo'

export const metadata = generateStaticPageMetadata(
  'Pricing Plans',
  'Choose the best plan to sell or rent your property fast on Vaazhga Valamudan.',
  '/pricing'
)

// Force dynamic rendering - don't try to statically generate this page
export const dynamic = 'force-dynamic'

// Mock Data Toggle
const USE_MOCK_DATA = true

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

// Mock Data for Development
const MOCK_API_PLANS: ApiPlan[] = [
  {
    id: 1,
    name: 'Free Plan',
    tagline: 'Basic listing to get you started',
    price: '0',
    durationDays: 30,
    billingCycle: 'MONTHLY',
    isPopular: false,
    isActive: true,
    planItems: [
      {
        id: 101,
        plan_id: 1,
        item: { id: 1, name: 'Property Listings', type: 'core', valueType: 'NUMERIC', category: 'listing', unit: 'listings', description: 'Number of properties you can list', displayOrder: 1 },
        isIncluded: true, numericValue: 1, textValue: null, isUnlimited: false
      },
      {
        id: 102, plan_id: 1,
        item: { id: 2, name: 'Featured Ads', type: 'marketing', valueType: 'NUMERIC', category: 'marketing', unit: 'ads', description: 'Number of featured advertisements', displayOrder: 2 },
        isIncluded: true, numericValue: 0, textValue: null, isUnlimited: false
      },
      {
        id: 103, plan_id: 1,
        item: { id: 3, name: 'Support Level', type: 'service', valueType: 'TEXT', category: 'service', unit: 'Standard', description: 'Customer support level', displayOrder: 3 },
        isIncluded: true, numericValue: null, textValue: 'Standard', isUnlimited: false
      }
    ]
  },
  {
    id: 2,
    name: 'Silver Plan',
    tagline: 'Enhanced visibility for faster results',
    price: '499',
    durationDays: 45,
    billingCycle: 'MONTHLY',
    isPopular: true,
    isActive: true,
    planItems: [
      {
        id: 201, plan_id: 2,
        item: { id: 1, name: 'Property Listings', type: 'core', valueType: 'NUMERIC', category: 'listing', unit: 'listings', description: 'Number of properties you can list', displayOrder: 1 },
        isIncluded: true, numericValue: 10, textValue: null, isUnlimited: false
      },
      {
        id: 202, plan_id: 2,
        item: { id: 2, name: 'Featured Ads', type: 'marketing', valueType: 'NUMERIC', category: 'marketing', unit: 'ads', description: 'Number of featured advertisements', displayOrder: 2 },
        isIncluded: true, numericValue: 3, textValue: null, isUnlimited: false
      },
      {
        id: 203, plan_id: 2,
        item: { id: 3, name: 'Support Level', type: 'service', valueType: 'TEXT', category: 'service', unit: 'Priority', description: 'Customer support level', displayOrder: 3 },
        isIncluded: true, numericValue: null, textValue: 'Priority', isUnlimited: false
      },
      {
        id: 204, plan_id: 2,
        item: { id: 4, name: 'Social Media Sharing', type: 'marketing', valueType: 'BOOLEAN', category: 'marketing', unit: '', description: 'Share on social media', displayOrder: 4 },
        isIncluded: true, numericValue: null, textValue: null, isUnlimited: false
      }
    ]
  },
  {
    id: 3,
    name: 'Gold Plan',
    tagline: 'The ultimate professional package',
    price: '999',
    durationDays: 60,
    billingCycle: 'MONTHLY',
    isPopular: false,
    isActive: true,
    planItems: [
      {
        id: 301, plan_id: 3,
        item: { id: 1, name: 'Property Listings', type: 'core', valueType: 'NUMERIC', category: 'listing', unit: 'listings', description: 'Number of properties you can list', displayOrder: 1 },
        isIncluded: true, numericValue: null, textValue: null, isUnlimited: true
      },
      {
        id: 302, plan_id: 3,
        item: { id: 2, name: 'Featured Ads', type: 'marketing', valueType: 'NUMERIC', category: 'marketing', unit: 'ads', description: 'Number of featured advertisements', displayOrder: 2 },
        isIncluded: true, numericValue: 15, textValue: null, isUnlimited: false
      },
      {
        id: 303, plan_id: 3,
        item: { id: 3, name: 'Support Level', type: 'service', valueType: 'TEXT', category: 'service', unit: '24/7 Premium', description: 'Customer support level', displayOrder: 3 },
        isIncluded: true, numericValue: null, textValue: '24/7 Premium', isUnlimited: false
      },
      {
        id: 304, plan_id: 3,
        item: { id: 4, name: 'Social Media Sharing', type: 'marketing', valueType: 'BOOLEAN', category: 'marketing', unit: '', description: 'Share on social media', displayOrder: 4 },
        isIncluded: true, numericValue: null, textValue: null, isUnlimited: false
      }
    ]
  },
  {
    id: 4,
    name: 'Business Pro',
    tagline: 'Annual savings for agencies',
    price: '8999',
    durationDays: 365,
    billingCycle: 'YEARLY',
    isPopular: false,
    isActive: true,
    planItems: [
      {
        id: 401, plan_id: 4,
        item: { id: 1, name: 'Property Listings', type: 'core', valueType: 'NUMERIC', category: 'listing', unit: 'listings', description: 'Number of properties you can list', displayOrder: 1 },
        isIncluded: true, numericValue: 100, textValue: null, isUnlimited: false
      },
      {
        id: 402, plan_id: 4,
        item: { id: 2, name: 'Featured Ads', type: 'marketing', valueType: 'NUMERIC', category: 'marketing', unit: 'ads', description: 'Number of featured advertisements', displayOrder: 2 },
        isIncluded: true, numericValue: 50, textValue: null, isUnlimited: false
      },
      {
        id: 403, plan_id: 4,
        item: { id: 3, name: 'Support Level', type: 'service', valueType: 'TEXT', category: 'service', unit: 'Dedicated Manager', description: 'Customer support level', displayOrder: 3 },
        isIncluded: true, numericValue: null, textValue: 'Dedicated Manager', isUnlimited: false
      }
    ]
  },
  {
    id: 5,
    name: 'Single Ad Blast',
    tagline: 'Boost your property visibility once',
    price: '99',
    durationDays: 7,
    billingCycle: 'ONE-TIME',
    isPopular: false,
    isActive: true,
    planItems: [
      {
        id: 501, plan_id: 5,
        item: { id: 1, name: 'Property Listings', type: 'core', valueType: 'NUMERIC', category: 'listing', unit: 'listings', description: 'Number of properties you can list', displayOrder: 1 },
        isIncluded: true, numericValue: 1, textValue: null, isUnlimited: false
      },
      {
        id: 502, plan_id: 5,
        item: { id: 2, name: 'Priority Indexing', type: 'marketing', valueType: 'BOOLEAN', category: 'marketing', unit: '', description: 'Priority indexing', displayOrder: 2 },
        isIncluded: true, numericValue: null, textValue: null, isUnlimited: false
      }
    ]
  }
]

async function fetchPricingPlans(): Promise<ApiPlan[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
    const url = `${apiUrl}${appEndpoints.getPublicPlans}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Dynamic page - fetch fresh data each time
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
  const apiPlans = USE_MOCK_DATA ? MOCK_API_PLANS : await fetchPricingPlans()
  const plans = apiPlans.map(plan => transformPlan(plan))
  const featuresList = getUniqueFeatures(apiPlans)

  return <PricingPlansClient plans={plans} featuresList={featuresList} apiPlans={apiPlans} />
}
