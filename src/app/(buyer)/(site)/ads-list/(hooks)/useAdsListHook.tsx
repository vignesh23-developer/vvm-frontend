import { ResponseDTO } from '@/components/dto/response_dto'
// import { PropertyCategory } from '@/hooks/CustomHooks/usePropertyCategories'
// import { appEnpoints } from '@/services/endpoints'
import { getMethod } from '@/services/service'
import { data } from 'framer-motion/client'
import useSWR, { KeyedMutator } from 'swr'
import { appEndpoints } from '@/services/endpoints'
import { AdsListDto } from '@/app/(buyer)/(site)/ads-list/(dto)/AdsListDto'

interface UseAdsOptions {
  page?: number
  limit?: number
  approval_status?: string
}

const fetcher = async (endpoints: string) => {
  const result = await getMethod(endpoints)
  return result
}

export default function useAdsListHook(options: UseAdsOptions = {}) {
  const { page = 1, limit = 10, approval_status } = options

  const queryParams = new URLSearchParams()
  if (approval_status) {
    queryParams.set('approval_status', approval_status)
  }
  if (limit != null) {
    queryParams.set('limit', String(limit))
  }
  if (page != null) {
    queryParams.set('page', String(page))
  }
  const {
    data: adsListFetchVal,
    error: adsListFetchErr,
    isLoading: adsListFetchLoader,
    mutate: adsListRefresh,
  } = useSWR<ResponseDTO>(`${appEndpoints.getAllAds}?${queryParams.toString()}&activeOnly=true`, fetcher)

  const adsListResult: Array<AdsListDto> = adsListFetchVal?.data?.data
  const adsListTotal: number = adsListFetchVal?.data?.total ?? 0

  return {
    adsListData: adsListResult,
    adsListTotal,
    adsListFetchLoader,
    adsListFetchErr,
    adsListRefresh,
  }
}
