import { ResponseDTO } from '@/components/dto/response_dto'
// import { PropertyCategory } from '@/hooks/CustomHooks/usePropertyCategories'
// import { appEnpoints } from '@/services/endpoints'
import { getMethod } from '@/services/service'
import useSWR, { KeyedMutator } from 'swr'
import { appEndpoints } from '@/services/endpoints'
import AgentCompanyProfile from '@/app/(buyer)/(site)/agents-list/(dto)/agentCompanyProfile'

const fetcher = async (endpoints: string) => {
  const result = await getMethod(endpoints)
  return result
}

export default function useAgentCompanyProfile() {
  const {
    data: agentCompanyProfileFetchVal,
    error: agentCompanyProfileFetchErr,
    isLoading: agentCompanyProfileFetchLoader,
    mutate: agentCompanyProfileRefresh,
  } = useSWR<ResponseDTO>(`${appEndpoints.getCompanyProfile}?activeOnly=true`, fetcher)

  const agentCompanyProfileResult: Array<AgentCompanyProfile> = agentCompanyProfileFetchVal?.data
  console.log('agentCompanyProfileResult', agentCompanyProfileResult)

  // const agentCompanyProfileTotal: number = agentCompanyProfileFetchVal?.meta?.total ?? 0

  return {
    agentCompanyProfileData: agentCompanyProfileResult,
    agentCompanyProfileFetchLoader,
    agentCompanyProfileFetchErr,
    agentCompanyProfileRefresh,
  }
}
