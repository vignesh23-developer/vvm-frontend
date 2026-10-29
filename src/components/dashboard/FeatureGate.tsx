
'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { Lock } from 'lucide-react'

type FeatureGateProps = {
  locked: boolean
  title?: string
  description?: string
  upgradeHref?: string
  children: ReactNode
  className?: string
}

export default function FeatureGate({
  locked,
  title = 'Upgrade required',
  description = 'This feature is not available on your current plan.',
  upgradeHref = '/pricing',
  children,
  className = '',
}: FeatureGateProps) {
  return (
    <div className={['relative', className].filter(Boolean).join(' ')}>
      <div
        className={
          locked
            ? 'pointer-events-none select-none opacity-50 grayscale'
            : ''
        }
        aria-disabled={locked}
        inert={locked}
      >
        {children}
      </div>

      {locked && (
        <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
          <div
            role="group"
            aria-label={title}
            className="w-full max-w-sm rounded-2xl border border-yellow-200 bg-white/90 p-4 shadow-lg backdrop-blur"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-yellow-200 bg-yellow-50 text-yellow-700">
                <Lock size={18} aria-hidden="true" />
              </div>

              <div className="min-w-0">
                <div className="font-extrabold leading-tight text-[#2a1407]">
                  {title}
                </div>

                <p className="mt-1 text-sm leading-snug text-gray-600">
                  {description}
                </p>

                <div className="mt-3">
                  <Link
                    href={upgradeHref}
                    className="inline-flex items-center justify-center rounded-xl bg-[#2a1407] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#3b1804] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
                  >
                    Upgrade plan
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

