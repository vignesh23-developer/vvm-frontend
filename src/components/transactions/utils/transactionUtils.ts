/**
 * Utility functions for transaction formatting and display
 */

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return 'Invalid Date'
  }
}

export function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return 'Invalid Date'
  }
}

export function formatCurrency(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined) return 'N/A'
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  if (isNaN(numAmount)) return 'N/A'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numAmount)
}

export function getStatusBadgeColor(status: string): string {
  const statusLower = status.toLowerCase()
  if (statusLower === 'captured' || statusLower === 'authorized' || statusLower === 'completed') {
    return 'bg-green-100 text-green-800'
  }
  if (statusLower === 'failed' || statusLower === 'rejected') {
    return 'bg-red-100 text-red-800'
  }
  if (statusLower === 'pending' || statusLower === 'initiated') {
    return 'bg-yellow-100 text-yellow-800'
  }
  return 'bg-gray-100 text-gray-800'
}

export function formatStatus(status: string): string {
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

export function getMethodDisplayName(method: string | null): string {
  if (!method) return 'N/A'
  const methodMap: Record<string, string> = {
    UPI: 'UPI',
    CARD: 'Card',
    NETBANKING: 'Net Banking',
    WALLET: 'Wallet',
    EMI: 'EMI',
  }
  return methodMap[method] || method
}

