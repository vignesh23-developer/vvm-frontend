'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { postMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'
import { getLocalStorageItem } from '@/utils/local_storage/local_storage_handler'
import { LOCAL_STORAGE_NAME } from '@/utils/local_storage/local_storage_constant'
import toast from 'react-hot-toast'

interface RazorpayPaymentProps {
  planId: number
  planName: string
  amount: number
  onClose?: () => void
}

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function RazorpayPayment({ planId, planName, amount, onClose }: RazorpayPaymentProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpay = () => {
      if (window.Razorpay) {
        setRazorpayLoaded(true)
        return
      }

      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true
      script.onload = () => {
        setRazorpayLoaded(true)
      }
      script.onerror = () => {
        toast.error('Failed to load Razorpay. Please refresh the page.')
      }
      document.body.appendChild(script)

      return () => {
        document.body.removeChild(script)
      }
    }

    loadRazorpay()
  }, [])

  const handlePayment = async () => {
    try {
      setLoading(true)

      // Get user ID from localStorage
      const userData = getLocalStorageItem(LOCAL_STORAGE_NAME.userData) as {
        id: string
        firstName?: string
        lastName?: string
        email?: string
      } | null
      if (!userData || !userData.id) {
        toast.error('Please login to continue')
        router.push('/login')
        return
      }

      const userId = userData.id

      // Create subscription order
      const orderResponse = await postMethod(
        appEndpoints.createSubscriptionOrder(userId),
        { plan_id: planId }
      )

      if (orderResponse.error) {
        toast.error(orderResponse.message || 'Failed to create order')
        setLoading(false)
        return
      }

      const orderData = orderResponse.data as {
        id: string
        amount: number
        currency: string
        receipt: string
      }

      if (!window.Razorpay) {
        toast.error('Razorpay is not loaded. Please refresh the page.')
        setLoading(false)
        return
      }

      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
      if (!razorpayKey) {
        toast.error('Razorpay key is not configured')
        setLoading(false)
        return
      }

      // Initialize Razorpay checkout
      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Subscription Payment',
        description: `Subscription for ${planName}`,
        order_id: orderData.id,
        receipt: orderData.receipt,
        handler: async function (response: {
          razorpay_order_id: string
          razorpay_payment_id: string
          razorpay_signature: string
        }) {
          try {
            setLoading(true)

            // Verify payment
            const verifyResponse = await postMethod(
              appEndpoints.verifySubscriptionPayment(userId),
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            )

            if (verifyResponse.error) {
              toast.error(verifyResponse.message || 'Payment verification failed')
              setLoading(false)
              return
            }

            // Success
            toast.success('Subscription activated successfully!')
            setLoading(false)
            
            // Redirect to subscriptions page
            router.push('/view-subscriptions')
            
            if (onClose) {
              onClose()
            }
          } catch (error) {
            console.error('Payment verification error:', error)
            toast.error('Payment verification failed. Please contact support.')
            setLoading(false)
          }
        },
        prefill: {
          name: userData.firstName ? `${userData.firstName} ${userData.lastName || ''}`.trim() : '',
          email: userData.email || '',
        },
        theme: {
          color: '#3b1804',
        },
        modal: {
          ondismiss: function () {
            setLoading(false)
            if (onClose) {
              onClose()
            }
          },
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
      setLoading(false)
    } catch (error) {
      console.error('Payment error:', error)
      toast.error('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  if (!razorpayLoaded) {
    return (
      <button
        disabled
        className="px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed"
      >
        Loading...
      </button>
    )
  }

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className={`px-6 py-2 rounded font-medium transition-colors ${
        loading
          ? 'bg-gray-400 text-white cursor-not-allowed'
          : 'bg-[#3b1804] text-white hover:bg-[#5a2a0a]'
      }`}
    >
      {loading ? 'Processing...' : 'Subscribe'}
    </button>
  )
}

