'use client'

import useSWR from 'swr'
import { appEndpoints } from '@/services/endpoints'
import { getMethod } from '@/services/service'
import { ResponseDTO } from '@/components/dto/response_dto'
import { UserDataType } from '../(dto)/userType'

// Response shape for SWR
interface UserResponse {
  data: UserDataType[]
  total: number
}

// Hook
export function useUsersHook(page: number = 1, limit: number = 10) {
  // Create API URL dynamically
  const url = `${appEndpoints.getAllUsers}?activeOnly=true&page=${page}&limit=${limit}`

  // Fetcher
  const fetchUsers = async (endpoint: string) => {
    const response = await getMethod(endpoint)
    return response
  }

  // SWR
  const { data, error, isLoading, mutate: mutateUsers } = useSWR<ResponseDTO>(url, fetchUsers)

  // console.log('Users data:', data)

  const handleRefreshUsers = async () => {
    await mutateUsers()
  }

  const users = data?.data?.data || []
  const totalUsers = data?.data?.total || 0

  return {
    users,
    total: totalUsers,
    error,
    isLoading,
    handleRefreshUsers,
  }
}
