import axios from 'axios'
import { onDeleteCookies, onGetCookies } from '@/utils/cookies/cookiesHelper'
import { requestOpenLoginModal } from '@/lib/openLoginModalEvent'

let isRedirectingToLogin = false

const safeJsonParse = <T>(value: unknown, fallback: T): T => {
  if (value === undefined || value === null) return fallback
  if (typeof value !== 'string') return (value as T) ?? fallback

  try {
    return JSON.parse(value) as T
  } catch {
    return (value as unknown as T) ?? fallback
  }
}

const normalizeToken = (value: unknown): string | null => {
  const parsed = safeJsonParse<string | null>(value, value as any)
  if (typeof parsed !== 'string') return null
  const trimmed = parsed.trim()
  return trimmed.length > 0 ? trimmed : null
}

const promptLoginModal = () => {
  if (typeof window === 'undefined') return
  if (isRedirectingToLogin) return

  const currentUrl = new URL(window.location.href)

  const isLoginRoute = currentUrl.pathname === '/login' || currentUrl.pathname.startsWith('/login/')
  if (isLoginRoute) return

  const nextPath = `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`

  isRedirectingToLogin = true
  requestOpenLoginModal(nextPath)
  window.setTimeout(() => {
    isRedirectingToLogin = false
  }, 1500)
}

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: false,
})

axiosInstance.interceptors.request.use(async config => {
  // console.log('REQUEST INTERCEPTORS CALLED', config)

  // const localStoredToken = await getLocalStorageItem(LOCAL_STORAGE_NAME.authToken)
  const localStoredToken = await onGetCookies('authToken').then(res => {
    if (res.isError) return null
    return normalizeToken(res.cookies)
  })

  if (localStoredToken) {
    config.headers['Authorization'] = `Bearer ${localStoredToken}`
  }

  // allow multipart/form-data payloads without forcing application/json
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  } else if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json'
  }
  return config
})

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    // console.log('ERROR ON interceptors response', error)

    const status = error?.response?.status ?? error?.status ?? error?.response?.statusCode ?? error?.statusCode
    if (Number(status) === 401) {
      // console.log('error from interceptors', error)

      onDeleteCookies('authToken')
      onDeleteCookies('userData')

      promptLoginModal()
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
