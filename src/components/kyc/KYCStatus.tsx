'use client'

import { useState } from 'react'
import { postMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'
import { setLocalStorageItem } from '@/utils/local_storage/local_storage_handler'
import { useUserSubscription } from '@/components/Plans/hooks/useUserSubscription'
import { useKycStatus } from './hooks/useKycStatus'
import toast from 'react-hot-toast'
import KYCPayment from '@/components/payment/KYCPayment'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ShieldCheck, Loader2 } from 'lucide-react'

export default function KYCStatus() {
  const { activeSubscription, loading: subscriptionLoading } = useUserSubscription()
  const { kycStatus, loading } = useKycStatus()
  const [initiating, setInitiating] = useState(false)

  const directCallToKyc =
    activeSubscription?.isActive == true ||
    (kycStatus?.latestAttempt?.status === 'PENDING');

  const handleInitiateKyc = async () => {
    try {
      setInitiating(true)
      const redirectUrl = `${window.location.origin}/kyc-callback`

      const response = await postMethod(appEndpoints.initiateKyc, {
        redirectUrl,
        verificationType: 'AADHAAR',
        entityType: 'USER',
        directCall: directCallToKyc
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
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#2a1407]" />
      </div>
    )
  }

  // If KYC is verified, show completion message
  if (kycStatus?.isVerified) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg mx-auto mt-8 p-8 bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-2xl shadow-sm text-center"
      >
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100/50 ring-8 ring-green-50">
          <ShieldCheck className="h-10 w-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Verified Successfully</h3>
        <p className="text-gray-600 mb-6">Your identity has been verified securely.</p>

        <div className="bg-white/80 rounded-xl p-4 border border-green-100 inline-block w-full max-w-sm">
          {kycStatus.aadhaarMasked && (
            <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
              <span className="text-sm text-gray-500">Aadhaar Linked</span>
              <span className="text-sm font-semibold text-gray-800 font-mono">{kycStatus.aadhaarMasked}</span>
            </div>
          )}
          {kycStatus.verifiedAt && (
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-500">Verified On</span>
              <span className="text-sm font-semibold text-gray-800">{new Date(kycStatus.verifiedAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </motion.div>
    )
  }

  // If not verified, show initiation options
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md mx-auto mt-8 bg-white border border-yellow-100 rounded-3xl shadow-xl overflow-hidden"
    >
      <div className="relative h-48 bg-[#2a1407]/5 flex items-center justify-center overflow-hidden">
        {/* Illustration */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative w-40 h-40"
        >
          <Image
            src="/images/kyc_verification.png"
            alt="KYC Verification"
            fill
            className="object-contain"
          />
        </motion.div>
      </div>

      <div className="p-8 text-center">
        <h3 className="text-2xl font-bold text-[#2a1407] mb-3">Verify Your Identity</h3>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Complete your KYC verification to unlock full access and build trust with buyers and sellers.
        </p>

        {kycStatus?.latestAttempt && kycStatus.latestAttempt.status === 'PENDING' && (
          <div className="mb-6 p-3 bg-amber-50 border border-amber-100 rounded-lg text-amber-700 text-sm font-medium flex items-center justify-center gap-2">
            <Loader2 size={16} className="animate-spin" />
            Verification in progress...
          </div>
        )}

        <div className="space-y-4">
          {directCallToKyc ? (
            <button
              onClick={handleInitiateKyc}
              disabled={initiating}
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg shadow-yellow-900/10 transition-all hover:-translate-y-1 ${initiating
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-[#2a1407] text-white hover:bg-[#4a230c] hover:shadow-xl'
                }`}
            >
              {initiating ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" /> Processing
                </span>
              ) : (
                'Start Verification Now'
              )}
            </button>
          ) : (
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p className="text-sm text-gray-600 mb-4">
                To proceed with verification, a nominal fee is required.
              </p>
              <KYCPayment />
            </div>
          )}
        </div>

        <p className="mt-6 text-xs text-gray-400">
          Secure verification powered by Surepass
        </p>
      </div>
    </motion.div>
  )
}

