// Notification type definitions

export enum NotificationCategory {
  OTP = 'OTP',
  PROPERTY = 'PROPERTY',
  AD = 'AD',
  ENQUIRY = 'ENQUIRY',
  PAYMENT = 'PAYMENT',
  SUBSCRIPTION = 'SUBSCRIPTION',
  ACCOUNT = 'ACCOUNT',
  SYSTEM = 'SYSTEM',
  MARKETING = 'MARKETING',
}

export enum NotificationPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export interface Notification {
  id: string
  title: string
  body: string
  category: NotificationCategory
  priority: NotificationPriority
  entity_type?: string
  entity_id?: string
  action_url?: string
  icon?: string
  image_url?: string
  is_read: boolean
  read_at?: Date | string
  created_at: Date | string
}

export interface NotificationListResponse {
  data: Notification[]
  total: number
  unreadCount: number
  page: number
  limit: number
}

export interface NotificationFilterParams {
  page?: number
  limit?: number
  category?: NotificationCategory
  unreadOnly?: boolean
}

export interface UnreadCountResponse {
  unreadCount: number
}

