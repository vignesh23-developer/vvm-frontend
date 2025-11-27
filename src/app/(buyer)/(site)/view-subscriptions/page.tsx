'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'
import { getLocalStorageItem } from '@/utils/local_storage/local_storage_handler'
import { LOCAL_STORAGE_NAME } from '@/utils/local_storage/local_storage_constant'
import { Check, X, Calendar, CreditCard, Package } from 'lucide-react'
import { motion } from 'framer-motion'
import { ResponseDTO } from '@/components/dto/response_dto'

interface SubscriptionPlan {
  id: number
  name: string
  tagline: string
  price: string
  description: string
}

interface UserSubscription {
  id: number
  user_id: number
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

export default function ViewSubscriptions() {
  const router = useRouter()
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setLoading(true)
        setError(null)

        const userData = getLocalStorageItem(LOCAL_STORAGE_NAME.userData) as { id: string } | null
        if (!userData || !userData.id) {
          router.push('/login')
          return
        }

        const userId = userData.id
        const response = await getMethod<ResponseDTO<UserSubscription[]>>(
          appEndpoints.getUserSubscription(userId)
        )

        if (response.error) {
          setError(response.message || 'Failed to fetch subscriptions')
          return
        }

         console.log('response', response);

         // Handle response structure: response.data.data.data contains the subscription object
         // The API returns a single subscription object, not an array
         const subscriptionData = response.data?.data
         
         // If it's a single object, wrap it in an array
         // If it's already an array, use it as is
         const data = subscriptionData 
           ? (Array.isArray(subscriptionData) ? subscriptionData : [subscriptionData])
           : []

         setSubscriptions(data)
      } catch (err) {
        console.error('Error fetching subscriptions:', err)
        setError('An error occurred while fetching subscriptions')
      } finally {
        setLoading(false)
      }
    }

    fetchSubscriptions()
  }, [router])

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
    return `₹${numAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const getStatusBadge = (status: string, isActive: boolean) => {
    if (!isActive || status === 'expired' || status === 'canceled') {
      return (
        <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
          {status === 'canceled' ? 'Canceled' : status === 'expired' ? 'Expired' : 'Inactive'}
        </span>
      )
    }
    return (
      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
        Active
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3b1804] mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading subscriptions...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <X className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            My Subscriptions
          </h1>
          <p className="text-gray-600">View and manage your active subscriptions</p>
        </motion.div>

        {/* Subscriptions List */}
        {subscriptions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white border border-gray-200 rounded-lg p-12 text-center"
          >
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Subscriptions Found</h3>
            <p className="text-gray-600 mb-6">You don't have any active subscriptions yet.</p>
            <button
              onClick={() => router.push('/pricing')}
              className="px-6 py-2 bg-[#3b1804] text-white rounded hover:bg-[#5a2a0a] transition-colors"
            >
              Browse Plans
            </button>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            {subscriptions.map((subscription, index) => (
              <motion.div
                key={subscription.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
              >
                <div className="p-6">
                  {/* Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-1">
                        {subscription.plan?.name || 'Unknown Plan'}
                      </h3>
                      {subscription.plan?.tagline && (
                        <p className="text-gray-600">{subscription.plan.tagline}</p>
                      )}
                    </div>
                    {getStatusBadge(subscription.status, subscription.isActive)}
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Start Date */}
                    <div className="flex items-start">
                      <Calendar className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Start Date</p>
                        <p className="font-semibold text-gray-800">{formatDate(subscription.startDate)}</p>
                      </div>
                    </div>

                    {/* End Date */}
                    <div className="flex items-start">
                      <Calendar className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500 mb-1">End Date</p>
                        <p className="font-semibold text-gray-800">{formatDate(subscription.endDate)}</p>
                      </div>
                    </div>

                    {/* Amount Paid */}
                    <div className="flex items-start">
                      <CreditCard className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Amount Paid</p>
                        <p className="font-semibold text-gray-800">
                          {subscription.paidAmount ? formatCurrency(subscription.paidAmount) : 'N/A'}
                        </p>
                      </div>
                    </div>

                    {/* Payment Status */}
                    <div className="flex items-start">
                      <Check className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Payment Status</p>
                        <p className="font-semibold text-gray-800">
                          {subscription.paymentStatus || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex flex-wrap gap-4 text-sm">
                      {subscription.autoRenew && (
                        <div className="flex items-center">
                          <Check className="w-4 h-4 text-green-600 mr-2" />
                          <span className="text-gray-600">Auto-renewal enabled</span>
                        </div>
                      )}
                      {subscription.transactionId && (
                        <div>
                          <span className="text-gray-500">Transaction ID: </span>
                          <span className="text-gray-800 font-mono">{subscription.transactionId}</span>
                        </div>
                      )}
                      {subscription.promoCodeUsed && (
                        <div>
                          <span className="text-gray-500">Promo Code: </span>
                          <span className="text-gray-800">{subscription.promoCodeUsed}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cancellation Info */}
                  {subscription.canceledAt && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
                      <p className="text-sm text-red-800">
                        <strong>Canceled on:</strong> {formatDate(subscription.canceledAt)}
                      </p>
                      {subscription.cancellationReason && (
                        <p className="text-sm text-red-700 mt-1">
                          <strong>Reason:</strong> {subscription.cancellationReason}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

