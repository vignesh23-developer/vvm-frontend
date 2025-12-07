'use client'

import { useEffect, useState } from 'react'
import { getMethod, postMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'
import { setLocalStorageItem } from '@/utils/local_storage/local_storage_handler'
import { useUserSubscription } from '@/components/Plans/hooks/useUserSubscription'
import toast from 'react-hot-toast'
import KYCPayment from '@/components/payment/KYCPayment'

interface KYCStatusData {
  isVerified: boolean
  verifiedAt?: string | null
  aadhaarMasked?: string | null
  latestAttempt?: {
    id: string
    status: string
    createdAt: string
  }
}

export default function KYCStatus() {
  const { activeSubscription, loading: subscriptionLoading } = useUserSubscription()
  const [kycStatus, setKycStatus] = useState<KYCStatusData | null>(null)
  const [loading, setLoading] = useState(true)
  const [initiating, setInitiating] = useState(false)

  // Fetch KYC status
  useEffect(() => {
    const fetchKycStatus = async () => {
      try {
        setLoading(true)
        const response = await getMethod(appEndpoints.getUserKycStatus)

        if (!response.error && response.data) {
          setKycStatus(response.data as KYCStatusData)
        }
      } catch (error) {
        console.error('Failed to fetch KYC status:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchKycStatus()
  }, [])

  const handleInitiateKyc = async () => {
    try {
      setInitiating(true)
      const redirectUrl = `${window.location.origin}/kyc-callback`

      const response = await postMethod(appEndpoints.initiateKyc, {
        redirectUrl,
        verificationType: 'AADHAAR',
        entityType: 'USER'
      })

      if (response.error) {
        toast.error(response.message || 'Failed to initiate KYC')
        setInitiating(false)
        return
      }

      const kycData = response.data as {
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

        toast.success('Redirecting to verification...')
        setInitiating(false)

        // Redirect to Surepass verification URL
        window.location.href = kycData.verificationUrl
      } else {
        toast.error('Failed to get verification URL')
        setInitiating(false)
      }
    } catch (error) {
      console.error('Failed to initiate KYC:', error)
      toast.error('An error occurred. Please try again.')
      setInitiating(false)
    }
  }

  if (loading || subscriptionLoading) {
    return (
      <div className="mt-6 p-6 bg-white rounded-lg shadow">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3b1804]"></div>
        </div>
      </div>
    )
  }

  const canVerifyKyc =
  !!activeSubscription ||
  (kycStatus?.latestAttempt?.status === 'PENDING');


  // If KYC is verified, show completion message
  if (kycStatus?.isVerified) {
    return (
      <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-green-800">KYC Verified ✓</h3>
            <div className="mt-2 text-sm text-green-700">
              <p>Your KYC verification is complete.</p>
              {kycStatus.aadhaarMasked && (
                <p className="mt-1">Aadhaar: {kycStatus.aadhaarMasked}</p>
              )}
              {kycStatus.verifiedAt && (
                <p className="mt-1">
                  Verified on: {new Date(kycStatus.verifiedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If not verified, show initiation options
  return (
    <div className="mt-6 p-6 bg-white border border-gray-200 rounded-lg shadow">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">KYC Verification</h3>
          <p className="mt-1 text-sm text-gray-600">
            Complete your KYC verification to access all features
          </p>
          {kycStatus?.latestAttempt && kycStatus.latestAttempt.status === 'PENDING' && (
            <p className="mt-2 text-sm text-amber-600">
              You have a pending verification. Please complete it.
            </p>
          )}
        </div>
      </div>

      <div className="mt-4">
        {canVerifyKyc ? (
          <button
            onClick={handleInitiateKyc}
            disabled={initiating}
            className={`px-6 py-2 rounded font-medium transition-colors ${
              initiating
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-[#3b1804] text-white hover:bg-[#5a2a0a]'
            }`}
          >
            {initiating ? 'Initiating...' : 'Verify KYC'}
          </button>
        ) : (
          <div>
            <p className="mb-3 text-sm text-gray-600">
              No active subscription found. Pay ₹100 to complete KYC verification.
            </p>
            <KYCPayment />
          </div>
        )}
      </div>
    </div>
  )
}

