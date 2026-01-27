import { ResponseDTO } from '@/components/dto/response_dto'
// import { PropertyCategory } from '@/hooks/CustomHooks/usePropertyCategories'
// import { appEnpoints } from '@/services/endpoints'
import { getMethod } from '@/services/service'
import { data } from 'framer-motion/client'
import useSWR, { KeyedMutator } from 'swr'
import { GetAllPropertyCategoryFeatureMappingDTO } from '../(dto)/properties_registration_dto'
import { appEndpoints } from '@/services/endpoints'
import { PropertyCategory } from '@/app/(seller)/properties-registration/(dto)/properties_registration_dto'

const fetcher = async (endpoints: string) => {
  const result = await getMethod(endpoints)
  return result
}
const LIMIT = 0
const PAGE = 1

export type PropertyCategoryFeatureMappingResponse = Omit<ResponseDTO, 'data'> & {
  data: GetAllPropertyCategoryFeatureMappingDTO
}

export default function useLandRegistration() {
  const {
    data: propertyCategoryFetchVal,
    error: propertyCategoryFetchErr,
    isLoading: propertyCategoryFetchLoader,
    mutate: propertyCategoryRefresh,
  } = useSWR<ResponseDTO>(`${appEndpoints.getAllPropertyCategories}?activeOnly=true&limit=${LIMIT}&page=${PAGE}`, fetcher)

  const propertyCategoryResult: Array<PropertyCategory> = propertyCategoryFetchVal?.data?.data

  async function onGetPropertyCategoryFeatureMapping(id: string): Promise<PropertyCategoryFeatureMappingResponse> {
    // console.log('Fetching feature mapping for category ID:', id)
    const result: ResponseDTO<GetAllPropertyCategoryFeatureMappingDTO> = await getMethod(appEndpoints?.getPropertyCategoryFeatureMappingByID(id))

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
