import { ResponseDTO } from '@/components/dto/response_dto'
import { PropertyCategory } from '@/hooks/CustomHooks/usePropertyCategories'
import { appEnpoints } from '@/services/endpoints'
import { getMethod } from '@/services/service'
import { data } from 'framer-motion/client'
import useSWR from 'swr'

const fetcher = async (endpoints: string) => {
  const result = await getMethod(endpoints)
  return result
}

export default function useLandRegistration() {
  const {
    data: propertyCategoryFetchVal,
    error: propertyCategoryFetchErr,
    isLoading: propertyCategoryFetchLoader,
    mutate: propertyCategoryRefresh,
  } = useSWR<ResponseDTO>(`${appEnpoints.getAllPropertyCategories}?activeOnly=true`, fetcher)

  const propertyCategoryResult: Array<PropertyCategory> = propertyCategoryFetchVal?.data

  return {
    propertyCategoryData: propertyCategoryResult,
    propertyCategoryFetchLoader,
    propertyCategoryFetchErr,
    propertyCategoryRefresh,
    // comments: data?.isError ? [] : data?.value,
    // isCommentsLoading: !data && !error,
    // commentsError: data && error,
    // commentsMutate: mutate,
  }
}
