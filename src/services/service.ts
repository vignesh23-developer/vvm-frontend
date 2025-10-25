// import axios, { AxiosError } from 'axios'
// import axiosInstance from './base'
// import { ResponseDTO } from '../components/dto/response_dto'

// /**
//  * Generic HTTP GET wrapper
//  */

// export async function getMethod<T = any>(url: string, params?: Record<string, any>): Promise<ResponseDTO<T>> {
//   try {
//     console.log('🌐 GET Request:', { url, params })

//     const response = await axiosInstance.get(url, { params })

//     console.log('✅ GET Response:', response.data)

//     // Handle different API response formats
//     const data = response.data?.data ?? response.data

//     // If API uses `error: true`
//     if (data?.error === true) {
//       return new ResponseDTO<T>(true, {} as T, data.message || 'Remote API error', response.status.toString())
//     }

//     return new ResponseDTO<T>(false, data as T, '', response.status.toString())
//   } catch (err: unknown) {
//     if (axios.isAxiosError(err)) {
//       const axiosErr = err as AxiosError<any>
//       console.error('❌ Axios Error:', axiosErr.message, axiosErr.response)

//       return new ResponseDTO<T>(true, axiosErr.response?.data ?? ({} as T), 'Server not reachable', axiosErr.response?.status?.toString())
//     }

//     // Non-Axios error fallback
//     const msg = err instanceof Error ? err.message : String(err)
//     console.error('❌ Unknown Error:', msg)

//     return new ResponseDTO<T>(true, {} as T, 'Server not reachable')
//   }
// }

// /**
//  * Generic HTTP POST wrapper
//  */
// export async function postMethod<T = any>(url: string, body?: any, headers?: any): Promise<ResponseDTO> {
//   try {
//     const response = await axiosInstance.post<T>(url, body, { headers })

//     if (response.data && typeof response.data === 'object' && 'error' in response.data && (response.data as any).error === true) {
//       return new ResponseDTO(true, {}, (response.data as any).message || 'Remote Network error', '')
//     }

//     return new ResponseDTO(false, response.data, '')
//   } catch (error: unknown) {
//     console.log('Error in postMethod:', error)

//     // throw error;

//     if (axios.isAxiosError(error)) {
//       const axiosErr = error as AxiosError<any>
//       const status = axiosErr.response?.status
//       const data = axiosErr.response?.data
//       return new ResponseDTO(true, data, 'Server not reachable', status?.toString())
//     } else {
//       return new ResponseDTO(true, {}, 'Server not reachable')
//     }
//   }
// }

// /**
//  * Generic HTTP PUT wrapper
//  */
// export async function putMethod<T = any>(url: string, body?: any, headers?: any): Promise<ResponseDTO> {
//   try {
//     const response = await axiosInstance.patch<T>(url, body, { headers })

//     if (response.data && typeof response.data === 'object' && 'error' in response.data && (response.data as any).error === true) {
//       return new ResponseDTO(true, {}, (response.data as any).message || 'Remote Network error', '')
//     }

//     return new ResponseDTO(false, response.data, '')
//   } catch (error: unknown) {
//     if (axios.isAxiosError(error)) {
//       const axiosErr = error as AxiosError<any>
//       const status = axiosErr.response?.status
//       const data = axiosErr.response?.data
//       return new ResponseDTO(true, data, 'Server not reachable', status?.toString())
//     } else {
//       return new ResponseDTO(true, {}, 'Server not reachable')
//     }
//   }
// }

// /**
//  * Generic HTTP DELETE wrapper
//  */
// export async function deleteMethod<T = any>(url: string, headers?: any): Promise<ResponseDTO> {
//   try {
//     const response = await axiosInstance.delete<T>(url, { headers })

//     if (response.data && typeof response.data === 'object' && 'error' in response.data && (response.data as any).error === true) {
//       return new ResponseDTO(true, {}, (response.data as any).message || 'Remote Network error', '')
//     }

//     return new ResponseDTO(false, response.data, '')
//   } catch (error: unknown) {
//     if (axios.isAxiosError(error)) {
//       const axiosErr = error as AxiosError<any>
//       const status = axiosErr.response?.status
//       const data = axiosErr.response?.data
//       return new ResponseDTO(true, data, 'Server not reachable', status?.toString())
//     } else {
//       return new ResponseDTO(true, {}, 'Server not reachable')
//     }
//   }
// }

// /**
//  * Generic HTTP PATCH wrapper
//  */
// export async function patchMethod<T = any>(url: string, isForm: boolean, body?: any): Promise<ResponseDTO> {
//   try {
//     let headerConfig: Record<string, string> = {}

//     if (isForm) {
//       headerConfig['Content-Type'] = 'multipart/form-data'
//     }

//     const response = await axiosInstance.patch<T>(url, body, {
//       headers: headerConfig,
//     })

//     if (response.data && typeof response.data === 'object' && 'error' in response.data && (response.data as any).error === true) {
//       return new ResponseDTO(true, {}, (response.data as any).message || 'Remote Network error', '')
//     }

//     return new ResponseDTO(false, response.data, '')
//   } catch (error: unknown) {
//     if (axios.isAxiosError(error)) {
//       const axiosErr = error as AxiosError<any>
//       const status = axiosErr.response?.status
//       const data = axiosErr.response?.data
//       return new ResponseDTO(true, data, 'Server not reachable', status?.toString())
//     } else {
//       return new ResponseDTO(true, {}, 'Server not reachable')
//     }
//   }
// }

// src/api/httpWrappers.ts
import axios, { AxiosError } from 'axios'
import axiosInstance from './base' // your configured Axios instance
import { ResponseDTO } from '@/components/dto/response_dto'

type ApiResponseWrapper<T> = {
  error?: boolean
  data?: T
  message?: string
}

export async function getMethod<T = unknown>(url: string, params?: Record<string, any>): Promise<ResponseDTO<T>> {
  try {
    console.log('🌐 GET Request:', { url, params })

    const response = await axiosInstance.get<ApiResponseWrapper<T>>(url, { params })
    console.log('✅ GET Response:', response.data)

    const payload = response.data
    const statusCode = response.status.toString()

    if (payload.error === true) {
      return new ResponseDTO<T>({
        error: true,
        data: payload.data ?? ({} as T),
        message: payload.message ?? 'Remote API error',
        status: statusCode,
      })
    }

    const actualData = payload.data !== undefined ? payload.data : (payload as unknown as T)

    return new ResponseDTO<T>({
      error: false,
      data: actualData,
      message: '',
      status: statusCode,
    })
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const axiosErr = err as AxiosError<any>
      console.error('❌ Axios Error:', axiosErr.message, axiosErr.response)
      return new ResponseDTO<T>({
        error: true,
        data: axiosErr.response?.data ?? ({} as T),
        message: 'Server not reachable',
        status: axiosErr.response?.status?.toString(),
      })
    }
    const msg = err instanceof Error ? err.message : String(err)
    console.error('❌ Unknown Error:', msg)
    return new ResponseDTO<T>({
      error: true,
      data: {} as T,
      message: 'Server not reachable',
    })
  }
}

export async function postMethod<T = unknown>(url: string, body?: any, headers?: Record<string, any>): Promise<ResponseDTO<T>> {
  try {
    console.log('🌐 POST Request:', { url, body, headers })

    const response = await axiosInstance.post<ApiResponseWrapper<T>>(url, body, { headers })
    console.log('✅ POST Response:', response.data)

    const payload = response.data
    const statusCode = response.status.toString()

    if (payload.error === true) {
      return new ResponseDTO<T>({
        error: true,
        data: payload.data ?? ({} as T),
        message: payload.message ?? 'Remote API error',
        status: statusCode,
      })
    }

    const actualData = payload.data !== undefined ? payload.data : (payload as unknown as T)

    return new ResponseDTO<T>({
      error: false,
      data: actualData,
      message: '',
      status: statusCode,
    })
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const axiosErr = err as AxiosError<any>
      console.error('❌ Axios Error (POST):', axiosErr.message, axiosErr.response)
      return new ResponseDTO<T>({
        error: true,
        data: axiosErr.response?.data ?? ({} as T),
        message: 'Server not reachable',
        status: axiosErr.response?.status?.toString(),
      })
    }
    const msg = err instanceof Error ? err.message : String(err)
    console.error('❌ Unknown Error (POST):', msg)
    return new ResponseDTO<T>({
      error: true,
      data: {} as T,
      message: 'Server not reachable',
    })
  }
}

export async function putMethod<T = unknown>(url: string, body?: any, headers?: Record<string, any>): Promise<ResponseDTO<T>> {
  try {
    console.log('🌐 PUT Request:', { url, body, headers })

    const response = await axiosInstance.put<ApiResponseWrapper<T>>(url, body, { headers })
    console.log('✅ PUT Response:', response.data)

    const payload = response.data
    const statusCode = response.status.toString()

    if (payload.error === true) {
      return new ResponseDTO<T>({
        error: true,
        data: payload.data ?? ({} as T),
        message: payload.message ?? 'Remote API error',
        status: statusCode,
      })
    }

    const actualData = payload.data !== undefined ? payload.data : (payload as unknown as T)

    return new ResponseDTO<T>({
      error: false,
      data: actualData,
      message: '',
      status: statusCode,
    })
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const axiosErr = err as AxiosError<any>
      console.error('❌ Axios Error (PUT):', axiosErr.message, axiosErr.response)
      return new ResponseDTO<T>({
        error: true,
        data: axiosErr.response?.data ?? ({} as T),
        message: 'Server not reachable',
        status: axiosErr.response?.status?.toString(),
      })
    }
    const msg = err instanceof Error ? err.message : String(err)
    console.error('❌ Unknown Error (PUT):', msg)
    return new ResponseDTO<T>({
      error: true,
      data: {} as T,
      message: 'Server not reachable',
    })
  }
}

export async function patchMethod<T = unknown>(url: string, body?: any, headers?: Record<string, any>): Promise<ResponseDTO<T>> {
  try {
    console.log('🌐 PATCH Request:', { url, body, headers })

    const response = await axiosInstance.patch<ApiResponseWrapper<T>>(url, body, { headers })
    console.log('✅ PATCH Response:', response.data)

    const payload = response.data
    const statusCode = response.status.toString()

    if (payload.error === true) {
      return new ResponseDTO<T>({
        error: true,
        data: payload.data ?? ({} as T),
        message: payload.message ?? 'Remote API error',
        status: statusCode,
      })
    }

    const actualData = payload.data !== undefined ? payload.data : (payload as unknown as T)

    return new ResponseDTO<T>({
      error: false,
      data: actualData,
      message: '',
      status: statusCode,
    })
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const axiosErr = err as AxiosError<any>
      console.error('❌ Axios Error (PATCH):', axiosErr.message, axiosErr.response)
      return new ResponseDTO<T>({
        error: true,
        data: axiosErr.response?.data ?? ({} as T),
        message: 'Server not reachable',
        status: axiosErr.response?.status?.toString(),
      })
    }
    const msg = err instanceof Error ? err.message : String(err)
    console.error('❌ Unknown Error (PATCH):', msg)
    return new ResponseDTO<T>({
      error: true,
      data: {} as T,
      message: 'Server not reachable',
    })
  }
}

export async function deleteMethod<T = unknown>(url: string, headers?: Record<string, any>): Promise<ResponseDTO<T>> {
  try {
    console.log('🌐 DELETE Request:', { url, headers })

    const response = await axiosInstance.delete<ApiResponseWrapper<T>>(url, { headers })
    console.log('✅ DELETE Response:', response.data)

    const payload = response.data
    const statusCode = response.status.toString()

    if (payload.error === true) {
      return new ResponseDTO<T>({
        error: true,
        data: payload.data ?? ({} as T),
        message: payload.message ?? 'Remote API error',
        status: statusCode,
      })
    }

    const actualData = payload.data !== undefined ? payload.data : (payload as unknown as T)

    return new ResponseDTO<T>({
      error: false,
      data: actualData,
      message: '',
      status: statusCode,
    })
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const axiosErr = err as AxiosError<any>
      console.error('❌ Axios Error (DELETE):', axiosErr.message, axiosErr.response)
      return new ResponseDTO<T>({
        error: true,
        data: axiosErr.response?.data ?? ({} as T),
        message: 'Server not reachable',
        status: axiosErr.response?.status?.toString(),
      })
    }
    const msg = err instanceof Error ? err.message : String(err)
    console.error('❌ Unknown Error (DELETE):', msg)
    return new ResponseDTO<T>({
      error: true,
      data: {} as T,
      message: 'Server not reachable',
    })
  }
}
