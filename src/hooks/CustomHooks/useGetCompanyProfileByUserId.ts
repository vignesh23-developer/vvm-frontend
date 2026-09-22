'use client'

import useSWR from 'swr'
import { appEndpoints } from '@/services/endpoints'
import { getMethod } from '@/services/service'

function extractCompanyProfiles(payload: unknown): any[] {
  if (!payload) return []
  if (Array.isArray(payload)) return payload

  if (typeof payload === 'object') {
    const nested = (payload as { data?: unknown }).data
    if (Array.isArray(nested)) return nested
    // Single profile object
    if (nested && typeof nested === 'object' && 'id' in (nested as object)) {
      return [nested]
    }
    if ('id' in (payload as object)) {
      return [payload]
    }
  }

  return []
}

export function useCompanyProfilesByUserId(userId: string) {
  const fetcher = async (url: string): Promise<any[]> => {
    const response = await getMethod<any>(url)

    if (response?.error) {
      throw new Error(response.message || 'Failed to fetch company profiles')
    }

    return extractCompanyProfiles(response?.data)
  }

  const {
    data: companyProfiles,
    error,
    isLoading,
    mutate: mutateCompanyProfiles,
  } = useSWR<any[]>(userId ? `${appEndpoints.getCompanyProfilesByUserID(userId)}` : null, fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  })

  return {
    companyProfiles: companyProfiles ?? [],
    error,
    isLoading,
    mutate: mutateCompanyProfiles,
  }
}
