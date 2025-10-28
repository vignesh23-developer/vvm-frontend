import axios, { AxiosError } from 'axios'
import axiosInstance from './base'
import { ResponseDTO } from '../components/dto/response_dto'

/**
 * Generic HTTP GET wrapper
 */

export async function getMethod<T = any>(
  url: string,
  params?: Record<string, any>,
): Promise<ResponseDTO<T>> {
  try {
    console.log('🌐 GET Request:', { url, params })

    const response = await axiosInstance.get(url, { params })

    console.log('✅ GET Response:', response.data)

    // Handle different API response formats
    const data = response.data?.data ?? response.data

    // If API uses `error: true`
    if (data?.error === true) {
      return new ResponseDTO<T>(
        true,
        {} as T,
        data.message || 'Remote API error',
        response.status.toString(),
      )
    }

    return new ResponseDTO<T>(false, data as T, '', response.status.toString())
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const axiosErr = err as AxiosError<any>
      console.error('❌ Axios Error:', axiosErr.message, axiosErr.response)

      return new ResponseDTO<T>(
        true,
        axiosErr.response?.data ?? ({} as T),
        axiosErr.message,
        axiosErr.response?.status?.toString(),
      )
    }

    // Non-Axios error fallback
    const msg = err instanceof Error ? err.message : String(err)
    console.error('❌ Unknown Error:', msg)

    return new ResponseDTO<T>(true, {} as T, msg)
  }
}

/**
 * Generic HTTP POST wrapper
 */
export async function postMethod<T = any>(
  url: string,
  body?: any,
  headers?: any,
): Promise<ResponseDTO> {
  try {
    const response = await axiosInstance.post<T>(url, body, { headers })

    if (
      response.data &&
      typeof response.data === 'object' &&
      'error' in response.data &&
      (response.data as any).error === true
    ) {
      return new ResponseDTO(
        true,
        {},
        (response.data as any).message || 'Remote Network error',
        '',
      )
    }

    return new ResponseDTO(false, response.data, '')
  } catch (error: unknown) {
    console.log('Error in postMethod:', error)

    // throw error;

    if (axios.isAxiosError(error)) {
      const axiosErr = error as AxiosError<any>
      const status = axiosErr.response?.status
      const data = axiosErr.response?.data
      return new ResponseDTO(true, data, axiosErr.message, status?.toString())
    } else {
      return new ResponseDTO(
        true,
        {},
        error instanceof Error ? error.message : String(error),
      )
    }
  }
}

/**
 * Generic HTTP PUT wrapper
 */
export async function putMethod<T = any>(
  url: string,
  body?: any,
  headers?: any,
): Promise<ResponseDTO> {
  try {
    const response = await axiosInstance.put<T>(url, body, { headers })

    if (
      response.data &&
      typeof response.data === 'object' &&
      'error' in response.data &&
      (response.data as any).error === true
    ) {
      return new ResponseDTO(
        true,
        {},
        (response.data as any).message || 'Remote Network error',
        '',
      )
    }

    return new ResponseDTO(false, response.data, '')
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosErr = error as AxiosError<any>
      const status = axiosErr.response?.status
      const data = axiosErr.response?.data
      return new ResponseDTO(true, data, axiosErr.message, status?.toString())
    } else {
      return new ResponseDTO(
        true,
        {},
        error instanceof Error ? error.message : String(error),
      )
    }
  }
}

/**
 * Generic HTTP DELETE wrapper
 */
export async function deleteMethod<T = any>(
  url: string,
  headers?: any,
): Promise<ResponseDTO> {
  try {
    const response = await axiosInstance.delete<T>(url, { headers })

    if (
      response.data &&
      typeof response.data === 'object' &&
      'error' in response.data &&
      (response.data as any).error === true
    ) {
      return new ResponseDTO(
        true,
        {},
        (response.data as any).message || 'Remote Network error',
        '',
      )
    }

    return new ResponseDTO(false, response.data, '')
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosErr = error as AxiosError<any>
      const status = axiosErr.response?.status
      const data = axiosErr.response?.data
      return new ResponseDTO(true, data, axiosErr.message, status?.toString())
    } else {
      return new ResponseDTO(
        true,
        {},
        error instanceof Error ? error.message : String(error),
      )
    }
  }
}

/**
 * Generic HTTP PATCH wrapper
 */
export async function patchMethod<T = any>(
  url: string,
  isForm: boolean,
  body?: any,
): Promise<ResponseDTO> {
  try {
    let headerConfig: Record<string, string> = {}

    if (isForm) {
      headerConfig['Content-Type'] = 'multipart/form-data'
    }

    const response = await axiosInstance.patch<T>(url, body, {
      headers: headerConfig,
    })

    if (
      response.data &&
      typeof response.data === 'object' &&
      'error' in response.data &&
      (response.data as any).error === true
    ) {
      return new ResponseDTO(
        true,
        {},
        (response.data as any).message || 'Remote Network error',
        '',
      )
    }

    return new ResponseDTO(false, response.data, '')
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosErr = error as AxiosError<any>
      const status = axiosErr.response?.status
      const data = axiosErr.response?.data
      return new ResponseDTO(true, data, axiosErr.message, status?.toString())
    } else {
      return new ResponseDTO(
        true,
        {},
        error instanceof Error ? error.message : String(error),
      )
    }
  }
}
