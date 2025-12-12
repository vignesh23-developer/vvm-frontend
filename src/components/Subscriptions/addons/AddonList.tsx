'use client'

import { useEffect, useState } from 'react'
import { getMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'
import toast from 'react-hot-toast'
import AddonItem from './AddonItem'
import { UserSubscription, SubscriptionItem } from '../types'

interface UserPurchasedItem {
  id: number
  user_subscription_id: number
  item_id: number
  plan_item_id: number | null
  paidAmount: string
  startDate: string
  endDate: string | null
  isActive: boolean
  appliedTo: string | null
  transactionId: string | null
  item: SubscriptionItem
  itemSettings?: {
    type: string
    basePrice: number
    paidAmount: number
    quantity?: number
  }
}

interface AddonListProps {
  subscription: UserSubscription
  userId: string
}

export default function AddonList({ subscription, userId }: AddonListProps) {
  const [purchasedAddons, setPurchasedAddons] = useState<UserPurchasedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [refetchTrigger, setRefetchTrigger] = useState(0)

  // Extract addons from plan items
  const availableAddons = subscription.plan?.planItems?.filter(
    planItem => planItem.item?.isAddon === true
  ) || []

  useEffect(() => {
    const fetchPurchasedAddons = async () => {
      try {
        setLoading(true)
        const response = await getMethod(appEndpoints.getUserAddons(userId))

        if (response.error) {
          console.error('Failed to fetch purchased addons:', response.message)
          setPurchasedAddons([])
        } else if (response.data) {
          // The API returns {success: true, data: [...]} structure
          // So we need to access response.data.data for the actual array
          const responseData: any = response.data
          const actualData = responseData.data || responseData
          const addonsData = Array.isArray(actualData) ? actualData : []
          setPurchasedAddons(addonsData)
        } else {
          setPurchasedAddons([])
        }
      } catch (error) {
        console.error('Error fetching purchased addons:', error)
        toast.error('Failed to load purchased addons')
        setPurchasedAddons([])
      } finally {
        setLoading(false)
      }
    }

    fetchPurchasedAddons()
  }, [userId, refetchTrigger])

  const handlePurchaseSuccess = () => {
    setRefetchTrigger(prev => prev + 1)
    toast.success('Addon purchased successfully!')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2a1407]"></div>
        <span className="ml-3 text-gray-600">Loading addons...</span>
      </div>
    )
  }

  if (availableAddons.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No addon features available for this plan.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-gray-800">
          Available Addon Features
        </h4>
        <span className="text-sm text-gray-500">
          {availableAddons.length} addon{availableAddons.length !== 1 ? 's' : ''} available
        </span>
      </div>

      {availableAddons.map(planItem => {
        // Find if this addon has been purchased
        const purchasedAddon = Array.isArray(purchasedAddons)
          ? purchasedAddons.find(purchased => purchased.item_id === planItem.item_id)
          : undefined

        return (
          <AddonItem
            key={planItem.id}
            addon={{
              item: planItem.item,
              basePrice: planItem.item.basePrice,
              isConfigurable: planItem.isConfigurable
            }}
            purchasedAddon={purchasedAddon}
            subscriptionId={subscription.id}
            userId={userId}
            onPurchaseSuccess={handlePurchaseSuccess}
          />
        )
      })}
    </div>
  )
}

