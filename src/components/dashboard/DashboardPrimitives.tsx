'use client'

import type { ReactNode, ComponentType } from 'react'

type IconComponent = ComponentType<{ size?: number; className?: string }>

const cn = (...classes: Array<string | undefined | false>) =>
  classes.filter(Boolean).join(' ')

const formatValue = (value: string | number): string =>
  typeof value === 'number' ? value.toLocaleString() : value

/** Shared dashboard page shell */
export const dashboardPageClass =
  'min-h-screen space-y-6 bg-gradient-to-br from-yellow-50 via-white to-yellow-50 p-4 sm:p-6'

/** Dashboard summary card */
export function DashboardStatCard({
  label,
  value,
}: {
  label: string
  value: string | number
  Icon?: IconComponent
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-yellow-200 bg-gradient-to-br from-white to-yellow-50/30 p-4 text-center shadow-sm">
      <h2 className="text-xl font-bold text-[#2a1407] sm:text-2xl">
        {formatValue(value)}
      </h2>
      <p className="mt-1 text-sm text-gray-600">{label}</p>
    </div>
  )
}

/** Reusable dashboard panel */
export function DashboardPanel({
  children,
  className = '',
  variant = 'default',
}: {
  children: ReactNode
  className?: string
  variant?: 'default' | 'chart'
}) {
  return (
    <div
      className={cn(
        variant === 'chart' ? 'rounded-2xl' : 'rounded-lg',
        'border border-yellow-200 bg-gradient-to-br from-white to-yellow-50/20 p-4 shadow-sm sm:p-6',
        className,
      )}
    >
      {children}
    </div>
  )
}

/** Panel title, subtitle, icon, and optional action */
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
    <div className={cn('flex flex-wrap items-start justify-between gap-3', className)}>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          {Icon && (
            <Icon size={18} className="shrink-0 text-yellow-700" />
          )}
          <h2 className="text-lg font-semibold text-[#2a1407]">
            {title}
          </h2>
        </div>

        {subtitle && (
          <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

/** Small dashboard metric */
export function DashboardMetricTile({
  label,
  value,
  className = '',
}: {
  label: string
  value: string | number
  className?: string
}) {
  return (
    <div className={cn('rounded-xl border border-yellow-100 bg-white/70 p-3', className)}>
      <div className="line-clamp-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </div>
      <div className="mt-1.5 text-lg font-bold text-[#2a1407] sm:text-xl">
        {formatValue(value)}
      </div>
    </div>
  )
}

export type DashboardSegmentOption<T extends string> = {
  value: T
  label: string
  disabled?: boolean
}

/** Reusable segmented control */
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
    <div
      className={cn(
        'inline-flex w-full rounded-xl border border-yellow-200 bg-white/70 p-1',
        className,
      )}
      role="group"
    >
      {options.map(({ value: optionValue, label, disabled }) => {
        const isActive = value === optionValue

        return (
          <button
            key={optionValue}
            type="button"
            disabled={disabled}
            aria-pressed={isActive}
            onClick={() => onChange(optionValue)}
            className={cn(
              'flex-1 rounded-lg px-2.5 py-2 text-xs font-medium transition sm:text-sm',
              isActive
                ? 'bg-yellow-100 text-[#2a1407]'
                : 'text-gray-700 hover:bg-yellow-50',
              disabled && 'cursor-not-allowed opacity-50',
            )}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

/** Fixed-height chart container */
export function DashboardChartFrame({ children }: { children: ReactNode }) {
  return <div className="mt-4 h-48 w-full sm:h-52 md:h-60">{children}</div>
}

/** Empty or informational dashboard state */
export function DashboardEmptyState({ children }: { children: ReactNode }) {
  return <div className="mt-4 text-sm text-gray-600">{children}</div>
}

/** Loading placeholder */
export function DashboardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-pulse rounded-lg bg-yellow-100/70', className)}
    />
  )
}