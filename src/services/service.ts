import axios, { AxiosError } from 'axios'
import axiosInstance from './base'
import { ResponseDTO } from '../components/dto/response_dto'

/**
 * Generic HTTP GET wrapper
 */
export async function getMethod<T = any>(
  url: string,
  body?: any,
): Promise<ResponseDTO> {
  try {
    const response = await axiosInstance.get<any>(url, body)

    if (
      response.data.data &&
      typeof response.data.data === 'object' &&
      'error' in response.data.data &&
      (response.data.data as any).error === true
    ) {
      return new ResponseDTO(
        true,
        {},
        (response.data as any).message || 'Remote Network error',
        '',
      )
    }

    return new ResponseDTO(false, response.data.data, '')
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosErr = error as AxiosError<any>
      // You can inspect status, response, etc.
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
