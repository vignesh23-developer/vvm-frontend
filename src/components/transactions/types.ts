// Type definitions for transaction components

export interface PaymentOrder {
  id: string
  order_number: string
  user_id: string
  gateway: string
  gateway_order_id: string | null
  channel: string
  purpose: string
  related_entity_type: string | null
  related_entity_id: string | null
  currency: string
  base_amount: number
  tax_percent: number
  tax_amount: number
  subtotal: number
  discount_amount: number
  wallet_amount_used: number
  payable_amount: number
  promo_code: string | null
  status: string
  notes: Record<string, any> | null
  ip_address: string | null
  user_agent: string | null
  expires_at: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface PaymentTransaction {
  id: string
  payment_order_id: string
  payment_order?: PaymentOrder
  attempt_number: number
  gateway_payment_id: string | null
  gateway_signature: string | null
  method: string | null
  method_details: Record<string, any> | null
  amount: number
  currency: string
  status: string
  error_code: string | null
  error_description: string | null
  gateway_response: Record<string, any> | null
  gateway_fee: number | null
  gateway_tax: number | null
  verified_at: string | null
  created_at: string
  updated_at: string
}

export interface PaginatedTransactionResponse {
  data: PaymentTransaction[]
  total: number
  page: number
  limit: number
}

export interface TransactionFilters {
  status?: string
  method?: string
  minAmount?: number
  maxAmount?: number
  currency?: string
  gateway?: string
  dateFilter?: 'day' | 'days' | 'month' | 'year'
  dateValue?: number
  dateField?: 'created_at' | 'updated_at' | 'verified_at'
}

export interface TransactionQueryParams extends TransactionFilters {
  page?: number
  limit?: number
  order?: 'ASC' | 'DESC'
  orderBy?: string
}

