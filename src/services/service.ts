// src/api/httpWrappers.ts
import axios, { AxiosError } from 'axios'
import axiosInstance from './base' // your configured Axios instance
import { ResponseDTO } from '@/components/dto/response_dto'
import { LOCAL_STORAGE_NAME } from '@/utils/local_storage/local_storage_constant'
import { getLocalStorageItem } from '@/utils/local_storage/local_storage_handler'

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
      console.log('❌ Axios Error:', axiosErr.message, axiosErr.response)
      return new ResponseDTO<T>({
        error: true,
        data: axiosErr.response?.data ?? ({} as T),
        message: 'Server not reachable',
        status: axiosErr.response?.status?.toString(),
      })
    }
    const msg = err instanceof Error ? err.message : String(err)
    console.log('❌ Unknown Error:', msg)
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

    const response = await axiosInstance.post<ApiResponseWrapper<T>>(url, body)
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
      console.log('❌ Axios Error (POST):', axiosErr.message, axiosErr.response)
      return new ResponseDTO<T>({
        error: true,
        data: axiosErr.response?.data ?? ({} as T),
        message: 'Server not reachable',
        status: axiosErr.response?.status?.toString(),
      })
    }
    const msg = err instanceof Error ? err.message : String(err)
    console.log('❌ Unknown Error (POST):', msg)
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
      console.log('❌ Axios Error (PUT):', axiosErr.message, axiosErr.response)
      return new ResponseDTO<T>({
        error: true,
        data: axiosErr.response?.data ?? ({} as T),
        message: 'Server not reachable',
        status: axiosErr.response?.status?.toString(),
      })
    }
    const msg = err instanceof Error ? err.message : String(err)
    console.log('❌ Unknown Error (PUT):', msg)
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
      console.log('❌ Axios Error (PATCH):', axiosErr.message, axiosErr.response)
      return new ResponseDTO<T>({
        error: true,
        data: axiosErr.response?.data ?? ({} as T),
        message: 'Server not reachable',
        status: axiosErr.response?.status?.toString(),
      })
    }
    const msg = err instanceof Error ? err.message : String(err)
    console.log('❌ Unknown Error (PATCH):', msg)
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
      console.log('❌ Axios Error (DELETE):', axiosErr.message, axiosErr.response)
      return new ResponseDTO<T>({
        error: true,
        data: axiosErr.response?.data ?? ({} as T),
        message: 'Server not reachable',
        status: axiosErr.response?.status?.toString(),
      })
    }
    const msg = err instanceof Error ? err.message : String(err)
    console.log('❌ Unknown Error (DELETE):', msg)
    return new ResponseDTO<T>({
      error: true,
      data: {} as T,
      message: 'Server not reachable',
    })
  }
}
