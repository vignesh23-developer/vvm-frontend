'use client'

import Link from 'next/link'
import { Lock } from 'lucide-react'

type FeatureGateProps = {
  locked: boolean
  title?: string
  description?: string
  upgradeHref?: string
  children: React.ReactNode
  className?: string
}

export default function FeatureGate({
  locked,
  title = 'Upgrade required',
  description = 'This feature is not available on your current plan.',
  upgradeHref = '/pricing',
  children,
  className,
}: FeatureGateProps) {
  return (
    <div className={['relative', className].filter(Boolean).join(' ')}>
      <div className={locked ? 'pointer-events-none select-none opacity-50 grayscale' : ''}>{children}</div>

      {locked && (
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl border border-yellow-200 bg-white/90 backdrop-blur shadow-lg p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-700">
                <Lock size={18} />
              </div>
              <div className="min-w-0">
                <div className="font-extrabold text-[#2a1407] leading-tight">{title}</div>
                <div className="mt-1 text-sm text-gray-600 leading-snug">{description}</div>
                <div className="mt-3">
                  <Link
                    href={upgradeHref}
                    className="inline-flex items-center justify-center rounded-xl bg-[#2a1407] px-4 py-2 text-sm font-bold text-white hover:bg-[#3b1804] transition-colors"
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

