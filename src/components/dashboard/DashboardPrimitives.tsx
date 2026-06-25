'use client'

import type { ReactNode } from 'react'

/** Page shell — matches `(seller)/dashboard` */
export const dashboardPageClass =
  'p-4 sm:p-6 space-y-6 bg-gradient-to-br from-yellow-50 via-white to-yellow-50 min-h-screen'

type IconComponent = React.ComponentType<{ size?: number; className?: string }>

/** Top stat cards — matches seller `StatsCard` */
export function DashboardStatCard({
  label,
  value,
}: {
  label: string
  value: string | number
  Icon?: IconComponent
}) {
  const display =
    typeof value === 'number' ? value.toLocaleString() : value

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-yellow-200 bg-gradient-to-br from-white to-yellow-50/30 p-4 text-center shadow-sm">
      <h2 className="text-xl font-bold text-[#2a1407] sm:text-2xl">{display}</h2>
      <p className="mt-1 text-sm text-gray-600">{label}</p>
    </div>
  )
}

/** Widget panel — `default` = table block, `chart` = sidebar charts */
export function DashboardPanel({
  children,
  className = '',
  variant = 'default',
}: {
  children: ReactNode
  className?: string
  variant?: 'default' | 'chart'
}) {
  const radius = variant === 'chart' ? 'rounded-2xl' : 'rounded-lg'
  return (
    <div
      className={[
        radius,
        'border border-yellow-200 bg-gradient-to-br from-white to-yellow-50/20 p-4 shadow-sm sm:p-6',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}

export function DashboardPanelHeader({
  title,
  subtitle,
  action,
  icon: Icon,
  className = 'mb-4',
}: {
  title: string
  subtitle?: string
  action?: ReactNode
  icon?: IconComponent
  className?: string
}) {
  return (
    <div className={['flex flex-wrap items-start justify-between gap-3', className].join(' ')}>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          {Icon ? <Icon size={18} className="shrink-0 text-yellow-700" /> : null}
          <h2 className="text-lg font-semibold text-[#2a1407]">{title}</h2>
        </div>
        {subtitle ? <p className="mt-1 text-sm text-gray-600">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

/** Inner metric — matches `PlanUsageWidget` row tiles */
export function DashboardMetricTile({
  label,
  value,
  className = '',
}: {
  label: string
  value: string | number
  className?: string
}) {
  const display =
    typeof value === 'number' ? value.toLocaleString() : value

  return (
    <div className={['rounded-xl border border-yellow-100 bg-white/70 p-3', className].join(' ')}>
      <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 line-clamp-2">{label}</div>
      <div className="mt-1.5 text-lg font-bold text-[#2a1407] sm:text-xl">{display}</div>
    </div>
  )
}

export type DashboardSegmentOption<T extends string> = {
  value: T
  label: string
  disabled?: boolean
}

export function DashboardSegmentedControl<T extends string>({
  value,
  options,
  onChange,
  className = '',
}: {
  value: T
  options: DashboardSegmentOption<T>[]
  onChange: (value: T) => void
  className?: string
}) {
  return (
    <div className={['inline-flex w-full rounded-xl border border-yellow-200 bg-white/70 p-1', className].join(' ')}>
      {options.map(option => {
        const isActive = value === option.value
        return (
          <button
            key={option.value}
            type="button"
            disabled={option.disabled}
            onClick={() => onChange(option.value)}
            className={[
              'flex-1 rounded-lg px-2.5 py-2 text-xs font-medium transition sm:text-sm',
              isActive ? 'bg-yellow-100 text-[#2a1407]' : 'text-gray-700 hover:bg-yellow-50',
              option.disabled ? 'cursor-not-allowed opacity-50' : '',
            ].join(' ')}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

export function DashboardChartFrame({ children }: { children: ReactNode }) {
  return <div className="mt-4 h-48 w-full sm:h-52 md:h-60">{children}</div>
}

export function DashboardEmptyState({ children }: { children: ReactNode }) {
  return <div className="mt-4 text-sm text-gray-600">{children}</div>
}

export function DashboardSkeleton({ className }: { className?: string }) {
  return <div className={'animate-pulse rounded-lg bg-yellow-100/70 ' + (className ?? '')} />
}
