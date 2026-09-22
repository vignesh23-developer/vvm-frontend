'use client'

import { useEffect, useState } from 'react'
import { getMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import { Wallet } from 'lucide-react'

export default function WalletCard() {
  const { user } = useAuth()
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWalletBalance = async () => {
      if (!user?.id) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const response = await getMethod<{ success: boolean; data: { balance: number } }>(appEndpoints.getUserWalletBalance(user.id))

        if (response.error) {
          setError(response.message || 'Failed to fetch wallet balance')
          setBalance(0)
        } else {
          // The API returns { success: true, data: { balance } }
          // response.data contains the API response
          const apiResponse = response.data as { success?: boolean; data?: { balance: number } }
          setBalance(apiResponse?.data?.balance ?? 0)
        }
      } catch (err) {
        console.error('Error fetching wallet balance:', err)
        setError('An error occurred while fetching wallet balance')
        setBalance(0)
      } finally {
        setLoading(false)
      }
    }

    fetchWalletBalance()
  }, [user?.id])

  const formatCurrency = (amount: number | null): string => {
    if (amount === null) return '₹0.00'
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  return (
    <div className="max-w-sm mx-auto mt-6 p-6 bg-white border border-gray-200 rounded-lg shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#3b1804] rounded-lg">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Wallet Balance</h3>
          </div>
          <p className="mt-1 text-sm text-gray-600">Your available wallet balance</p>
        </div>
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#3b1804]"></div>
            <span className="text-sm text-gray-600">Loading balance...</span>
          </div>
        ) : error ? (
          <div className="text-sm text-red-600">{error}</div>
        ) : (
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#3b1804]">{formatCurrency(balance)}</span>
          </div>
        )}
      </div>
    </div>
  )
}
