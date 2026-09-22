import { useState } from 'react'
import { XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { postMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'
import { UserSubscription } from './types'

interface SubscriptionActionsProps {
  subscription: UserSubscription
  userId: string
  onActionComplete?: () => void
}

/**
 * Action buttons for subscription (Cancel only)
 */
export function SubscriptionActions({ subscription, userId, onActionComplete }: SubscriptionActionsProps) {
  const [canceling, setCanceling] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  const handleCancel = async () => {
    try {
      setCanceling(true)
      
      const response = await postMethod(
        appEndpoints.cancelSubscription(userId, subscription.id),
        { reason: 'User requested cancellation' }
      )

      if (response.error) {
        toast.error(response.message || 'Failed to cancel subscription')
        return
      }

      toast.success('Subscription canceled successfully')
      setShowCancelConfirm(false)
      onActionComplete?.()
    } catch (err) {
      toast.error('An error occurred while canceling subscription')
    } finally {
      setCanceling(false)
    }
  }

  return (
    <div className="border-t border-gray-200 pt-4">
      {/* Cancel Button */}
      {!showCancelConfirm ? (
        <button
          onClick={() => setShowCancelConfirm(true)}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          <XCircle className="w-4 h-4 mr-2" />
          Cancel Subscription
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Are you sure you want to cancel?</span>
          <button
            onClick={handleCancel}
            disabled={canceling}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {canceling ? 'Canceling...' : 'Yes, Cancel'}
          </button>
          <button
            onClick={() => setShowCancelConfirm(false)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
          >
            No, Keep It
          </button>
        </div>
      )}
    </div>
  )
}

