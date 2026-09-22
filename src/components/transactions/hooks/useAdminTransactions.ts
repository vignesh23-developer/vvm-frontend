'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import { useLoginModal } from '@/components/auth/LoginModalProvider'
import { getMethod } from '@/services/service'
import { ResponseDTO } from '@/components/dto/response_dto'
import { appEndpoints } from '@/services/endpoints'
import { PaymentTransaction, PaginatedTransactionResponse, TransactionQueryParams } from '../types'

/**
 * Custom hook to fetch all payment transactions (admin view) with pagination and filtering
 */
export function useAdminTransactions(
  page: number = 1,
  limit: number = 10,
  filters?: TransactionQueryParams,
) {
  const { openLoginModal } = useLoginModal()
  const { user: userData } = useAuth()
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      if (!userData || !(userData as { id?: string }).id) {
        const next =
          typeof window !== 'undefined'
            ? `${window.location.pathname}${window.location.search}` || '/'
            : '/'
        openLoginModal({ next })
        return
      }

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
        appEndpoints.getAllTransactions,
        params,
      )

      if (response.error) {
        setError(response.message || 'Failed to fetch transactions')
        return
      }

      // Access the nested data structure
      const responseData = response.data as unknown as PaginatedTransactionResponse
      const transactionData = (responseData as any)?.data
      
      // Handle both possible response structures (array or nested object with data property)
      const transactionsArray: PaymentTransaction[] = Array.isArray(transactionData)
        ? transactionData
        : transactionData?.data || []

      if (transactionsArray && transactionsArray.length >= 0) {
        const transformedTransactionData = transactionsArray.map((transaction: PaymentTransaction) => {
          return {
            ...transaction,
            amount: transaction.amount / 100, // Convert from paise to rupees
          }
        })
        setTransactions(transformedTransactionData)
        setTotal(responseData?.total || 0)
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
  }, [openLoginModal, page, limit, filters, userData])

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
    total,
    refetch,
  }
}

