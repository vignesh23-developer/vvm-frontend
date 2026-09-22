'use client'

import { useEffect, useState } from 'react'
import { useLoginModal } from '@/components/auth/LoginModalProvider'
import { postMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'
import { setLocalStorageItem } from '@/utils/local_storage/local_storage_handler'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'

interface KYCPaymentProps {
  onClose?: () => void
}

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function KYCPayment({ onClose }: KYCPaymentProps) {
  const { openLoginModal } = useLoginModal()
  const [loading, setLoading] = useState(false)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const { user: userData } = useAuth();

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
        if (document.body.contains(script)) {
          document.body.removeChild(script)
        }
      }
    }

    loadRazorpay()
  }, [])

  const handlePayment = async () => {
    try {
      setLoading(true)
      if (!userData || !userData.id) {
        toast.error('Please login to continue')
        const next =
          typeof window !== 'undefined'
            ? `${window.location.pathname}${window.location.search}` || '/'
            : '/'
        openLoginModal({ next })
        return
      }

      // Create KYC order
      const redirectUrl = `${window.location.origin}/kyc-callback`
      const orderResponse = await postMethod(
        appEndpoints.createKycOrder,
        { redirectUrl }
      )

      if (orderResponse.error) {
        toast.error(orderResponse.message || 'Failed to create KYC order')
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
        name: 'KYC Verification Payment',
        description: 'KYC Verification Fee',
        order_id: orderData.id,
        receipt: orderData.receipt,
        handler: async function (response: {
          razorpay_order_id: string
          razorpay_payment_id: string
          razorpay_signature: string
        }) {
          try {
            setLoading(true)

            // Verify payment and initiate KYC
            const verifyResponse = await postMethod(
              appEndpoints.verifyKycOrder,
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

            // Store verification data and redirect
            const kycData = verifyResponse.data as {
              success: boolean
              verificationId: string
              verificationUrl: string
              expiresInSeconds: number
              message?: string
            }

            if (kycData.verificationId && kycData.verificationUrl) {
              // Store verificationId in localStorage
              setLocalStorageItem('kyc_verification_pending', {
                verificationId: kycData.verificationId,
                timestamp: Date.now()
              })

              toast.success('Payment successful! Redirecting to verification...')
              setLoading(false)

              // Redirect to Surepass verification URL
              window.location.href = kycData.verificationUrl
            } else {
              toast.error('Failed to initiate KYC verification')
              setLoading(false)
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
          color: '#2a1407',
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
        className="px-6 py-2 bg-gray-400 text-white rounded cursor-not-allowed"
      >
        Loading...
      </button>
    )
  }

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className={`px-6 py-2 rounded font-medium transition-colors ${loading
          ? 'bg-gray-400 text-white cursor-not-allowed'
          : 'bg-[#2a1407] text-white hover:bg-[#5a2a0a]'
        }`}
    >
      {loading ? 'Processing...' : 'Pay ₹100 for KYC Verification'}
    </button>
  )
}

