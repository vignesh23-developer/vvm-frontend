export const maskName = (name = '') => {
  if (!name) return 'xxxxx'

  const visible = name.slice(0, 2)
  const mask = 'x'.repeat(Math.max(name.length - 2, 3))

  return visible + mask
}

export const maskPhone = (phone = '') => {
  if (!phone) return 'xxxxx'

  const digits = phone.replace(/\D/g, '') // remove non-numbers
  const visible = digits.slice(0, 2)
  const mask = 'x'.repeat(Math.max(digits.length - 2, 5))

  return visible + mask
}

export const maskEmail = (email = '') => {
  if (!email) return 'xxxxx'
  const [localPart, domain] = email.split('@')
  const visible = localPart.slice(0, 2)
  const mask = 'x'.repeat(Math.max(localPart.length - 2, 3))
  return `${visible + mask}@${domain}`
}

export default function MaskedFirstTwoChar(value: string | undefined, type: 'name' | 'phone' | 'email' = 'name'): string {
  if (type === 'name') {
    return maskName(value)
  } else if (type === 'phone') {
    return maskPhone(value)
  } else {
    return maskEmail(value)
  }
}
