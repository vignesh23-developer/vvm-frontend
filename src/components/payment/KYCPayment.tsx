'use client'

import { useCallback, useEffect, useState } from 'react'
import { useLoginModal } from '@/components/auth/LoginModalProvider'
import { postMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'
import { setLocalStorageItem } from '@/utils/local_storage/local_storage_handler'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import toast from 'react-hot-toast'

interface KYCPaymentProps {
  onClose?: () => void
}

interface RazorpayPaymentResponse {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

interface RazorpayOrder {
  id: string
  amount: number
  currency: string
  receipt?: string
}

interface KYCVerificationResponse {
  success: boolean
  verificationId: string
  verificationUrl: string
  expiresInSeconds: number
  message?: string
}

interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  prefill: {
    name: string
    email: string
  }
  theme: {
    color: string
  }
  handler: (response: RazorpayPaymentResponse) => Promise<void>
  modal: {
    ondismiss: () => void
  }
}

interface RazorpayInstance {
  open: () => void
  on: (
    event: 'payment.failed',
    handler: (response: {
      error?: {
        description?: string
        reason?: string
      }
    }) => void,
  ) => void
}

interface RazorpayConstructor {
  new (options: RazorpayOptions): RazorpayInstance
}

declare global {
  interface Window {
    Razorpay: any
  }
}

const RAZORPAY_SCRIPT_URL =
  'https://checkout.razorpay.com/v1/checkout.js'

const KYC_CALLBACK_PATH = '/kyc-callback'

function isValidVerificationUrl(value: string): boolean {
  try {
    const url = new URL(value)

    return url.protocol === 'https:'
  } catch {
    return false
  }
}

export default function KYCPayment({ onClose }: KYCPaymentProps) {
  const { openLoginModal } = useLoginModal()
  const { user: userData } = useAuth()

  const [loading, setLoading] = useState(false)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)

  useEffect(() => {
    let active = true
    let script = document.querySelector<HTMLScriptElement>(
      `script[src="${RAZORPAY_SCRIPT_URL}"]`,
    )
    let createdScript = false

    const handleLoad = () => {
      if (!active) return

      if (window.Razorpay) {
        setRazorpayLoaded(true)
      } else {
        toast.error('Razorpay could not initialize. Please refresh the page.')
      }
    }

    const handleError = () => {
      if (active) {
        toast.error('Failed to load Razorpay. Please refresh the page.')
      }
    }

    if (window.Razorpay) {
      setRazorpayLoaded(true)
      return
    }

    if (!script) {
      script = document.createElement('script')
      script.src = RAZORPAY_SCRIPT_URL
      script.async = true
      script.dataset.razorpayCheckout = 'true'
      createdScript = true
    }

    script.addEventListener('load', handleLoad)
    script.addEventListener('error', handleError)

    if (createdScript) {
      document.body.appendChild(script)
    } else if (window.Razorpay) {
      handleLoad()
    }

    return () => {
      active = false
      script?.removeEventListener('load', handleLoad)
      script?.removeEventListener('error', handleError)

      // Keep the shared Razorpay script loaded for other components.
    }
  }, [])

  const handlePayment = useCallback(async () => {
    if (loading) return

    if (!userData?.id) {
      toast.error('Please login to continue')

      const next =
        `${window.location.pathname}${window.location.search}` || '/'

      openLoginModal({ next })
      return
    }

    if (!razorpayLoaded || !window.Razorpay) {
      toast.error('Razorpay is not loaded. Please try again.')
      return
    }

    const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID

    if (!razorpayKey) {
      toast.error('Razorpay key is not configured')
      return
    }

    setLoading(true)

    try {
      const redirectUrl = `${window.location.origin}${KYC_CALLBACK_PATH}`

      const orderResponse = await postMethod(
        appEndpoints.createKycOrder,
        { redirectUrl },
      )

      if (orderResponse?.error) {
        toast.error(orderResponse.message || 'Failed to create KYC order')
        return
      }

      const orderData = orderResponse?.data as RazorpayOrder | undefined

      if (
        !orderData?.id ||
        typeof orderData.amount !== 'number' ||
        !orderData.currency
      ) {
        toast.error('Invalid payment order received from the server')
        return
      }

      const options: RazorpayOptions = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'KYC Verification Payment',
        description: 'KYC Verification Fee',
        order_id: orderData.id,

        prefill: {
          name: userData.firstName
            ? `${userData.firstName} ${userData.lastName || ''}`.trim()
            : '',
          email: userData.email || '',
        },

        theme: {
          color: '#2a1407',
        },

        handler: async (paymentResponse) => {
          setLoading(true)

          try {
            const verifyResponse = await postMethod(
              appEndpoints.verifyKycOrder,
              {
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
              },
            )

            if (verifyResponse?.error) {
              toast.error(
                verifyResponse.message || 'Payment verification failed',
              )
              return
            }

            const kycData =
              verifyResponse?.data as KYCVerificationResponse | undefined

            if (
              !kycData?.verificationId ||
              !kycData?.verificationUrl ||
              !isValidVerificationUrl(kycData.verificationUrl)
            ) {
              toast.error('Failed to initiate KYC verification')
              return
            }

            setLocalStorageItem('kyc_verification_pending', {
              verificationId: kycData.verificationId,
              timestamp: Date.now(),
            })

            toast.success(
              'Payment successful! Redirecting to verification...',
            )

            window.location.assign(kycData.verificationUrl)
          } catch (error: unknown) {
            console.error('Payment verification error:', error)
            toast.error(
              'Payment verification failed. Please contact support.',
            )
          } finally {
            setLoading(false)
          }
        },

        modal: {
          ondismiss: () => {
            setLoading(false)
            onClose?.()
          },
        },
      }

      const razorpay = new window.Razorpay(options)

      razorpay.on('payment.failed', (response: { error: { description: any } }) => {
        console.error('Razorpay payment failed:', response.error)
        toast.error(
          response.error?.description || 'Payment failed. Please try again.',
        )
        setLoading(false)
      })

      razorpay.open()
    } catch (error: unknown) {
      console.error('KYC payment error:', error)
      toast.error('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [loading, userData, razorpayLoaded, openLoginModal, onClose])

  return (
    <button
      type="button"
      onClick={handlePayment}
      disabled={loading || !razorpayLoaded}
      aria-busy={loading}
      className={[
        'rounded px-6 py-2 font-medium text-white transition-colors',
        loading || !razorpayLoaded
          ? 'cursor-not-allowed bg-gray-400'
          : 'bg-[#2a1407] hover:bg-[#5a2a0a]',
      ].join(' ')}
    >
      {!razorpayLoaded
        ? 'Loading Razorpay...'
        : loading
          ? 'Processing...'
          : 'Pay ₹100 for KYC Verification'}
    </button>
  )
}

