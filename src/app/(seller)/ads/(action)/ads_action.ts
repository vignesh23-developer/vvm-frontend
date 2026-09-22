'use client'

import { appEndpoints } from '@/services/endpoints'
import { postMethod, patchMethod, deleteMethod, getMethod } from '@/services/service'

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

// Ads Images
export async function onAddAdImages(
  prevState: any,
  params: {
    adId: string
    formData: FormData
    current: number
    total: number
  },
): Promise<any> {
  try {
    // Add current and total to form data
    params.formData.append('current', params.current.toString())
    params.formData.append('total', params.total.toString())

    const response = await postMethod(appEndpoints.addAdImages(params.adId), params.formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    return {
      success: !response.error,
      error: response.error,
      message: response.message || 'Images uploaded successfully',
      data: response.data,
    }
  } catch (e) {
    return {
      error: true,
      message: 'Something went wrong while uploading ad images',
      data: null,
    }
  }
}

export async function getAdImages(adId: string): Promise<any> {
  try {
    const response = await getMethod(appEndpoints.getAdImages(adId))
    return {
      success: !response.error,
      error: response.error,
      message: response.message,
      data: response.data,
    }
  } catch (e) {
    return {
      error: true,
      message: 'Something went wrong while fetching ad images',
      data: null,
    }
  }
}

export async function updateAdImage(adId: string, imageId: string, body: { is_primary?: boolean; sort_order?: number }): Promise<any> {
  try {
    const response = await patchMethod(appEndpoints.updateAdImage(adId, imageId), body)
    return {
      success: !response.error,
      error: response.error,
      message: response.message || 'Image updated successfully',
      data: response.data,
    }
  } catch (e) {
    return {
      error: true,
      message: 'Something went wrong while updating ad image',
      data: null,
    }
  }
}

export async function onUpdateAd(prevState: any, payload: { id: string; data: any }): Promise<any> {
  try {
    const response = await patchMethod(appEndpoints.updateAd(payload.id), payload.data)

    return {
      success: !response.error,
      error: response.error,
      message: response.message || 'Ad updated successfully',
      data: response.data,
    }
  } catch (e) {
    return {
      error: true,
      message: 'Something went wrong while updating Ad',
      data: null,
    }
  }
}

export async function onDeleteAd(adId: string): Promise<any> {
  try {
    const response = await deleteMethod(appEndpoints.deleteAd(adId))

    return {
      success: !response.error,
      error: response.error,
      message: response.message || 'Ad deleted successfully',
      data: response.data,
    }
  } catch (e) {
    return {
      error: true,
      message: 'Something went wrong while deleting Ad',
      data: null,
    }
  }
}

export async function deleteAdImage(adId: string, imageId: string): Promise<any> {
  try {
    const response = await deleteMethod(appEndpoints.deleteAdImage(adId, imageId))
    return {
      success: !response.error,
      error: response.error,
      message: response.message || 'Image deleted successfully',
      data: response.data,
    }
  } catch (e) {
    return {
      error: true,
      message: 'Something went wrong while deleting ad image',
      data: null,
    }
  }
}

export async function getAdById(adId: string): Promise<any> {
  try {
    const response = await getMethod(appEndpoints.getAdByID(adId))

    return {
      success: !response.error,
      error: response.error,
      message: response.message,
      data: response.data,
    }
  } catch (e) {
    return {
      error: true,
      message: 'Something went wrong while fetching Ad',
      data: null,
    }
  }
}
