
'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

import { postMethod } from '@/services/service'
import { testAppEndpoints } from '@/services/endpoints'

export default function TestKYCStatus() {
  const [loading, setLoading] = useState(false)

  const handleTestKYCCompletion = async (): Promise<void> => {
    if (loading) return

    setLoading(true)

    try {
      const response = await postMethod(
        testAppEndpoints.testKycNotification,
        { userName: 'Akram' },
      )

      if (response?.error) {
        toast.error(response.message || 'Failed to test KYC completion')
        return
      }

      console.log('Test KYC completion response:', response?.data)
      toast.success('KYC completion test request successful')
    } catch (error: unknown) {
      console.error('Test KYC completion failed:', error)

      toast.error(
        error instanceof Error
          ? error.message
          : 'An error occurred. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleTestKYCCompletion}
      disabled={loading}
      aria-busy={loading}
      className={[
        'w-full rounded px-6 py-2 font-medium text-white transition-colors',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600',
        loading
          ? 'cursor-not-allowed bg-gray-500'
          : 'bg-[#2a1407] hover:bg-[#5a2a0a]',
      ].join(' ')}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Testing KYC...
        </span>
      ) : (
        'Test KYC COMPLETION'
      )}
    </button>
  )
}


