import AgentCompanyProfile from '@/app/(buyer)/(site)/agents-list/(dto)/agentCompanyProfile'
import { appEndpoints } from '@/services/endpoints'
import { getMethod } from '@/services/service'

type SearchListPayload<T> = { data?: T[]; total?: number }

function normalizeList<T>(payload: unknown): T[] {
  if (!payload) return []
  if (Array.isArray(payload)) return payload as T[]

  const record = payload as { data?: T[] | { data?: T[] } }
  if (Array.isArray(record.data)) return record.data
  if (record.data && typeof record.data === 'object' && Array.isArray(record.data.data)) {
    return record.data.data
  }

  return []
}

function matchesProfileName(agent: AgentCompanyProfile, profileName: string): boolean {
  const wanted = profileName.trim().toLowerCase()
  const actual = (agent.profileName || '').trim().toLowerCase()
  return wanted.length > 0 && actual === wanted
}

/** Public agent profile lookup (no JWT). */
export async function fetchAgencyByProfileNamePublic(
  profileName: string,
): Promise<AgentCompanyProfile | null> {
  const response = await getMethod<SearchListPayload<AgentCompanyProfile>>(appEndpoints.publicSearchAgents, {
    q: profileName.trim(),
    page: 1,
    limit: 20,
  })

  if (String(response?.status) !== '200' || response.error) {
    return null
  }

  const agents = normalizeList<AgentCompanyProfile>(response.data)
  return agents.find(a => matchesProfileName(a, profileName)) ?? null
}

/** Public agent listings (no JWT). */
export async function fetchAgentListingsPublic(agentId: string, limit = 50): Promise<unknown[]> {
  const response = await getMethod<SearchListPayload<unknown>>(appEndpoints.publicSearchProperties, {
    agent_id: agentId,
    page: 1,
    limit,
  })

  if (String(response?.status) !== '200' || response.error) {
    return []
  }

  return normalizeList<unknown>(response.data)
}
