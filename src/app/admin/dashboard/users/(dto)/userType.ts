export interface UserDataType {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string | null
  roles: 'ADMIN' | 'AGENT' | 'OWNER' | 'BUYER' | string
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | string
  isKycVerified: boolean
  createdAt: string
  updatedAt: string
}
