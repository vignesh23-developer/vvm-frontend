'use client'

import { useState } from 'react'
import { postMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'
import { setLocalStorageItem } from '@/utils/local_storage/local_storage_handler'
import { useKycStatus } from './hooks/useKycStatus'
import toast from 'react-hot-toast'
import Image from 'next/image'
import { ShieldCheck, Shield, Loader2, Lock, Calendar } from 'lucide-react'

export default function KYCStatus() {
  const { kycStatus, loading } = useKycStatus()
  const [initiating, setInitiating] = useState(false)

  const handleInitiateKyc = async () => {
    console.log('Start Verification button clicked')
    try {
      setInitiating(true)
      const redirectUrl = `${window.location.origin}/kyc-callback`
      console.log('KYC API:', appEndpoints.initiateKyc)
      console.log('KYC Redirect URL:', redirectUrl)
      const response = await postMethod(appEndpoints.initiateKyc, {
        redirectUrl,
        verificationType: 'AADHAAR',
        entityType: 'USER',
        directCall: true,
      })
      console.log('KYC API Response:', response)
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
          timestamp: Date.now(),
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

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-[#e8d5c4] p-8 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#b8864b]" />
      </div>
    )
  }

  // VERIFIED STATE
  if (kycStatus?.isVerified) {
    return (
      <div className="bg-white rounded-2xl border border-[#e8d5c4] shadow-sm overflow-hidden">
        <div className="p-6">
          {/* Status Badge */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-[#7a4a1d] uppercase tracking-wide">Identity</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded-full border border-green-200">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              VERIFIED
            </span>
          </div>

          {/* Success Icon */}
          <div className="text-center mb-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <h3 className="text-lg font-bold text-[#2a1407] text-center mb-1">Identity Verified</h3>
          <p className="text-xs text-[#7a4a1d] text-center mb-4">Your KYC verification is complete</p>

          {/* Verification Details */}
          <div className="bg-[#fdf5eb] rounded-xl p-4 space-y-2">
            {kycStatus.aadhaarMasked && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#7a4a1d]">Aadhaar</span>
                <span className="font-mono font-semibold text-[#2a1407]">{kycStatus.aadhaarMasked}</span>
              </div>
            )}
            {kycStatus.verifiedAt && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#7a4a1d]">Verified</span>
                <span className="font-medium text-[#2a1407] flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(kycStatus.verifiedAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // NOT VERIFIED STATE
  return (
    <div className="bg-white rounded-2xl border border-[#e8d5c4] shadow-sm overflow-hidden">
      <div className="p-6">
        {/* Status Badge */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-[#7a4a1d] uppercase tracking-wide">Identity</span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-full border border-amber-200">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
            PENDING
          </span>
        </div>

        {/* Icon */}
        <div className="text-center mb-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200 flex items-center justify-center">
            <Shield className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <h3 className="text-lg font-bold text-[#2a1407] text-center mb-1">Verify Your Identity</h3>
        <p className="text-xs text-[#7a4a1d] text-center mb-5 leading-relaxed">
          Complete KYC to unlock full access and build trust with buyers and sellers
        </p>

        {/* CTA Section */}
        <button
          onClick={handleInitiateKyc}
          disabled={initiating}
          className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
            initiating
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#2a1407] hover:shadow-lg hover:shadow-yellow-400/30'
          }`}
        >
          {initiating ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Processing...
            </span>
          ) : (
            'Start Verification'
          )}
        </button>

        {/* Security Footer */}
        <p className="text-[10px] text-gray-400 mt-4 flex items-center justify-center gap-1.5">
          <Lock className="w-3 h-3" />
          Secured by Surepass Digilocker
        </p>
      </div>
    </div>
  )
}