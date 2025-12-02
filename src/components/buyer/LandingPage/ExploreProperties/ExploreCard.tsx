'use client'

import Link from 'next/link'
import { motion, Variants } from 'framer-motion'
import { Building2, HatGlasses } from 'lucide-react'
import { ExplorePropertyDto } from './dto/explorePropertiesDto'
import { formatPrice } from '@/utils/converter/formatPrice'

interface ExploreCardProps {
  item: ExplorePropertyDto
  variants?: Variants
}

export default function ExploreCard({ item, variants }: ExploreCardProps) {
  return (
    <motion.div variants={variants} whileHover="hover" className="bg-white rounded-2xl shadow-md transition overflow-hidden flex flex-col">
      <div className="p-6 flex-1">
        <h3 className="text-lg text-start font-semibold text-gray-900 mb-2">{item.district}</h3>
        <p className="text-sm text-start text-gray-600 mb-3">
          {formatPrice(item.minAmount)} - {formatPrice(item.maxAmount)}
        </p>

        <p className="flex items-center gap-2 font-semibold text-gray-800 mb-3">
          <Building2 size={18} className="text-gray-600" />
          {item.count} Properties
        </p>

        <Link href={`/properties_list/agency`}>
          <p className="flex items-center gap-2 font-semibold text-gray-800 mb-3">
            <HatGlasses size={18} className="text-gray-600" />
            {item.createdByCount} Agents
          </p>
        </Link>
      </div>

      <div className="h-[120px] bg-[#B0BEC5] shadow-md relative flex flex-col items-start justify-end">
        <div
          className="absolute -top-6 right-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full shadow-md 
                  bg-[#FFE0B2] flex items-center justify-center"
        >
          <span className="text-3xl font-bold text-[#D84315]">{item.district?.toString().charAt(0).toUpperCase()}</span>
        </div>
      </div>
    </motion.div>
  )
}
