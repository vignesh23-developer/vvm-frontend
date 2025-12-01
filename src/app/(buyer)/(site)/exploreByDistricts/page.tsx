'use client'

import ExploreCard from '@/components/buyer/LandingPage/ExploreProperties/ExploreCard'
import { useExploreProperties } from '@/components/buyer/LandingPage/ExploreProperties/hooks/useExploreProperties'
import { ExplorePropertyDto } from '@/components/buyer/LandingPage/ExploreProperties/dto/explorePropertiesDto'
import { motion, Variants } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { CircleDollarSign, Filter, Flame, MapPin, RefreshCw, Search, ShieldCheck, TrendingUp, UsersRound } from 'lucide-react'
import CustomLoader from '@/components/ui/CustomComponent/Loader/CustomLoader'

const PAGE_SIZE = 12

const dedupeByDistrict = (items: ExplorePropertyDto[] = []) => {
  const seen = new Set<number | string>()
  return items.filter(item => {
    const key = item?.district
    if (key === undefined || key === null) {
      return false
    }

    if (seen.has(key)) {
      return false
    }

    seen.add(key)
    return true
  })
}

const isSameDistrictOrder = (first: ExplorePropertyDto[], second: ExplorePropertyDto[]) => {
  if (first.length !== second.length) {
    return false
  }

  return first.every((item, index) => item.district === second[index]?.district)
}

const mergeDistricts = (existing: ExplorePropertyDto[], incoming: ExplorePropertyDto[]) => {
  const existingDistricts = new Set(existing.map(item => item.district))
  const newItems = incoming.filter(item => !existingDistricts.has(item.district))
  return newItems.length ? [...existing, ...newItems] : existing
}

function ExploreByDistrict() {
  const t = useTranslations()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'popular' | 'agents' | 'alphabetical'>('popular')
  const [quickFilter, setQuickFilter] = useState<QuickFilterId>('none')
  const [properties, setProperties] = useState<ExplorePropertyDto[]>([])
  const { items, total, isLoading, error } = useExploreProperties({ page, limit: PAGE_SIZE })

  const filteredItems = useMemo(() => {
    if (!Array.isArray(items)) {
      return []
    }

    return dedupeByDistrict(items)
  }, [items])

  useEffect(() => {
    if (page === 1) {
      setProperties(prev => (isSameDistrictOrder(prev, filteredItems) ? prev : filteredItems))
      return
    }

    if (!filteredItems.length) {
      return
    }

    setProperties(prev => mergeDistricts(prev, filteredItems))
  }, [filteredItems, page])

  const canLoadMore = total ? properties.length < total : filteredItems.length === PAGE_SIZE
  const hasProperties = properties.length > 0

  const sortedProperties = useMemo(() => {
    const next = [...properties]

    switch (sortBy) {
      case 'agents':
        return next.sort((a, b) => (b.createdByCount ?? 0) - (a.createdByCount ?? 0))
      case 'alphabetical':
        return next.sort((a, b) => String(a.district).localeCompare(String(b.district)))
      default:
        return next.sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
    }
  }, [properties, sortBy])

  const visibleProperties = useMemo(() => {
    const baseList = !search.trim()
      ? sortedProperties
      : sortedProperties.filter(item => String(item.district).toLowerCase().includes(search.toLowerCase()))

    const selectedFilter = quickFilterOptions.find(option => option.id === quickFilter)
    if (!selectedFilter || quickFilter === 'none') {
      return baseList
    }

    return baseList.filter(item => selectedFilter.predicate(item))
  }, [sortedProperties, search, quickFilter])

  const highlight = useMemo(() => {
    if (!properties.length) {
      return null
    }

    return properties.reduce((prev, curr) => ((curr.count ?? 0) > (prev.count ?? 0) ? curr : prev))
  }, [properties])

  const totalProperties = useMemo(() => properties.reduce((sum, item) => sum + (item.count ?? 0), 0), [properties])
  const totalAgents = useMemo(() => properties.reduce((sum, item) => sum + (item.createdByCount ?? 0), 0), [properties])
  const budgetRange = useMemo(() => {
    if (!properties.length) {
      return { min: 0, max: 0 }
    }

    const mins = properties.map(item => item.minAmount ?? 0)
    const maxs = properties.map(item => item.maxAmount ?? 0)
    return {
      min: Math.min(...mins),
      max: Math.max(...maxs),
    }
  }, [properties])
  const trendingDistricts = useMemo(() => {
    if (!properties.length) {
      return []
    }

    return [...properties].sort((a, b) => (b.count ?? 0) - (a.count ?? 0)).slice(0, 4)
  }, [properties])
  const maxInventory = trendingDistricts[0]?.count ?? 0
  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  }

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 80, damping: 12 },
    },
    hover: { scale: 1.05, boxShadow: '0 8px 25px rgba(0,0,0,0.1)' },
  }

  if (isLoading && page === 1) {
    return <CustomLoader text="Loading Explore Districts..." />
  }

  if (error) {
    return <p className="text-center text-red-600">Unable to load districts right now. Please try again later.</p>
  }

  return (
    <div className="mt-10 space-y-10">
      <section className="rounded-3xl bg-gradient-to-br from-primary/10 via-white to-primary/5 p-8 shadow-sm">
        <div className="mx-auto max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              <MapPin size={16} /> Discover districts
            </p>
            <h1 className="mt-3 text-3xl font-extrabold text-gray-900 md:text-5xl">{t('ExploreProperties.title')}</h1>
            <p className="mt-4 max-w-3xl text-base text-gray-600 md:text-lg">
              Browse every Tamil Nadu district, compare price bands, and jump straight into the neighborhoods delivering the highest demand today.
            </p>
          </motion.div>

          {/* <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            <StatPill icon={<MapPin size={18} />} label="Active districts" value={properties.length.toLocaleString()} />
            <StatPill icon={<TrendingUp size={18} />} label="Total listings" value={totalProperties.toLocaleString()} />
            <StatPill icon={<UsersRound size={18} />} label="Verified agents" value={totalAgents.toLocaleString()} />
            <StatPill
              icon={<CircleDollarSign size={18} />}
              label="Budget band"
              value={`₹${budgetRange.min.toLocaleString()} - ₹${budgetRange.max.toLocaleString()}`}
            />
          </div> */}

          {/* {highlight && (
            <motion.div
              className="mt-8 grid gap-4 md:grid-cols-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="rounded-3xl border border-primary/20 bg-white/80 p-5 shadow-sm md:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Hot right now</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{highlight.district}</p>
                <p className="text-sm text-gray-600">
                  {highlight.count} properties · {highlight.createdByCount} agents
                </p>
                <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-500">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">
                    <Flame size={14} /> Top demand
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1">
                    Min ₹{(highlight.minAmount ?? 0).toLocaleString()}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1">
                    Max ₹{(highlight.maxAmount ?? 0).toLocaleString()}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-3xl border border-primary bg-white px-5 py-4 text-sm font-semibold text-primary shadow-sm transition hover:bg-primary/10"
                onClick={() => {
                  setSearch(String(highlight.district))
                  setQuickFilter('none')
                }}
              >
                Spotlight this district
                <TrendingUp size={16} />
              </button>
            </motion.div>
          )} */}
        </div>
      </section>

      {/* {hasProperties && (
        <section className="mx-auto max-w-6xl px-4">
          <motion.div
            className="grid gap-6 md:grid-cols-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <TrendingUp size={18} className="text-primary" /> Market pulse
              </div>
              <p className="mt-1 text-sm text-gray-500">Top districts ordered by active inventory</p>
              <div className="mt-4 space-y-3">
                {trendingDistricts.map((district, index) => (
                  <TrendRow
                    key={`trend-${district.district}`}
                    rank={index + 1}
                    district={district.district}
                    count={district.count ?? 0}
                    agents={district.createdByCount ?? 0}
                    maxCount={maxInventory}
                  />
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <ShieldCheck size={18} className="text-primary" /> Curated insights
              </div>
              <p className="mt-1 text-sm text-gray-500">Use quick filters to jump into tailored shortlists.</p>
              <div className="mt-5 grid gap-3">
                {quickFilterOptions.map(option => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setQuickFilter(option.id)}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                      quickFilter === option.id ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 text-gray-600 hover:border-primary/40'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-semibold">{option.label}</p>
                      <p className="text-xs text-gray-500">{option.helper}</p>
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em]">Apply</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </section>
      )} */}

      <section className="mx-auto max-w-6xl space-y-8 px-4">
        <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Search by district name"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:bg-white"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {sortOptions.map(option => (
              <button
                key={option.id}
                type="button"
                onClick={() => setSortBy(option.id)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  sortBy === option.id ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200 text-gray-600 hover:border-primary/40'
                }`}
              >
                {option.icon}
                {option.label}
              </button>
            ))}

            {hasProperties && (
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  setSortBy('popular')
                  setQuickFilter('none')
                  setPage(1)
                }}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:border-primary/40"
              >
                <RefreshCw size={16} /> Reset view
              </button>
            )}
          </div>
        </div>

        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 mb-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {hasProperties && visibleProperties.length ? (
            visibleProperties.map((p: ExplorePropertyDto) => <ExploreCard key={`district-${p.district}`} item={p} variants={cardVariants} />)
          ) : (
            <div className="col-span-full rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
              {search ? 'No districts match your search. Try another name.' : 'No districts to explore yet.'}
            </div>
          )}
        </motion.div>

        {hasProperties && canLoadMore && (
          <div className="flex justify-center">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-primary px-6 py-3 text-sm font-semibold text-primary transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={() => setPage(prev => prev + 1)}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Load more districts'}
            </button>
          </div>
        )}
      </section>
    </div>
  )
}

const sortOptions: { id: 'popular' | 'agents' | 'alphabetical'; label: string; icon: ReactNode }[] = [
  { id: 'popular', label: 'Most properties', icon: <TrendingUp size={16} /> },
  { id: 'agents', label: 'Most agents', icon: <UsersRound size={16} /> },
  { id: 'alphabetical', label: 'A-Z', icon: <Filter size={16} /> },
]

type QuickFilterId = 'none' | 'budget' | 'premium' | 'agentHeavy'

interface QuickFilterOption {
  id: QuickFilterId
  label: string
  helper: string
  predicate: (item: ExplorePropertyDto) => boolean
}

const quickFilterOptions: QuickFilterOption[] = [
  {
    id: 'none',
    label: 'Show all districts',
    helper: 'Full view of every location',
    predicate: () => true,
  },
  {
    id: 'budget',
    label: 'Budget friendly (< ₹25L)',
    helper: 'Ideal for first-time buyers',
    predicate: item => (item.minAmount ?? 0) <= 2_500_000,
  },
  {
    id: 'premium',
    label: 'Premium hubs (> ₹1Cr)',
    helper: 'High appreciation corridors',
    predicate: item => (item.maxAmount ?? 0) >= 10_000_000,
  },
  {
    id: 'agentHeavy',
    label: 'Agent-heavy districts',
    helper: '25+ verified agents active',
    predicate: item => (item.createdByCount ?? 0) >= 25,
  },
]

interface StatPillProps {
  icon: ReactNode
  label: string
  value: string
}

const StatPill = ({ icon, label, value }: StatPillProps) => (
  <div className="rounded-2xl border border-white/50 bg-white/80 px-4 py-3 shadow-sm">
    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
      {icon}
      {label}
    </div>
    <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
  </div>
)

interface TrendRowProps {
  rank: number
  district: string | number
  count: number
  agents: number
  maxCount: number
}

const TrendRow = ({ rank, district, count, agents, maxCount }: TrendRowProps) => {
  const width = maxCount ? Math.round((count / maxCount) * 100) : 0

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-400">#{rank}</p>
          <p className="text-lg font-bold text-gray-900">{district}</p>
          <p className="text-xs text-gray-500">{agents} agents active</p>
        </div>
        <p className="text-sm font-semibold text-primary">{count} listings</p>
      </div>
      <div className="mt-2 h-2 rounded-full bg-gray-100">
        <div className="h-full rounded-full bg-primary" style={{ width: `${width}%` }} />
      </div>
    </div>
  )
}

export default ExploreByDistrict
