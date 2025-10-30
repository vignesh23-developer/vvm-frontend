'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Heart, Share } from 'lucide-react'
import Stats from '../../Stats/Stats'
import Image from 'next/image'
import { AgentCardProps } from '@/data/component/agentCardTypes'

export default function AgentCard({
  image,
  title,
  agent,
  agentAddress,
  agentName,
  operatingSince,
  language,
}: AgentCardProps) {
  const stats = [
    { value: '40', label: 'properties_for_sale' },
    { value: '15', label: 'properties_for_rent' },
    { value: '2500', label: 'deals_closed' },
    { value: '5', label: 'team_members' },
  ]

  return (
    <motion.div
      className="flex flex-col lg:flex-row bg-white rounded-2xl shadow-md overflow-hidden"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ scale: 1.01 }}
    >
      <Link href={'/home/agencyDetails'} className="flex-1">
        {/* Left Section */}
        <div className="flex flex-col lg:flex-row gap-4 p-4 flex-1">
          {/* Image + Agent Info */}
          <motion.div
            className="flex flex-col items-start"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={image}
                alt={title}
                width={250}
                height={150}
                className="w-full sm:w-60 h-40 object-cover rounded-lg"
              />
            </motion.div>
            <p className="text-sm font-bold text-gray-800 mt-2 ml-1">
              {language('PropertiesListCard.agent_name')}: {agentName} <br />
              <span className="text-xs text-gray-500">{agentAddress}</span>
            </p>
          </motion.div>

          {/* Details */}
          <div className="flex flex-col justify-between flex-1 mt-3 lg:mt-0">
            {/* Title + Icons */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold">
                  {language('PropertiesListCard.agent')}: {agent}
                </h2>
                <p className="text-[#747474] text-sm sm:text-base font-medium">
                  {language('PropertiesListCard.operating_since')}:{' '}
                  {operatingSince}
                </p>
              </div>
              <motion.div
                className="flex gap-3 text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <motion.div whileTap={{ scale: 0.9 }}>
                  <Heart
                    size={18}
                    className="cursor-pointer hover:text-red-500"
                  />
                </motion.div>
                <motion.div whileTap={{ scale: 0.9 }}>
                  <Share
                    size={18}
                    className="cursor-pointer hover:text-blue-500"
                  />
                </motion.div>
              </motion.div>
            </div>

            {/* Stats Row */}
            <motion.div
              className="mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Stats stats={stats} />
            </motion.div>

            {/* Deals in */}
            <motion.div
              className="mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-gray-700 text-sm sm:text-base">
                <span className="font-medium">Deals in:</span>{' '}
                <span className="text-gray-500">
                  Rent/Lease, Pre-launch, Original Booking, Resale, Others
                </span>
              </p>
            </motion.div>

            {/* Operates in */}
            <motion.div
              className="mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-gray-700 text-sm sm:text-base">
                <span className="font-medium">Operates in:</span>{' '}
                <span className="text-gray-500">
                  Kanakapura Road, RBI Layout, Doddakallasandra, Kar...
                </span>
              </p>
            </motion.div>
          </div>
        </div>
      </Link>
      {/* Right Section */}
      <motion.div
        className="flex flex-col justify-center items-center lg:items-end bg-[#ECECEC] p-4 min-w-full sm:min-w-[220px]"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <div className="flex flex-col gap-3 w-full mt-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-black text-white py-2 rounded-full cursor-pointer hover:bg-gray-800 transition text-sm sm:text-base"
          >
            {language('PropertiesListCard.contact_agent')}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-white border py-2 rounded-full cursor-pointer hover:bg-gray-200 transition text-sm sm:text-base"
          >
            {language('PropertiesListCard.view_details')}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}
