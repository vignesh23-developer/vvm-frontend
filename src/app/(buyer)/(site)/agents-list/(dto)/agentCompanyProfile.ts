export interface UserDto {
  id: string
  email: string
  password: string | null
  firstName: string
  lastName: string
  phoneNumber: string
  isActive: boolean
  referralCode: string
  referredBy: string | null
  userType: string | null
  roles: string[]
}

export default interface AgentCompanyProfile {
  id: string
  profileName: string
  companyName: string
  shortTitle: string
  description: string
  companyLogo: string | null
  companyLogoKey: string | null
  gstNumber: string
  contact_name: string
  contact_phone: string
  contact_email: string
  isDeactivated: boolean
  expiryDays: number
  expiryDate: string
  isActive: boolean
  isVerified: boolean
  createdAt: string
  updatedAt: string
  user: UserDto
  userId: string
  address_line: string
  city: string
  district: string
  state: string
  postal_code: string
  country: string
  latitude: string
  longitude: string
  agentStats: {
    totalPropertiesPosted: number
    totalPropertiesSold: number
    totalClients: number
  }
  language: (key: string) => string
  handleFavorite?: (agentId: string) => void
  handleShare?: (agentId: string) => void
}
