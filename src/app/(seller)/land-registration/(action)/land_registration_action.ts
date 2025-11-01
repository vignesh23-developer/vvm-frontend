'use server'

import { ResponseDTO } from '@/components/dto/response_dto'
import { patchMethod, postMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'

export async function onCreateProperty(prevState: ResponseDTO, payload: any): Promise<ResponseDTO> {
  try {
    const response: ResponseDTO = await postMethod(appEndpoints.createProperties('cc98934f-d1f7-4e8d-8484-72d24f94b508'), payload)

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
1
export async function onUpdateProperty(prevState: ResponseDTO, data: { payload: any; localStroagePropertyId: string }): Promise<ResponseDTO> {
  console.log('log on action:', data)

  try {
    const response: ResponseDTO = await patchMethod(`properties/${data?.localStroagePropertyId}`, data?.payload)

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
      const response: ResponseDTO = await postMethod(appEndpoints.addPropertyMediaLocal(params?.id), params?.payload)

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
