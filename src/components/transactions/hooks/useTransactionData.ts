import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import { getMethod } from '@/services/service'
import { ResponseDTO } from '@/components/dto/response_dto'
import { appEndpoints } from '@/services/endpoints'
import { PaymentTransaction, PaginatedTransactionResponse, TransactionQueryParams } from '../types'

/**
 * Custom hook to fetch user payment transactions with pagination and filtering
 */
export function useTransactionData(
  page: number = 1,
  limit: number = 10,
  filters?: TransactionQueryParams,
) {
  const router = useRouter()
  const { user: userData } = useAuth()
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      if (!userData || !(userData as { id?: string }).id) {
        router.push('/login')
        return
      }

      const userIdValue = (userData as { id: string }).id
      setUserId(userIdValue)

      // Build query parameters
      const params: Record<string, any> = {
        page,
        limit,
        order: filters?.order || 'DESC',
        orderBy: filters?.orderBy || 'created_at',
      }

      // Add filters
      if (filters?.status) params.status = filters.status
      if (filters?.method) params.method = filters.method
      if (filters?.minAmount !== undefined) params.minAmount = filters.minAmount
      if (filters?.maxAmount !== undefined) params.maxAmount = filters.maxAmount
      if (filters?.currency) params.currency = filters.currency
      if (filters?.gateway) params.gateway = filters.gateway
      if (filters?.dateFilter) params.dateFilter = filters.dateFilter
      if (filters?.dateValue !== undefined) params.dateValue = filters.dateValue
      if (filters?.dateField) params.dateField = filters.dateField

      const response = await getMethod<ResponseDTO<PaginatedTransactionResponse>>(
        appEndpoints.getUserTransactions,
        params,
      )

      if (response.error) {
        setError(response.message || 'Failed to fetch transactions')
        return
      }

      const transactionData = response.data?.data
      if (transactionData) {
        const transfomredTransactionData = transactionData.data.map((transaction: PaymentTransaction) => {
          return {
            ...transaction,
            amount: transaction.amount / 100,
          }
        })
        setTransactions(transfomredTransactionData || [])
        setTotal(transactionData.total || 0)
      } else {
        setTransactions([])
        setTotal(0)
      }
    } catch (err) {
      console.error('Error fetching transactions:', err)
      setError('An error occurred while fetching transactions')
    } finally {
      setLoading(false)
    }
  }, [router, page, limit, filters, userData])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const refetch = useCallback(() => {
    fetchTransactions()
  }, [fetchTransactions])

  return {
    transactions,
    loading,
    error,
    userId,
    total,
    refetch,
  }
}

