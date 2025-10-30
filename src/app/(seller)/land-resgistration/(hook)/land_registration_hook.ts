import { ResponseDTO } from '@/components/dto/response_dto'
import { PropertyCategory } from '@/hooks/CustomHooks/usePropertyCategories'
import { appEnpoints } from '@/services/endpoints'
import { getMethod } from '@/services/service'
import { data } from 'framer-motion/client'
import useSWR, { KeyedMutator } from 'swr'
import { GetAllPropertyCategoryFeatureMappingDTO } from '../(dto)/land_registration_dto'

const fetcher = async (endpoints: string) => {
  const result = await getMethod(endpoints)
  return result
}

export type PropertyCategoryFeatureMappingResponse = Omit<ResponseDTO, 'data'> & {
  data: GetAllPropertyCategoryFeatureMappingDTO
}

export default function useLandRegistration() {
  const {
    data: propertyCategoryFetchVal,
    error: propertyCategoryFetchErr,
    isLoading: propertyCategoryFetchLoader,
    mutate: propertyCategoryRefresh,
  } = useSWR<ResponseDTO>(`${appEnpoints.getAllPropertyCategories}?activeOnly=true`, fetcher)

  const propertyCategoryResult: Array<PropertyCategory> = propertyCategoryFetchVal?.data

  async function onGetPropertyCategoryFeatureMapping(id: string): Promise<PropertyCategoryFeatureMappingResponse> {
    const result: ResponseDTO<GetAllPropertyCategoryFeatureMappingDTO> = await getMethod(appEnpoints?.getPropertyCategoryFeatureMappingByID(id))

    const data: GetAllPropertyCategoryFeatureMappingDTO = result?.data

    return result as PropertyCategoryFeatureMappingResponse
  }

  return {
    propertyCategoryData: propertyCategoryResult,
    propertyCategoryFetchLoader,
    propertyCategoryFetchErr,
    propertyCategoryRefresh,
    onGetPropertyCategoryFeatureMapping,
  }
}
