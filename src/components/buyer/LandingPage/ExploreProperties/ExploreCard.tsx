'use client'

import Link from 'next/link'
import { motion, Variants } from 'framer-motion'
import { Building2, HatGlasses } from 'lucide-react'
import { ExplorePropertyDto } from './dto/explorePropertiesDto'
import { formatPrice } from '@/utils/converter/formatPrice'
import { CometCard } from '@/components/ui/comet-card'

interface ExploreCardProps {
  item: ExplorePropertyDto
  variants?: Variants
}

export default function ExploreCard({ item, variants }: ExploreCardProps) {
  const initialLetter = item.district?.toString().charAt(0).toUpperCase()
  const agentsCount = (item as any).createdByCount ?? (item as any).noOfAgents

  return (
    <motion.div variants={variants}>
      <Link href={`properties-list?location=${encodeURIComponent(item.district || '')}`} passHref>
        <CometCard className="h-full rounded-2xl bg-white/95 border border-yellow-200 shadow-md overflow-hidden cursor-pointer">
          <div className="flex flex-col h-full">
            {/* Top content */}
            <div className="p-6 pb-8 flex-1">
              <h3 className="text-lg font-semibold text-[#2a1407] mb-1 text-left">{item.district}</h3>
              <p className="text-xs font-medium uppercase tracking-wide text-yellow-700 mb-3 text-left">Price range</p>
              <p className="text-sm text-gray-700 mb-4 text-left">
                {formatPrice(item.minAmount)} - {formatPrice(item.maxAmount)}
              </p>

              <div className="space-y-2">
                <div className="flex gap-4">
                  <p className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-yellow-50 border border-yellow-200">
                      <Building2 size={14} className="text-yellow-700" />
                    </span>
                    <span>{item.count} properties</span>
                  </p>

                  <p className={`flex items-center gap-2 text-sm font-semibold text-gray-900 ${agentsCount > 0 ? '' : 'invisible'}`}>
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-yellow-50 border border-yellow-200">
                      <HatGlasses size={14} className="text-yellow-700" />
                    </span>
                    <span>{agentsCount > 0 ? `${agentsCount} agents` : '0 agents'}</span>
                  </p>
                </div>

                {Array.isArray(item.propertyCategories) && item.propertyCategories.length > 0 && (
                  <div className="pt-1 flex flex-wrap gap-2">
                    {item.propertyCategories.map((category, index) => (
                      <span
                        key={index}
                        className="inline-block bg-yellow-50 text-yellow-800 border border-yellow-200 text-[11px] font-medium px-3 py-1 rounded-full"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom badge strip with initial circle */}
            <div className="relative h-24 bg-gradient-to-r from-yellow-50 via-yellow-100 to-yellow-50 border-t border-yellow-100 flex items-end justify-center pb-4">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-[#3b1804] to-[#2a1407] shadow-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-yellow-200">{initialLetter}</span>
              </div>
            </div>
          </div>
        </CometCard>
      </Link>
    </motion.div>
  )
}
