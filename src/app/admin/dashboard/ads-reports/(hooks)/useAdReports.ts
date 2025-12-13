'use client'

import useSWR from 'swr'

import { appEndpoints } from '@/services/endpoints'
import { getMethod } from '@/services/service'
import { ResponseDTO } from '@/components/dto/response_dto'
import toast from 'react-hot-toast'

export interface AdReport {
  id: number | string
  ad_id?: string
  report_type?: string
  description?: string
  status?: string
  severity?: number
  created_at?: string
  reporter_name?: string
}

interface AdReportResponse {
  items: AdReport[]
  total: number
}

const fetchAdReports = async (endpoint: string): Promise<AdReportResponse> => {
  const response: ResponseDTO = await getMethod(endpoint)

  if (response.error) {
    toast.error(response.message || 'Failed to fetch ad reports')
    console.error('Error fetching ad reports:', response.message)
    return { items: [], total: 0 }
  }

  return {
    items: response?.data?.data || response?.data || [],
    total: response?.data?.total ?? 0,
  }
}

export function useAdReports({ page = 1, limit = 10, adsId }: { page?: number; limit?: number; adsId?: string } = {}) {
  // Create API URL dynamically
  const params = new URLSearchParams()
  params.set('page', String(page))
  params.set('limit', String(limit))
  const query = params.toString()

  let url = `${appEndpoints.getAdEnquiry}?${query}`
  if (adsId) {
    url = `${appEndpoints.getAllReportByAdsID(encodeURIComponent(adsId))}`
  }

  const { data = { items: [], total: 0 }, error, isLoading, mutate } = useSWR<AdReportResponse>(url, fetchAdReports)

  return {
    adReports: data.items,
    total: data.total,
    error,
    isLoading,
    mutateAdReports: mutate,
  }
}
