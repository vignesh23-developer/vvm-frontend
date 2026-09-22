import axios from 'axios'
import { onDeleteCookies, onGetCookies } from '@/utils/cookies/cookiesHelper'
import { requestOpenLoginModal } from '@/lib/openLoginModalEvent'
import { isPublicBrowsingPath } from '@/lib/publicBrowsingRoutes'

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

  if (isPublicBrowsingPath(currentUrl.pathname)) return

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
  const localStoredToken = await onGetCookies('authToken').then(res => {
    if (res.isError) return null
    return normalizeToken(res.cookies)
  })

  const requestUrl = config.url ?? ''
  const isForgotPasswordRequest = requestUrl.includes('forgot-password')

  if (localStoredToken && !isForgotPasswordRequest) {
    config.headers['Authorization'] = `Bearer ${localStoredToken}`
  }

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
    const status = error?.response?.status ?? error?.status ?? error?.response?.statusCode ?? error?.statusCode
    if (Number(status) === 401) {
      const pathname = typeof window !== 'undefined' ? window.location.pathname : ''
      const onPublicPage = pathname ? isPublicBrowsingPath(pathname) : false

      if (!onPublicPage) {
        onDeleteCookies('authToken')
        onDeleteCookies('userData')
        promptLoginModal()
      }
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
