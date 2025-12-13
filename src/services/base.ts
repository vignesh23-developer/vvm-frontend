import axios from 'axios'
import { onDeleteCookies, onGetCookies } from '@/utils/cookies/cookiesHelper'

let isRedirectingToLogin = false

const redirectToLogin = () => {
  if (typeof window === 'undefined') return
  if (isRedirectingToLogin) return

  const currentPath = `${window.location.pathname}${window.location.search}`
  if (window.location.pathname === '/login') return

  isRedirectingToLogin = true
  window.location.replace(`/login?next=${encodeURIComponent(currentPath)}`)
}

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: false,
})

axiosInstance.interceptors.request.use(async config => {
  console.log('REQUEST INTERCEPTORS CALLED', config)

  // const localStoredToken = await getLocalStorageItem(LOCAL_STORAGE_NAME.authToken)
  const localStoredToken = await onGetCookies('authToken').then(res => {
    if (!res.isError) {
      return res.cookies as string | null
    }
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
    console.log('ERROR ON interceptors response', error)

    if (error.response?.status === 401) {
      console.log('error from interceptors', error)

      onDeleteCookies('authToken')
      onDeleteCookies('userData')

      redirectToLogin()
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
