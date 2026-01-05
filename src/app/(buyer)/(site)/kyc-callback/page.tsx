'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { postMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'
import { getLocalStorageItem, removeLocalStorageItem } from '@/utils/local_storage/local_storage_handler'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'

export default function KYCCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Processing your KYC verification...');
  const { user: userData, loading: authLoading, refreshAuth } = useAuth();

  useEffect(() => {
    const completeKyc = async () => {
      try {
        // Refresh auth to ensure cookies are loaded after external redirect
        await refreshAuth();

        // Wait for auth to finish loading
        if (authLoading) {
          setMessage('Verifying authentication...')
          return
        }

        // Check if user is logged in
        if (!userData || !userData.id) {
          setStatus('error')
          setMessage('Please login to continue')
          toast.error('Please login to continue')
          setTimeout(() => router.push('/login'), 2000)
          return
        }

        // Get client_id from URL query parameters
        const clientId = searchParams.get('client_id') || searchParams.get('clientId')

        if (!clientId) {
          setStatus('error')
          setMessage('Missing verification parameters. Please try again.')
          toast.error('Missing verification parameters')
          return
        }

        // Retrieve stored verificationId from localStorage
        const storedData = getLocalStorageItem('kyc_verification_pending') as {
          verificationId: string
          timestamp: number
        } | null

        if (!storedData || !storedData.verificationId) {
          setStatus('error')
          setMessage('Verification session expired. Please restart the verification process.')
          toast.error('Verification session expired')
          return
        }

        // Call complete KYC endpoint
        const response = await postMethod(appEndpoints.completeKyc, {
          clientId: clientId,
          // verificationId: storedData.verificationId
        })

        // Clear stored verification data
        removeLocalStorageItem('kyc_verification_pending')

        if (response.error) {
          setStatus('error')
          setMessage(response.message || 'Verification failed. Please try again.')
          toast.error(response.message || 'Verification failed')
          return
        }

        // Success
        const kycData = response.data as {
          success: boolean
          message: string
          verificationId: string
          maskedAadhaar?: string
          verifiedName?: string
        }

        setStatus('success')
        setMessage(kycData.message || 'KYC verification completed successfully!')
        toast.success('KYC verified successfully!')

        // Redirect to profile page after 2 seconds
        setTimeout(() => {
          router.push(`/profile/${userData.id}`)
        }, 2000)
      } catch (error) {
        console.error('KYC completion error:', error)
        setStatus('error')
        setMessage('An error occurred during verification. Please contact support.')
        toast.error('Verification failed')

        // Clear stored verification data
        removeLocalStorageItem('kyc_verification_pending')
      }
    }

    completeKyc()
  }, [router, searchParams, userData, authLoading, refreshAuth])

  const handleRetry = () => {

    if (userData && userData.id) {
      router.push(`/profile/${userData.id}`)
    } else {
      router.push('/login')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {status === 'loading' && (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#2a1407]"></div>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Processing Verification
              </h2>
              <p className="text-gray-600">{message}</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="rounded-full h-16 w-16 bg-green-100 flex items-center justify-center">
                  <svg
                    className="h-10 w-10 text-green-600"
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
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Verification Successful!
              </h2>
              <p className="text-gray-600 mb-4">{message}</p>
              <p className="text-sm text-gray-500">
                Redirecting you to your profile...
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="rounded-full h-16 w-16 bg-red-100 flex items-center justify-center">
                  <svg
                    className="h-10 w-10 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Verification Failed
              </h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <button
                onClick={handleRetry}
                className="px-6 py-2 bg-[#2a1407] text-white rounded font-medium hover:bg-[#5a2a0a] transition-colors"
              >
                Go to Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

