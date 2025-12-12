'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import { postMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'
import toast from 'react-hot-toast'

interface RazorpayAddonButtonProps {
  itemId: number
  itemName: string
  basePrice: number
  quantity: number
  subscriptionId: number
  userId: string
  onSuccess: () => void
  disabled?: boolean
  buttonText?: string
}

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function RazorpayAddonButton({
  itemId,
  itemName,
  basePrice,
  quantity,
  subscriptionId,
  userId,
  onSuccess,
  disabled = false,
  buttonText = 'Purchase'
}: RazorpayAddonButtonProps) {
  const router = useRouter()
  const { user: userData } = useAuth()
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

  const handlePurchase = async () => {
    try {
      setLoading(true)

      // Verify user authentication
      if (!userData || !(userData as { id?: string }).id) {
        toast.error('Please login to continue')
        router.push('/login')
        return
      }

      // Calculate total amount in paise
      const totalAmount = basePrice * quantity
      const amountInPaise = Math.round(totalAmount * 100)

      // Step 1: Create addon order
      const orderResponse = await postMethod(
        appEndpoints.createAddonOrder(userId),
        {
          item_id: itemId,
          userSubscription_id: subscriptionId,
          quantity: quantity // Pass quantity for NUMERIC type addons
        }
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

      // Step 2: Initialize Razorpay checkout
      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Addon Purchase',
        description: `Purchase ${itemName} (Qty: ${quantity})`,
        order_id: orderData.id,
        receipt: orderData.receipt,
        handler: async function (response: {
          razorpay_order_id: string
          razorpay_payment_id: string
          razorpay_signature: string
        }) {
          try {
            setLoading(true)

            // Step 3: Verify addon payment
            const verifyResponse = await postMethod(
              appEndpoints.verifyAddonPayment(userId),
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

            // Success - call the callback to refetch addons
            toast.success('Addon purchased successfully!')
            setLoading(false)
            onSuccess()
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
          color: '#2a1407',
        },
        modal: {
          ondismiss: function () {
            setLoading(false)
          },
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
      setLoading(false)
    } catch (error) {
      console.error('Addon purchase error:', error)
      toast.error('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  if (!razorpayLoaded) {
    return (
      <button
        disabled
        className="px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed text-sm"
      >
        Loading...
      </button>
    )
  }

  return (
    <button
      onClick={handlePurchase}
      disabled={loading || disabled}
      className={`px-4 py-2 rounded font-medium text-sm transition-colors ${loading || disabled
          ? 'bg-gray-400 text-white cursor-not-allowed'
          : 'bg-[#2a1407] text-white hover:bg-[#5a2a0a]'
        }`}
    >
      {loading ? 'Processing...' : buttonText}
    </button>
  )
}

