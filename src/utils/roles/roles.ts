export type UserRole = 'admin' | 'agent' | 'buyer'

export const Roles = {
  ADMIN: 'admin',
  AGENT: 'agent',
  BUYER: 'buyer',
} as const

type RoleLike = UserRole | UserRole[] | string | string[] | null | undefined
type RoleCarrier =
  | {
      role?: RoleLike
      roles?: RoleLike
    }
  | null
  | undefined

const roleSet = new Set<UserRole>(Object.values(Roles))

const normalizeRole = (role: string | null | undefined): UserRole | null => {
  if (!role) return null
  const normalized = role.toString().trim().toLowerCase()
  return roleSet.has(normalized as UserRole) ? (normalized as UserRole) : null
}

const coerceRoles = (value: RoleLike): UserRole[] => {
  if (!value) return []
  const items = Array.isArray(value) ? value : [value]
  return items.map(entry => normalizeRole(typeof entry === 'string' ? entry : String(entry))).filter((entry): entry is UserRole => Boolean(entry))
}

export const getUserRoles = (source: RoleCarrier): UserRole[] => {
  if (!source) return []
  const normalized = coerceRoles(source.roles)
  if (normalized.length) return normalized
  return coerceRoles(source.role)
}

export const hasRole = (roleInput: RoleLike, allowed: UserRole[]): boolean => {
  const roles = coerceRoles(roleInput)
  if (!roles.length || !allowed.length) return false
  return roles.some(role => allowed.includes(role))
}
