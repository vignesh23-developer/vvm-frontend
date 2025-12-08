'use client'

import { motion } from 'framer-motion'
import { Calendar, CreditCard, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { PaymentTransaction } from './types'
import { formatDateTime, formatCurrency, getStatusBadgeColor, formatStatus, getMethodDisplayName } from './utils/transactionUtils'

interface TransactionCardProps {
  transaction: PaymentTransaction
  index: number
}

function getStatusIcon(status: string) {
  const statusLower = status.toLowerCase()
  if (statusLower === 'captured' || statusLower === 'authorized' || statusLower === 'completed') {
    return <CheckCircle className="w-5 h-5 text-green-600" />
  }
  if (statusLower === 'failed' || statusLower === 'rejected') {
    return <XCircle className="w-5 h-5 text-red-600" />
  }
  if (statusLower === 'pending' || statusLower === 'initiated') {
    return <AlertCircle className="w-5 h-5 text-yellow-600" />
  }
  return <Clock className="w-5 h-5 text-gray-600" />
}

/**
 * Transaction card component
 */
export function TransactionCard({ transaction, index }: TransactionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="p-6">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="flex items-center gap-3 mb-2 sm:mb-0">
            {getStatusIcon(transaction.status)}
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {formatCurrency(transaction.amount)} {transaction.currency}
              </h3>
              {transaction.payment_order && (
                <p className="text-sm text-gray-500">Order: {transaction.payment_order.order_number}</p>
              )}
            </div>
          </div>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(transaction.status)}`}>
            {formatStatus(transaction.status)}
          </span>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Date */}
          <div className="flex items-start">
            <Calendar className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500 mb-1">Transaction Date</p>
              <p className="font-medium text-gray-800">{formatDateTime(transaction.created_at)}</p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="flex items-start">
            <CreditCard className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500 mb-1">Payment Method</p>
              <p className="font-medium text-gray-800">{getMethodDisplayName(transaction.method)}</p>
            </div>
          </div>

          {/* Gateway */}
          {transaction.payment_order?.gateway && (
            <div className="flex items-start">
              <div className="w-5 h-5 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 mb-1">Gateway</p>
                <p className="font-medium text-gray-800">{transaction.payment_order.gateway}</p>
              </div>
            </div>
          )}

          {/* Attempt Number */}
          <div className="flex items-start">
            <Clock className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500 mb-1">Attempt</p>
              <p className="font-medium text-gray-800">#{transaction.attempt_number}</p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        {(transaction.gateway_payment_id || transaction.error_description || transaction.payment_order?.purpose) && (
          <div className="border-t border-gray-200 pt-4">
            <div className="space-y-2 text-sm">
              {transaction.gateway_payment_id && (
                <div>
                  <span className="text-gray-500">Gateway Payment ID: </span>
                  <span className="text-gray-800 font-mono text-xs">{transaction.gateway_payment_id}</span>
                </div>
              )}
              {transaction.payment_order?.purpose && (
                <div>
                  <span className="text-gray-500">Purpose: </span>
                  <span className="text-gray-800">{transaction.payment_order.purpose}</span>
                </div>
              )}
              {transaction.error_description && (
                <div className="p-2 bg-red-50 border border-red-200 rounded">
                  <span className="text-red-800 text-xs">{transaction.error_description}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

