'use client'

import useSWR from 'swr'
import { appEndpoints } from '@/services/endpoints'
import { getMethod } from '@/services/service'
import { ResponseDTO } from '@/components/dto/response_dto'

export interface PropertyReports {
  id: number
  property: {
    id: number
    title: string
  }
  title: string
  report_type: string
  description?: string
  status: string
  approval_status: string
  isActive?: boolean
}

// fetcher
const fetchReports = async (url: string) => {
  const response: ResponseDTO = await getMethod(url)

  if (response.error) {
    console.error('Error fetching property reports:', response.message)
    return { items: [], total: 0 }
  }
  // console.log('Fetched property reports:', response.data.data)

  return {
    items: response?.data?.data ?? [],
    total: (response.data as any)?.total ?? 0,
  }
}

// hook
export function usePropertyReports({ page = 1, limit = 10, propertyId }: { page?: number; limit?: number; propertyId?: string } = {}) {
  let endpoint = ''
  if (propertyId) {
    endpoint = `${appEndpoints.getAllReportByPropertyID(propertyId)}`
  } else {
    endpoint = `${appEndpoints.getAllPropertyReports}?activeOnly=true&page=${page}&limit=${limit}`
  }
  const { data = { items: [], total: 0 }, error, isLoading, mutate } = useSWR(endpoint, fetchReports)

  // console.log('usePropertyReports - data:', data, error, isLoading)

  return {
    reports: data.items,
    total: data.total,
    error,
    isLoading,
    mutateReports: mutate,
  }
}
