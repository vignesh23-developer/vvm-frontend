import { useState, useEffect, useCallback } from 'react'
import { getMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'

export interface KYCStatusData {
  isVerified: boolean
  verifiedAt?: string | null
  aadhaarMasked?: string | null
  latestAttempt?: {
    id: string
    status: string
    createdAt: string
  }
}

/**
 * Custom hook to fetch KYC status
 * Returns the KYC status data, loading state, error state, and refetch function
 */
export function useKycStatus() {
  const [kycStatus, setKycStatus] = useState<KYCStatusData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchKycStatus = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await getMethod<KYCStatusData>(appEndpoints.getUserKycStatus)

      if (response.error) {
        setError(response.message || 'Failed to fetch KYC status')
        setKycStatus(null)
      } else {
        setKycStatus(response.data as KYCStatusData)
      }
    } catch (err) {
      console.error('Failed to fetch KYC status:', err)
      setError('An error occurred while fetching KYC status')
      setKycStatus(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchKycStatus()
  }, [fetchKycStatus])

  const refetch = useCallback(() => {
    fetchKycStatus()
  }, [fetchKycStatus])

  return {
    kycStatus,
    loading,
    error,
    refetch,
  }
}

