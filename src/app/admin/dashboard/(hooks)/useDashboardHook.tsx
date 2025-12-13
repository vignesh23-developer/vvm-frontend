'use client'

import { useCallback } from 'react'
import useSWR from 'swr'
import { appEndpoints } from '@/services/endpoints'
import { getMethod } from '@/services/service'
import toast from 'react-hot-toast'
import { ResponseDTO } from '@/components/dto/response_dto'

// Custom Hook
export function useDashboardHook() {
  // Fetcher function
  const fetcher = async (url: string) => {
    const response = await getMethod(url)
    return response
  }

  //  SWR Data Fetch
  const { data, error, isLoading, mutate: mutateDashboard } = useSWR<ResponseDTO>(`${appEndpoints.getDashboardData}`, fetcher)

  // CRUD Operations
  const handleRefresh = useCallback(() => {
    mutateDashboard()
  }, [mutateDashboard])

  console.log('Dashboard Data:', data)

  return {
    dashboardData: data?.data ?? null,
    error,
    isLoading,
    handleRefresh,
    mutateDashboard,
  }
}
