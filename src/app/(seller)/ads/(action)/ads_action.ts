'use client'

import { appEndpoints } from '@/services/endpoints'
import { postMethod } from '@/services/service'

export async function onCreateAd(prevState: any, payload: any): Promise<any> {
  try {
    const response = await postMethod(appEndpoints.createAd, payload)

    return {
      success: !response.error,
      error: response.error,
      message: response.message,
      data: response.data,
    }
  } catch (e) {
    return {
      error: true,
      message: 'Something went wrong while creating Ad',
      data: null,
    }
  }
}
