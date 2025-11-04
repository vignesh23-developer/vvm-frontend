import { ResponseDTO } from '@/components/dto/response_dto'
import { patchMethod, postMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'
import { head } from 'framer-motion/client'

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
