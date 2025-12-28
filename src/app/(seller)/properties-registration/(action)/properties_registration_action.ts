import { ResponseDTO } from '@/components/dto/response_dto'
import { deleteMethod, getMethod, patchMethod, postMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'

export async function onCreateProperty(prevState: ResponseDTO, data: { payload: any; userId: string }): Promise<ResponseDTO> {
  try {
    console.log('log on action:', data)
    const response: ResponseDTO = await postMethod(appEndpoints.createProperties(data.userId), data.payload)

    console.log('log on property creation:', response)

    return {
      success: !response.error,
      error: response.error,
      message: response.message,
      data: response.data,
    }
  } catch (e) {
    return {
      error: true,
      message: 'Something went wrong while creating Property',
      data: null,
    }
  }
}

export async function onUpdateProperty(prevState: ResponseDTO, data: { payload: any; propertiesId: string }): Promise<ResponseDTO> {
  console.log('log on action:', data)

  try {
    const response: ResponseDTO = await patchMethod(`properties/${data?.propertiesId}`, data?.payload)

    console.log('log on property creation:', response)

    return {
      success: !response.error,
      error: response.error,
      message: response.message,
      data: response.data,
    }
  } catch (e) {
    return {
      error: true,
      message: 'Something went wrong while creating Property',
      data: null,
    }
  }
}

export async function onAddPropertyMedia(
  prevState: ResponseDTO,
  params: { id: string; payload: Array<any>; uploadType: 'chooseFromDevice' | 'addViaLink' },
): Promise<ResponseDTO> {
  try {
    if (params?.uploadType === 'addViaLink') {
      const response: ResponseDTO = await postMethod(appEndpoints.addPropertyMediaLink(params?.id), params?.payload)

      console.log('log on add property media via link:', response)

      return {
        success: !response.error,
        error: response.error,
        message: response.message,
        data: response.data,
      }
    } else {
      const response: ResponseDTO = await postMethod(appEndpoints.addPropertyMediaLocal(params?.id), params?.payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      console.log('log on add property choose from device:', response)

      return {
        success: !response.error,
        error: response.error,
        message: response.message,
        data: response.data,
      }
    }
  } catch (e) {
    return {
      error: true,
      message: 'Something went wrong while creating Property',
      data: null,
    }
  }
}

export async function onAddPropertyImages(
  prevState: any,
  params: {
    propertyId: string
    formData: FormData
    current: number
    total: number
  },
): Promise<any> {
  try {
    // Add current and total to form data
    params.formData.append('current', params.current.toString())
    params.formData.append('total', params.total.toString())

    const response = await postMethod(appEndpoints.addPropertyImages(params.propertyId), params.formData, {
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
      message: 'Something went wrong while uploading property images',
      data: null,
    }
  }
}

export async function getPropertyImages(propertyId: string): Promise<any> {
  try {
    const response = await getMethod(appEndpoints.getPropertyImages(propertyId))
    return {
      success: !response.error,
      error: response.error,
      message: response.message,
      data: response.data,
    }
  } catch (e) {
    return {
      error: true,
      message: 'Something went wrong while fetching property images',
      data: null,
    }
  }
}

export async function updatePropertyImage(propertyId: string, imageId: string, body: { is_primary?: boolean; sort_order?: number }): Promise<any> {
  try {
    const response = await patchMethod(appEndpoints.updatePropertyImage(propertyId, imageId), body)
    return {
      success: !response.error,
      error: response.error,
      message: response.message || 'Image updated successfully',
      data: response.data,
    }
  } catch (e) {
    return {
      error: true,
      message: 'Something went wrong while updating property image',
      data: null,
    }
  }
}

export async function deletePropertyImage(propertyId: string, imageId: string): Promise<any> {
  try {
    const response = await deleteMethod(appEndpoints.deletePropertyImage(propertyId, imageId))
    return {
      success: !response.error,
      error: response.error,
      message: response.message || 'Image deleted successfully',
      data: response.data,
    }
  } catch (e) {
    return {
      error: true,
      message: 'Something went wrong while deleting property image',
      data: null,
    }
  }
}
