'use client'
import { useTranslations } from 'next-intl'

interface Stat {
  value: string | number
  label: string
}

interface StatsProps {
  stats: Stat[]
}

export default function Stats({ stats }: StatsProps) {
  const t = useTranslations()

  return (
    <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="flex flex-col justify-between rounded-2xl bg-white/90 px-3 py-3 sm:px-4 sm:py-4 shadow-sm ring-1 ring-gray-100"
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-lg sm:text-2xl font-extrabold text-gray-900">{stat.value}</p>
            <span className="h-2 w-2 rounded-full bg-yellow-500/90" />
          </div>
          <p className="mt-2 text-[11px] sm:text-xs font-medium text-gray-700 whitespace-pre-line leading-snug">
            {t(`PropertiesListCard.${stat.label}`)}
          </p>
        </div>
      ))}
    </div>
  )
}
