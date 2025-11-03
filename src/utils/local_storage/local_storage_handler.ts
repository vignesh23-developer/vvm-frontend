const isBrowser = (): boolean => typeof window !== 'undefined'

export const getLocalStorageItem = <T = unknown>(key: string): T | null => {
  if (!isBrowser()) return null
  const item = localStorage.getItem(key)
  try {
    return item ? JSON.parse(item) : null
  } catch {
    return item as T // fallback if it's a plain string
  }
}

export const setLocalStorageItem = (key: string, value: any): void => {
  if (isBrowser()) {
    localStorage.setItem(key, JSON.stringify(value))
  }
}

export const removeLocalStorageItem = (key: string): void => {
  if (isBrowser()) {
    localStorage.removeItem(key)
  }
}
