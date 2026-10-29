
'use client'

import { Crown, Gauge, Sparkles } from 'lucide-react'
import type { UserSubscription } from '@/types/subscription'

type UsageRow = {
  label: string
  used: number
  limit: number | null
}

type PlanTone = 'free' | 'basic' | 'standard' | 'premium'

const PLAN_TONE_CLASSES: Record<PlanTone, string> = {
  premium: 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white',
  standard:
    'border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 text-[#2a1407]',
  basic:
    'border border-yellow-200 bg-gradient-to-r from-yellow-50 to-yellow-100 text-[#2a1407]',
  free: 'border border-gray-200 bg-gray-100 text-gray-700',
}

function formatLimit(limit: number | null): string {
  return limit === null ? 'Unlimited' : limit.toLocaleString()
}

function clampPct(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.max(0, Math.min(100, value))
}

function getPlanLabel(subscription: UserSubscription | null): {
  name: string
  tone: PlanTone
} {
  if (!subscription?.isActive) {
    return { name: 'Free', tone: 'free' }
  }

  const name = subscription.plan?.name || 'Active Plan'
  const normalized = name.toUpperCase()

  if (
    normalized.includes('PREMIUM') ||
    normalized.includes('PRO') ||
    normalized.includes('GOLD')
  ) {
    return { name, tone: 'premium' }
  }

  if (normalized.includes('STANDARD') || normalized.includes('PLUS')) {
    return { name, tone: 'standard' }
  }

  return { name, tone: 'basic' }
}

function pickLimitFromPlan(
  subscription: UserSubscription | null,
  keywords: string[],
): number | null {
  const items = subscription?.plan?.planItems ?? []

  for (const planItem of items) {
    const itemName = (planItem.item?.name ?? '').toLowerCase()

    if (!keywords.some(keyword => itemName.includes(keyword))) {
      continue
    }

    if (planItem.isUnlimited) return null

    const limit = Number(planItem.numericValue)

    if (Number.isFinite(limit) && limit >= 0) {
      return limit
    }
  }

  return null
}

function pickUsedFromUsages(
  subscription: UserSubscription | null,
  keywords: string[],
): number {
  const usages = subscription?.usages ?? []

  for (const usage of usages) {
    const itemName = (usage.item?.name ?? '').toLowerCase()

    if (!keywords.some(keyword => itemName.includes(keyword))) {
      continue
    }

    const used = Number(usage.usedCount ?? usage.usedValue ?? 0)

    if (Number.isFinite(used)) {
      return Math.max(0, used)
    }
  }

  return 0
}

function getUsagePercentage(used: number, limit: number | null): number {
  if (limit === null) return 0
  if (limit <= 0) return used > 0 ? 100 : 0

  return clampPct((used / limit) * 100)
}

function createUsageRows(subscription: UserSubscription | null): UsageRow[] {
  const definitions = [
    {
      label: 'Properties',
      keywords: ['property', 'properties', 'listing'],
    },
    {
      label: 'Ads',
      keywords: ['ad', 'ads'],
    },
  ]

  return definitions.map(({ label, keywords }) => ({
    label,
    used: pickUsedFromUsages(subscription, keywords),
    limit: pickLimitFromPlan(subscription, keywords),
  }))
}

export default function PlanUsageWidget({
  subscription,
}: {
  subscription: UserSubscription | null
}) {
  const plan = getPlanLabel(subscription)
  const rows = createUsageRows(subscription)

  return (
    <section className="rounded-2xl border border-yellow-200 bg-gradient-to-br from-white to-yellow-50/30 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Your plan
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className={[
                'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-extrabold shadow-sm',
                PLAN_TONE_CLASSES[plan.tone],
              ].join(' ')}
            >
              <Crown size={14} aria-hidden="true" />
              {plan.name}
            </span>

            {subscription?.isActive && (
              <span className="inline-flex items-center gap-1 rounded-full border border-yellow-100 bg-white px-3 py-1 text-xs font-semibold text-gray-600">
                <Sparkles
                  size={14}
                  className="text-yellow-600"
                  aria-hidden="true"
                />
                Active
              </span>
            )}
          </div>
        </div>

        <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF8E8] text-yellow-700 ring-1 ring-yellow-100">
          <Gauge size={18} aria-hidden="true" />
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {rows.map(row => {
          const percentage = getUsagePercentage(row.used, row.limit)
          const isOver =
            row.limit !== null && row.used >= row.limit

          return (
            <div
              key={row.label}
              className="rounded-xl border border-yellow-100 bg-white/70 p-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-bold text-[#2a1407]">
                  {row.label}
                </div>

                <div className="text-xs font-semibold text-gray-600">
                  <span className={isOver ? 'text-red-700' : ''}>
                    {row.used.toLocaleString()}
                  </span>
                  {' / '}
                  {formatLimit(row.limit)}
                </div>
              </div>

              <div
                className="mt-2 h-2 w-full overflow-hidden rounded-full border border-yellow-100 bg-yellow-50"
                role="progressbar"
                aria-label={`${row.label} usage`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percentage}
              >
                <div
                  className={[
                    'h-full rounded-full transition-all',
                    isOver
                      ? 'bg-red-500'
                      : 'bg-gradient-to-r from-yellow-400 to-yellow-600',
                  ].join(' ')}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {isOver && (
                <div className="mt-2 text-xs font-semibold text-red-700">
                  Limit reached
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

