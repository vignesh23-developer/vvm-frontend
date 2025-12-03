'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Heart, Share, MapPin } from 'lucide-react'
import Stats from '../../Stats/Stats'
import Image from 'next/image'
import Button from '@/components/ui/CustomComponent/Button/Button'
import AgentCompanyProfile from '@/components/buyer/PropertiesListing/dto/agentCompanyProfile'

interface AgentCardProps extends AgentCompanyProfile {
  isFiltersOpen?: boolean
}

export default function AgentCard(props: AgentCardProps) {
  const {
    id,
    profileName,
    companyName,
    companyLogo,
    companyLogoKey,
    contact_name,
    contact_phone,
    contact_email,
    address_line,
    city,
    district,
    state,
    country,
    description,
    language,
    handleFavorite,
    handleShare,
    isFiltersOpen = false,
  } = props

  const stats = [
    { value: '40', label: 'properties_for_sale' },
    { value: '15', label: 'properties_for_rent' },
    { value: '2500', label: 'deals_closed' },
    { value: '5', label: 'team_members' },
  ]
  const router = useRouter()

  const [liked, setLiked] = useState(false)

  const handleViewDetails = () => {
    router.push(`/agent-profile/${profileName}`)
  }

  return (
    <motion.div
      className={`flex w-full flex-col overflow-hidden rounded-2xl bg-white/95 shadow-md ring-1 ring-gray-100 hover:shadow-xl hover:ring-yellow-200 transition-shadow duration-300 ${
        isFiltersOpen ? 'flex-col' : 'xl:flex-row'
      }`}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ scale: 1.01 }}
    >
      {/* Left & Middle: Image + Info */}
      <div className="flex-1">
        <div className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row">
          {/* Image + Agent Name */}
          <motion.div
            className="flex flex-col items-center sm:items-start rounded-2xl bg-gradient-to-b from-[#FFF8E8] via-[#FFFDF4] to-white shadow-sm border border-yellow-100/70 px-4 pt-4 pb-3 sm:px-5 sm:pt-5 sm:pb-4"
            whileHover={{ scale: 1.015 }}
            transition={{ duration: 0.25 }}
          >
            <div className="relative mb-3">
              <div className="absolute inset-0 rounded-[32px] bg-yellow-500/10 blur-xl" />
              <div className="relative overflow-hidden rounded-[32px] border border-yellow-100 shadow-md">
                <Image
                  src={companyLogo || '/agent.png'}
                  alt={companyName}
                  width={260}
                  height={180}
                  className="h-40 w-56 sm:w-64 object-cover"
                />
              </div>
            </div>

            <div className="w-full space-y-1 text-center sm:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-yellow-700">
                {language('PropertiesListCard.agent_name')}
              </p>
              <p className="text-sm sm:text-base font-bold text-gray-900">{contact_name}</p>

              <div className="mt-1 flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                {district && (
                  <span className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-gray-700 shadow-sm border border-yellow-100">
                    <span className="mr-1 h-1.5 w-1.5 rounded-full bg-green-500" />
                    {district}
                  </span>
                )}
                {city && (
                  <span className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-gray-700 shadow-sm border border-yellow-100">
                    {city}
                  </span>
                )}
              </div>
            </div>
          </motion.div>

          {/* Details / Stats */}
          <div className="flex flex-1 flex-col justify-between mt-3 lg:mt-0 min-w-0">
            {/* Title + Icons */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-base sm:text-lg font-bold text-gray-900">
                  {language('PropertiesListCard.agent')}: {companyName}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  {city}, {state}
                </p>
              </div>

              <motion.div
                className="flex gap-2 text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setLiked(prev => !prev)
                    handleFavorite?.(id)
                  }}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border bg-white shadow-sm transition-colors ${
                    liked
                      ? 'border-red-300 text-red-500'
                      : 'border-gray-200 hover:border-red-300 hover:text-red-500'
                  }`}
                >
                  <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
                </button>
                <button
                  type="button"
                  onClick={() => handleShare?.(id)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm hover:border-blue-300 hover:text-blue-500 transition-colors"
                >
                  <Share size={18} />
                </button>
              </motion.div>
            </div>

            {/* Stats Row */}
            <motion.div
              className="mt-3 rounded-xl bg-gray-50/80 px-3 py-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Stats stats={stats} />
            </motion.div>

            {/* Address */}
            <motion.div
              className="mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
            >
              <p className="flex items-center text-xs sm:text-sm text-gray-700">
                <MapPin size={22} color="#d41111" className="mr-1.5 flex-shrink-0" />
                <span className="line-clamp-2">{address_line}</span>
              </p>
            </motion.div>

            {/* Description */}
            <motion.div
              className="mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-xs sm:text-sm text-gray-600 line-clamp-3">{description}</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right CTA Column */}
      <motion.div
        className={`flex w-full flex-col justify-between bg-gradient-to-b from-[#1F130B] via-[#1A120B] to-[#111111] px-4 py-4 sm:px-5 sm:py-6 ${
          isFiltersOpen ? 'w-full' : 'xl:w-[250px] xl:flex-shrink-0'
        }`}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15, duration: 0.35 }}
      >
        <div className="text-left lg:text-right text-gray-200 space-y-1">
          <p className="text-xs uppercase tracking-[0.16em] text-yellow-400/90 font-semibold">
            Verified Partner
          </p>
          <p className="text-sm font-medium text-white/90">
            {city}, {state}
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-3 w-full">
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
            <Button
              type="button"
              className="w-full rounded-full bg-white text-black py-2.5 text-sm sm:text-base font-semibold shadow-md hover:bg-gray-100"
            >
              {language('PropertiesListCard.contact_agent')}
            </Button>
          </motion.div>
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
            <Button
              type="button"
              onClick={handleViewDetails}
              className="w-full rounded-full border border-white/40 bg-transparent py-2.5 text-sm sm:text-base font-semibold text-white hover:bg-white/10"
            >
              {language('PropertiesListCard.view_details')}
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}
