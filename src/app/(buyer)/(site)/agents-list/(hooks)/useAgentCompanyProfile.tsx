import { ResponseDTO } from '@/components/dto/response_dto'
import { getMethod } from '@/services/service'
import useSWR from 'swr'
import { appEndpoints } from '@/services/endpoints'
import AgentCompanyProfile from '@/app/(buyer)/(site)/agents-list/(dto)/agentCompanyProfile'

interface AgentSearchOptions {
  page?: number
  limit?: number
  search?: string
}

interface AgentSearchPayload {
  data?: AgentCompanyProfile[]
  meta?: { total?: number }
  total?: number
}

const DEFAULT_LIMIT = 60
const DEFAULT_PAGE = 1

const fetcher = (endpoint: string) => getMethod(endpoint)

export default function useAgentCompanyProfile(options: AgentSearchOptions = {}) {
  const { page = DEFAULT_PAGE, limit = DEFAULT_LIMIT, search } = options

  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    // activeOnly: 'true',
  })

  const trimmedSearch = search?.trim()
  if (trimmedSearch) {
    query.set('q', trimmedSearch)
  }

  const swrKey = `${appEndpoints.publicSearchAgents}?${query.toString()}`

  const {
    data: agentCompanyProfileFetchValdata,
    error: agentCompanyProfileFetchErr,
    isLoading: agentCompanyProfileFetchLoader,
    mutate: agentCompanyProfileRefresh,
  } = useSWR<ResponseDTO>(swrKey, fetcher)

  const payload = agentCompanyProfileFetchValdata?.data?.data as AgentSearchPayload | AgentCompanyProfile[] | undefined

  let agentCompanyProfileResult: AgentCompanyProfile[] = []
  let totalAgents = 0

  if (Array.isArray(payload)) {
    agentCompanyProfileResult = payload
    totalAgents = payload.length
  } else if (payload) {
    if (Array.isArray(payload.data)) {
      agentCompanyProfileResult = payload.data
    }

    if (typeof payload.meta?.total === 'number') {
      totalAgents = payload.meta.total
    } else if (typeof payload.total === 'number') {
      totalAgents = payload.total
    } else {
      totalAgents = agentCompanyProfileResult.length
    }
  }

  return {
    agentCompanyProfileData: agentCompanyProfileResult,
    agentCompanyProfileTotal: totalAgents,
    agentCompanyProfileFetchLoader,
    agentCompanyProfileFetchErr,
    agentCompanyProfileRefresh,
  }
}
