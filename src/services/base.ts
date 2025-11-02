import axios from 'axios'
import { getLocalStorageItem, removeLocalStorageItem } from '../utils/local_storage/local_storage_handler'
import { LOCAL_STORAGE_NAME } from '../utils/local_storage/local_storage_constant'

const isLocal = typeof window !== 'undefined' && window.location.hostname === 'localhost'

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    // Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: false,
})

console.log('API URL:', process.env.NEXT_PUBLIC_API_URL, axiosInstance, process.env.NEXT_LOCAL_API_URL)

axiosInstance.interceptors.request.use(async config => {
  console.log('REQUEST INTERCEPTORS CALLED', config)

  const localStoredToken = await getLocalStorageItem(LOCAL_STORAGE_NAME.authToken)
  // const localStoredToken = localStorage.getItem(LOCAL_STORAGE_NAME.authToken)

  // console.log('token:', localStoredToken)

  if (localStoredToken) {
    config.headers['Authorization'] = `Bearer ${localStoredToken}`
  }

  return config
})

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    console.log('ERROR ON interceptors response', error)

    if (error.response?.status === 401) {
      console.log('error from interceptors', error)

      removeLocalStorageItem(LOCAL_STORAGE_NAME.authToken)
      removeLocalStorageItem(LOCAL_STORAGE_NAME.userData)

      // if (window.location.pathname !== '/signin') {

      //     window.location.replace('/signin');
      // }

      //   const navigate = useNavigate();

      //   navigate('/login');
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
