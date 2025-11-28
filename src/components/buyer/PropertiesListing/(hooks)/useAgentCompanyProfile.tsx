import { ResponseDTO } from '@/components/dto/response_dto'
// import { PropertyCategory } from '@/hooks/CustomHooks/usePropertyCategories'
// import { appEnpoints } from '@/services/endpoints'
import { getMethod } from '@/services/service'
import { data } from 'framer-motion/client'
import useSWR, { KeyedMutator } from 'swr'
import { appEndpoints } from '@/services/endpoints'
import AgentCompanyProfile from '@/components/buyer/PropertiesListing/dto/agentCompanyProfile'

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

  return {
    agentCompanyProfileData: agentCompanyProfileResult,
    agentCompanyProfileFetchLoader,
    agentCompanyProfileFetchErr,
    agentCompanyProfileRefresh,
  }
}
