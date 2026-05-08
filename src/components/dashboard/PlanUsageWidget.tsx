'use client'

import { Crown, Gauge, Sparkles } from 'lucide-react'
import { UserSubscription } from '@/types/subscription'

type UsageRow = {
  label: string
  used: number
  limit: number | null
  unit?: string
}

function formatLimit(limit: number | null) {
  if (limit === null) return 'Unlimited'
  return limit.toLocaleString()
}

function clampPct(pct: number) {
  if (!Number.isFinite(pct)) return 0
  return Math.max(0, Math.min(100, pct))
}

function getPlanLabel(sub: UserSubscription | null) {
  if (!sub?.isActive) return { name: 'Free', tone: 'free' as const }
  const name = sub.plan?.name || 'Active Plan'
  const n = name.toUpperCase()
  if (n.includes('PREMIUM') || n.includes('PRO') || n.includes('GOLD')) return { name, tone: 'premium' as const }
  if (n.includes('STANDARD') || n.includes('PLUS')) return { name, tone: 'standard' as const }
  return { name, tone: 'basic' as const }
}

function pickLimitFromPlan(sub: UserSubscription | null, keywords: string[]): number | null {
  const items = sub?.plan?.planItems ?? []
  for (const pi of items) {
    const itemName = (pi.item?.name || '').toLowerCase()
    if (keywords.some(k => itemName.includes(k))) {
      if (pi.isUnlimited) return null
      const v = Number(pi.numericValue)
      if (Number.isFinite(v) && v > 0) return v
    }
  }
  return null
}

function pickUsedFromUsages(sub: UserSubscription | null, keywords: string[]): number {
  const usages = sub?.usages ?? []
  for (const u of usages) {
    const itemName = (u.item?.name || '').toLowerCase()
    if (keywords.some(k => itemName.includes(k))) {
      const used = Number(u.usedCount ?? u.usedValue ?? 0)
      if (Number.isFinite(used)) return used
    }
  }
  return 0
}

export default function PlanUsageWidget({ subscription }: { subscription: UserSubscription | null }) {
  const plan = getPlanLabel(subscription)

  const rows: UsageRow[] = [
    {
      label: 'Properties',
      used: pickUsedFromUsages(subscription, ['property', 'properties', 'listing']),
      limit: pickLimitFromPlan(subscription, ['property', 'properties', 'listing']),
      unit: '',
    },
    {
      label: 'Ads',
      used: pickUsedFromUsages(subscription, ['ad', 'ads']),
      limit: pickLimitFromPlan(subscription, ['ad', 'ads']),
      unit: '',
    },
  ]

  const toneClasses =
    plan.tone === 'premium'
      ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white'
      : plan.tone === 'standard'
        ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-[#2a1407] border border-yellow-300'
        : plan.tone === 'basic'
          ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 text-[#2a1407] border border-yellow-200'
          : 'bg-gray-100 text-gray-700 border border-gray-200'

  return (
    <div className="rounded-2xl border border-yellow-200 bg-gradient-to-br from-white to-yellow-50/30 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">Your plan</div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className={['inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-extrabold shadow-sm', toneClasses].join(' ')}>
              <Crown size={14} />
              {plan.name}
            </span>
            {subscription?.isActive && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-600 border border-yellow-100">
                <Sparkles size={14} className="text-yellow-600" />
                Active
              </span>
            )}
          </div>
        </div>

        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF8E8] text-yellow-700 ring-1 ring-yellow-100">
          <Gauge size={18} />
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {rows.map(row => {
          const pct =
            row.limit === null ? 12 : row.limit <= 0 ? 0 : clampPct((row.used / row.limit) * 100)
          const isOver = row.limit !== null && row.limit > 0 && row.used >= row.limit

          return (
            <div key={row.label} className="rounded-xl border border-yellow-100 bg-white/70 p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-bold text-[#2a1407]">{row.label}</div>
                <div className="text-xs font-semibold text-gray-600">
                  <span className={isOver ? 'text-red-700' : ''}>{row.used.toLocaleString()}</span> / {formatLimit(row.limit)}
                </div>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-yellow-50 border border-yellow-100">
                <div
                  className={[
                    'h-full rounded-full transition-all',
                    isOver ? 'bg-red-500' : 'bg-gradient-to-r from-yellow-400 to-yellow-600',
                  ].join(' ')}
                  style={{ width: `${pct}%` }}
                />
              </div>
              {isOver && <div className="mt-2 text-xs font-semibold text-red-700">Limit reached</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

