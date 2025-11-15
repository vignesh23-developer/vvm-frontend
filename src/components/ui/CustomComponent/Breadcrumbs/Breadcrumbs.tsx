'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'

type BreadcrumbsProps = {
  customLabels?: Record<string, string>
}

export default function Breadcrumbs({ customLabels = {} }: BreadcrumbsProps) {
  const segments = usePathname().split('/').filter(Boolean)
  if (!segments.length) return null

  return (
    <nav className="flex items-center text-sm text-gray-600">
      <Link href="/home" className="hover:text-gray-900">
        Home
      </Link>

      {segments.map((segment, i) => {
        const href = '/' + segments.slice(0, i + 1).join('/')
        const isLast = i === segments.length - 1
        const label = customLabels[segment] ?? decodeURIComponent(segment)

        return (
          <span key={href} className="flex items-center">
            <ChevronRight className="mx-2 w-4 h-4 text-gray-400" />
            {isLast ? (
              <span className="font-medium text-gray-900">{label}</span>
            ) : (
              <Link href={href} className="hover:text-gray-900">
                {label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
