'use client'

import useSWR from 'swr'

import { appEndpoints } from '@/services/endpoints'
import { getMethod } from '@/services/service'
import { ResponseDTO } from '@/components/dto/response_dto'

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
    console.error('Error fetching ad reports:', response.message)
    return { items: [], total: 0 }
  }

  return {
    items: response?.data?.data ?? [],
    total: response?.data?.total ?? 0,
  }
}

export function useAdReports({ page = 1, limit = 10 } = {}) {
  const url = `${appEndpoints.getAllAdReports}?page=${page}&limit=${limit}`

  const { data = { items: [], total: 0 }, error, isLoading, mutate } = useSWR<AdReportResponse>(url, fetchAdReports)

  return {
    adReports: data.items,
    total: data.total,
    error,
    isLoading,
    mutateAdReports: mutate,
  }
}
