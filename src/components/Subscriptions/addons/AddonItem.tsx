'use client'

import { useState } from 'react'
import { Plus, Minus, ShoppingCart, Check, Calendar, CreditCard, Receipt } from 'lucide-react'
import RazorpayAddonButton from '@/components/payment/RazorpayAddonButton'
import { SubscriptionItem } from '../types'

interface UserPurchasedItem {
  id: number
  user_subscription_id: number
  item_id: number
  plan_item_id: number | null
  paidAmount: string
  startDate: string
  endDate: string | null
  isActive: boolean
  appliedTo: string | null
  transactionId: string | null
  item: SubscriptionItem
  itemSettings?: {
    type: string
    basePrice: number
    paidAmount: number
    quantity?: number
  }
}

interface AddonItemProps {
  addon: {
    item: SubscriptionItem
    basePrice: string
    isConfigurable: boolean
  }
  purchasedAddon?: UserPurchasedItem | null
  subscriptionId: number
  userId: string
  onPurchaseSuccess: () => void
}

export default function AddonItem({
  addon,
  purchasedAddon,
  subscriptionId,
  userId,
  onPurchaseSuccess
}: AddonItemProps) {
  const [quantity, setQuantity] = useState(1)
  const basePrice = parseFloat(addon.basePrice)
  const totalAmount = basePrice * quantity

  const handleIncrement = () => {
    if (quantity < 100) {
      setQuantity(prev => prev + 1)
    }
  }

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount
    return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const isPurchased = !!purchasedAddon

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        {/* Left Side: Addon Info */}
        <div className="flex-1">
          <div className="flex items-start gap-3 mb-2">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-gray-500" />
              <h4 className="font-semibold text-gray-800">{addon.item.name}</h4>
            </div>
            {isPurchased && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                Purchased
              </span>
            )}
            {!isPurchased && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                Available
              </span>
            )}
          </div>

          {addon.item.description && (
            <p className="text-sm text-gray-600 mb-2">{addon.item.description}</p>
          )}

          <div className="flex flex-wrap gap-3 text-sm text-gray-500">
            {addon.item.category && (
              <span className="flex items-center gap-1">
                <span className="font-medium">Category:</span> {addon.item.category}
              </span>
            )}
            {addon.item.unit && (
              <span className="flex items-center gap-1">
                <span className="font-medium">Unit:</span> {addon.item.unit}
              </span>
            )}
            <span className="flex items-center gap-1">
              <span className="font-medium">Price per unit:</span> {formatCurrency(basePrice)}
            </span>
          </div>

          {/* Purchased Addon Details */}
          {isPurchased && purchasedAddon && (
            <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-2">Purchase Details:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                {/* Show quantity only for NUMERIC type */}
                {purchasedAddon.itemSettings?.type === 'NUMERIC' && (
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Quantity: <strong>{purchasedAddon.itemSettings?.quantity || 1}</strong></span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Paid: <strong>{formatCurrency(purchasedAddon.paidAmount)}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Date: <strong>{formatDate(purchasedAddon.startDate)}</strong></span>
                </div>
                {purchasedAddon.transactionId && (
                  <div className="flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 text-xs">
                      Txn: <strong className="font-mono">{purchasedAddon.transactionId}</strong>
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Purchase Controls */}
        <div className="flex flex-col items-end gap-3">
          {/* Quantity Stepper (only for NUMERIC type items) */}
          {addon.item.valueType === 'NUMERIC' && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 mr-2">Quantity:</span>
              <button
                onClick={handleDecrement}
                disabled={quantity <= 1}
                className="p-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1
                  setQuantity(Math.min(100, Math.max(1, val)))
                }}
                className="w-16 text-center border border-gray-300 rounded px-2 py-1"
                min="1"
                max="100"
              />
              <button
                onClick={handleIncrement}
                disabled={quantity >= 100}
                className="p-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Total Price - Only show for unpurchased or NUMERIC type */}
          {(!isPurchased || addon.item.valueType === 'NUMERIC') && (
            <div className="text-right">
              <p className="text-sm text-gray-600">Total:</p>
              <p className="text-xl font-bold text-gray-800">{formatCurrency(totalAmount)}</p>
            </div>
          )}

          {/* Purchase Button - Hide for purchased BOOLEAN type addons */}
          {isPurchased && addon.item.valueType === 'BOOLEAN' ? (
            <div className="px-4 py-2 bg-green-100 text-green-800 rounded text-center font-medium text-sm">
              ✓ Activated
            </div>
          ) : (
            <RazorpayAddonButton
              itemId={addon.item.id}
              itemName={addon.item.name}
              basePrice={basePrice}
              quantity={quantity}
              subscriptionId={subscriptionId}
              userId={userId}
              onSuccess={onPurchaseSuccess}
              buttonText={isPurchased && addon.item.valueType === 'NUMERIC' ? 'Buy More' : 'Purchase'}
            />
          )}
        </div>
      </div>
    </div>
  )
}

