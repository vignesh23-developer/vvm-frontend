'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import useSWR from 'swr'
import { FormikProps } from 'formik'
import { ChevronDown, Search, X } from 'lucide-react'
import { getMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'
import { useCompanyProfilesByUserId } from '@/hooks/CustomHooks/useGetCompanyProfileByUserId'
import { PropertyCreationFormValues } from '../page'

export type AdminPostingTarget = {
  ownerId: string
  agentId: string
}

type AgentUserOption = {
  id: string
  firstName?: string
  lastName?: string
  email?: string
  phoneNumber?: string | null
  roles?: string[] | string
}

type AdminPostingAsProps = {
  formik: FormikProps<PropertyCreationFormValues>
  value: AdminPostingTarget
  onChange: (next: AdminPostingTarget) => void
  disabled?: boolean
}

function formatAgentLabel(user: AgentUserOption) {
  const name = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
  const email = user.email?.trim()
  if (name && email) return `${name} (${email})`
  return name || email || user.id
}

function hasAgentRole(roles: AgentUserOption['roles']) {
  const list = Array.isArray(roles) ? roles : roles ? [roles] : []
  return list.some(role => String(role).toUpperCase() === 'AGENT')
}

function extractUsers(payload: unknown): AgentUserOption[] {
  if (!payload) return []
  if (Array.isArray(payload)) return payload
  if (typeof payload === 'object') {
    const nested = (payload as { data?: unknown }).data
    if (Array.isArray(nested)) return nested
  }
  return []
}

async function fetchAgents(url: string): Promise<AgentUserOption[]> {
  const response = await getMethod<any>(url)

  if (response?.error) {
    throw new Error(response.message || 'Failed to load agents')
  }

  const users = extractUsers(response?.data)
  return users.filter(user => hasAgentRole(user.roles))
}

export default function AdminPostingAs({ formik, value, onChange, disabled }: AdminPostingAsProps) {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedAgentCache, setSelectedAgentCache] = useState<AgentUserOption | null>(null)
  const [isAgentMenuOpen, setIsAgentMenuOpen] = useState(false)
  const agentMenuRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const { companyProfiles, isLoading: isLoadingProfiles, error: profilesError } = useCompanyProfilesByUserId(
    value.ownerId || '',
  )

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 300)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    if (!isAgentMenuOpen) return

    const onPointerDown = (event: MouseEvent) => {
      if (!agentMenuRef.current?.contains(event.target as Node)) {
        setIsAgentMenuOpen(false)
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsAgentMenuOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isAgentMenuOpen])

  useEffect(() => {
    if (isAgentMenuOpen) {
      searchInputRef.current?.focus()
    }
  }, [isAgentMenuOpen])

  const agentsUrl = useMemo(() => {
    const params = new URLSearchParams({
      activeOnly: 'true',
      role: 'AGENT',
      page: '1',
      limit: '50',
    })
    if (debouncedSearch) {
      params.set('search', debouncedSearch)
    }
    return `${appEndpoints.getAllUsers}?${params.toString()}`
  }, [debouncedSearch])

  const {
    data: agents = [],
    error,
    isLoading: isLoadingAgents,
  } = useSWR<AgentUserOption[]>(agentsUrl, fetchAgents, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  })

  const agentsError = error instanceof Error ? error.message : error ? 'Failed to load agents' : null

  const agentOptions = useMemo(() => {
    if (!selectedAgentCache) return agents
    if (agents.some(agent => agent.id === selectedAgentCache.id)) return agents
    return [selectedAgentCache, ...agents]
  }, [agents, selectedAgentCache])

  const selectedAgent = useMemo(
    () => agentOptions.find(agent => agent.id === value.ownerId) ?? selectedAgentCache,
    [agentOptions, selectedAgentCache, value.ownerId],
  )

  const applyContactFromTarget = (
    agent: AgentUserOption | null,
    companyProfileId: string,
    profiles: any[] = companyProfiles,
  ) => {
    const profile = Array.isArray(profiles)
      ? profiles.find((item: any) => item?.id === companyProfileId)
      : null

    const contactName =
      profile?.contact_name ||
      `${agent?.firstName ?? ''} ${agent?.lastName ?? ''}`.trim() ||
      ''
    const contactPhone = profile?.contact_phone || agent?.phoneNumber || ''
    const contactEmail = profile?.contact_email || agent?.email || ''

    if (contactName) formik.setFieldValue('contactName', contactName)
    if (contactPhone) formik.setFieldValue('contactNumber', contactPhone)
    if (contactEmail) formik.setFieldValue('contactEmail', contactEmail)
  }

  const handleAgentSelect = (agent: AgentUserOption) => {
    setSelectedAgentCache(agent)
    onChange({ ownerId: agent.id, agentId: '' })
    applyContactFromTarget(agent, '')
    setSearch('')
    setDebouncedSearch('')
    setIsAgentMenuOpen(false)
  }

  const handleClearAgent = () => {
    setSelectedAgentCache(null)
    onChange({ ownerId: '', agentId: '' })
    setSearch('')
    setDebouncedSearch('')
  }

  const handleCompanyChange = (agentId: string) => {
    onChange({ ...value, agentId })
    applyContactFromTarget(selectedAgent, agentId)
  }

  useEffect(() => {
    if (!value.ownerId || !value.agentId || !Array.isArray(companyProfiles) || companyProfiles.length === 0) {
      return
    }
    applyContactFromTarget(selectedAgent, value.agentId, companyProfiles)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyProfiles, value.agentId, value.ownerId])

  return (
    <div className="w-full mt-8 mb-5 p-6 bg-white shadow-md rounded-xl border border-amber-200 max-w-4xl mx-auto">
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Posting as (Admin)</h2>
        <p className="text-gray-600 text-sm mt-1">
          Select an agent account and optionally attach one of their company profiles.
        </p>
      </div>

      <div className="space-y-4">
        <div ref={agentMenuRef} className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Agent account <span className="text-red-500">*</span>
          </label>

          <button
            type="button"
            disabled={disabled}
            onClick={() => setIsAgentMenuOpen(open => !open)}
            className="w-full flex items-center justify-between gap-2 p-2 border rounded-md bg-white text-left focus:ring-2 focus:ring-[#2a1407]/30 focus:outline-none disabled:bg-gray-100"
          >
            <span className={selectedAgent ? 'text-gray-900 truncate' : 'text-gray-400 truncate'}>
              {selectedAgent ? formatAgentLabel(selectedAgent) : 'Select an agent'}
            </span>
            <span className="flex items-center gap-1 shrink-0">
              {selectedAgent && !disabled && (
                <span
                  role="button"
                  tabIndex={0}
                  aria-label="Clear selected agent"
                  className="p-0.5 rounded hover:bg-gray-100 text-gray-500"
                  onClick={e => {
                    e.stopPropagation()
                    handleClearAgent()
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      e.stopPropagation()
                      handleClearAgent()
                    }
                  }}
                >
                  <X size={14} />
                </span>
              )}
              <ChevronDown size={16} className={`text-gray-500 transition-transform ${isAgentMenuOpen ? 'rotate-180' : ''}`} />
            </span>
          </button>

          {isAgentMenuOpen && !disabled && (
            <div className="absolute z-30 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg overflow-hidden">
              <div className="p-2 border-b border-gray-100">
                <div className="relative">
                  <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by name, email, or phone"
                    className="w-full pl-8 pr-2 py-2 text-sm border rounded-md focus:ring-2 focus:ring-[#2a1407]/30 focus:outline-none"
                  />
                </div>
              </div>

              <div className="max-h-56 overflow-y-auto">
                {isLoadingAgents && <p className="px-3 py-2 text-xs text-gray-500">Loading agents...</p>}
                {agentsError && <p className="px-3 py-2 text-xs text-red-600">{agentsError}</p>}
                {!isLoadingAgents && !agentsError && agentOptions.length === 0 && (
                  <p className="px-3 py-2 text-xs text-gray-500">No agents found.</p>
                )}
                {!isLoadingAgents &&
                  agentOptions.map(agent => {
                    const isSelected = agent.id === value.ownerId
                    return (
                      <button
                        key={agent.id}
                        type="button"
                        onClick={() => handleAgentSelect(agent)}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-amber-50 transition-colors ${
                          isSelected ? 'bg-amber-50 text-[#2a1407] font-semibold' : 'text-gray-800'
                        }`}
                      >
                        {formatAgentLabel(agent)}
                      </button>
                    )
                  })}
              </div>
            </div>
          )}

          {!value.ownerId && !isLoadingAgents && (
            <p className="text-xs text-amber-700 mt-1">Required before creating the property.</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Company profile <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <select
            value={value.agentId}
            onChange={e => handleCompanyChange(e.target.value)}
            disabled={disabled || !value.ownerId || isLoadingProfiles}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#2a1407]/30 focus:outline-none disabled:bg-gray-100"
          >
            <option value="">No company / personal listing</option>
            {(Array.isArray(companyProfiles) ? companyProfiles : []).map((profile: any) => (
              <option key={profile.id} value={profile.id}>
                {profile.companyName || profile.profileName || profile.id}
              </option>
            ))}
          </select>
          {value.ownerId && isLoadingProfiles && (
            <p className="text-xs text-gray-500 mt-1">Loading company profiles...</p>
          )}
          {value.ownerId && profilesError && (
            <p className="text-xs text-red-600 mt-1">
              {profilesError instanceof Error ? profilesError.message : 'Failed to load company profiles'}
            </p>
          )}
          {value.ownerId && !isLoadingProfiles && !profilesError && Array.isArray(companyProfiles) && companyProfiles.length === 0 && (
            <p className="text-xs text-gray-500 mt-1">This agent has no company profiles.</p>
          )}
        </div>
      </div>
    </div>
  )
}
