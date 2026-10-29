
'use client'

import { useState } from 'react'
import { Calendar, Loader2, Lock, Shield, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'

import { postMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'
import { setLocalStorageItem } from '@/utils/local_storage/local_storage_handler'
import { useKycStatus } from './hooks/useKycStatus'

type KycInitiationResponse = {
  success?: boolean
  verificationId?: string
  verificationUrl?: string
  expiresInSeconds?: number
  message?: string
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : 'An error occurred. Please try again.'
}

function formatDate(value: string | Date): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Date unavailable'
  }

  return date.toLocaleDateString()
}

function StatusBadge({ verified }: { verified: boolean }) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold',
        verified
          ? 'border-green-200 bg-green-50 text-green-700'
          : 'border-amber-200 bg-amber-50 text-amber-700',
      ].join(' ')}
    >
      <span
        className={[
          'h-1.5 w-1.5 rounded-full',
          verified ? 'bg-green-500' : 'bg-amber-500',
        ].join(' ')}
      />
      {verified ? 'VERIFIED' : 'PENDING'}
    </span>
  )
}

function KycLoadingState() {
  return (
    <div
      role="status"
      aria-label="Loading KYC status"
      className="flex items-center justify-center rounded-2xl border border-[#e8d5c4] bg-white p-8"
    >
      <Loader2 className="h-6 w-6 animate-spin text-[#b8864b]" />
    </div>
  )
}

export default function KYCStatus() {
  const { kycStatus, loading } = useKycStatus()
  const [initiating, setInitiating] = useState(false)

  const handleInitiateKyc = async (): Promise<void> => {
    if (initiating) return

    setInitiating(true)

    try {
      const redirectUrl = `${window.location.origin}/kyc-callback`

      const response = await postMethod(appEndpoints.initiateKyc, {
        redirectUrl,
        verificationType: 'AADHAAR',
        entityType: 'USER',
        directCall: true,
      })

      if (response?.error) {
        toast.error(response.message || 'Failed to initiate KYC')
        return
      }

      const kycData = response?.data as KycInitiationResponse | undefined

      if (
        !kycData?.verificationId ||
        !kycData?.verificationUrl
      ) {
        toast.error(kycData?.message || 'Failed to get verification URL')
        return
      }

      let verificationUrl: URL

      try {
        verificationUrl = new URL(kycData.verificationUrl)
      } catch {
        toast.error('Invalid verification URL received')
        return
      }

      // Accept only HTTPS verification URLs.
      if (verificationUrl.protocol !== 'https:') {
        toast.error('Invalid verification URL received')
        return
      }

      setLocalStorageItem('kyc_verification_pending', {
        verificationId: kycData.verificationId,
        timestamp: Date.now(),
      })

      toast.success('Redirecting to verification...')

      window.location.assign(verificationUrl.toString())
    } catch (error: unknown) {
      console.error('Failed to initiate KYC:', error)
      toast.error(getErrorMessage(error))
    } finally {
      setInitiating(false)
    }
  }

  if (loading) {
    return <KycLoadingState />
  }

  const isVerified = Boolean(kycStatus?.isVerified)

  return (
    <div className="overflow-hidden rounded-2xl border border-[#e8d5c4] bg-white shadow-sm">
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-[#7a4a1d]">
            Identity
          </span>
          <StatusBadge verified={isVerified} />
        </div>

        <div className="mb-4 text-center">
          <div
            className={[
              'mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border bg-gradient-to-br',
              isVerified
                ? 'border-green-200 from-green-50 to-emerald-50'
                : 'border-yellow-200 from-yellow-50 to-orange-50',
            ].join(' ')}
          >
            {isVerified ? (
              <ShieldCheck className="h-8 w-8 text-green-600" />
            ) : (
              <Shield className="h-8 w-8 text-yellow-600" />
            )}
          </div>
        </div>

        <h3 className="mb-1 text-center text-lg font-bold text-[#2a1407]">
          {isVerified ? 'Identity Verified' : 'Verify Your Identity'}
        </h3>

        <p className="mb-5 text-center text-xs leading-relaxed text-[#7a4a1d]">
          {isVerified
            ? 'Your KYC verification is complete'
            : 'Complete KYC to unlock full access and build trust with buyers and sellers'}
        </p>

        {isVerified ? (
          <div className="space-y-2 rounded-xl bg-[#fdf5eb] p-4">
            {kycStatus?.aadhaarMasked && (
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-[#7a4a1d]">Aadhaar</span>
                <span className="break-all text-right font-mono font-semibold text-[#2a1407]">
                  {kycStatus.aadhaarMasked}
                </span>
              </div>
            )}

            {kycStatus?.verifiedAt && (
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-[#7a4a1d]">Verified</span>
                <span className="flex items-center gap-1 text-right font-medium text-[#2a1407]">
                  <Calendar className="h-3 w-3 shrink-0" />
                  {formatDate(kycStatus.verifiedAt)}
                </span>
              </div>
            )}
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={handleInitiateKyc}
              disabled={initiating}
              aria-busy={initiating}
              className={[
                'w-full rounded-xl py-3.5 text-sm font-bold transition-all',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600',
                initiating
                  ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                  : 'cursor-pointer bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#2a1407] hover:shadow-lg hover:shadow-yellow-400/30',
              ].join(' ')}
            >
              {initiating ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </span>
              ) : (
                'Start Verification'
              )}
            </button>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-gray-400">
              <Lock className="h-3 w-3" />
              Secured by Surepass Digilocker
            </p>
          </>
        )}
      </div>
    </div>
  )
}