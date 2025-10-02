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
    <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-6 py-2">
      {stats.map((stat, i) => (
        <div
          key={i}
          className={`text-center sm:text-left ${
            i !== stats.length - 1 ? 'border-r pr-3' : ''
          }`}
        >
          <p className="text-2xl font-bold">{stat.value}</p>
          <p className="text-xs font-medium text-gray-700 whitespace-pre-line">
            {t(`PropertiesListCard.${stat.label}`)}
          </p>
        </div>
      ))}
    </div>
  )
}
