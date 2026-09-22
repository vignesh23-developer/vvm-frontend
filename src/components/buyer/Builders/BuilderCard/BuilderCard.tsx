'use client'

import { Heart, Share } from 'lucide-react'
import Image from 'next/image'
import { motion, Variants } from 'framer-motion'
import Stats from '../../Stats/Stats'
import { BuilderCardProps } from '@/data/component/builderCardTypes'
import Link from 'next/link'

export default function BuilderCard({
  image,
  title,
  agent,
  agentAddress,
  builderName,
  language,
}: BuilderCardProps) {
  const stats = [
    { value: '40', label: 'properties_for_sale' },
    { value: '15', label: 'properties_for_rent' },
    { value: '2500', label: 'deals_closed' },
    { value: '5', label: 'team_members' },
  ]

  // Animation variants
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
    hover: { scale: 1.02, transition: { duration: 0.3 } },
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="flex flex-col lg:flex-row bg-white rounded-2xl shadow-md overflow-hidden w-full"
    >
      {/* Left Section */}
      <Link href={'/propertyDetails'} className="flex-1">
        <div className="flex flex-col lg:flex-row gap-4 p-4 flex-1">
          {/* Image + Builder Info */}
          <div className="flex flex-col items-start">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden rounded-lg"
            >
              <Image
                src={image}
                alt={title}
                width={250}
                height={150}
                className="h-40 w-full sm:w-[250px] object-cover"
              />
            </motion.div>
            <p className="text-sm font-bold text-gray-700 mt-2">
              {language('PropertiesListCard.builder_name')}: {builderName}
            </p>
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between flex-1">
            {/* Title + Icons */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-bold">
                    {language('PropertiesListCard.agent')}: {agent}
                  </h2>
                  <span className="text-[#747474] text-sm">
                    ₹ 1.19Cr Onwards
                  </span>
                </div>
                <span className="text-xs text-gray-500">{agentAddress}</span>
              </div>
              <div className="flex gap-3 text-gray-500">
                <motion.div
                  whileHover={{ scale: 1.2, color: '#ef4444' }}
                  transition={{ duration: 0.2 }}
                >
                  <Heart size={18} className="cursor-pointer" />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.2, color: '#3b82f6' }}
                  transition={{ duration: 0.2 }}
                >
                  <Share size={18} className="cursor-pointer" />
                </motion.div>
              </div>
            </div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4"
            >
              <Stats stats={stats} />
            </motion.div>

            {/* Deals in */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4"
            >
              <p className="text-gray-700 text-sm">
                <span className="font-medium">Deals in:</span>{' '}
                <span className="text-gray-500">
                  Rent/Lease, Pre-launch, Original Booking, Resale, Others
                </span>
              </p>
            </motion.div>

            {/* Operates in */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-2"
            >
              <p className="text-gray-700 text-sm">
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
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col justify-center items-center lg:items-end bg-[#ECECEC] p-4 min-w-full lg:min-w-[200px]"
      >
        <div className="flex flex-col gap-3 w-full mt-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ backgroundColor: '#1f2937' }}
            className="w-full bg-black text-white py-2 rounded-full cursor-pointer transition"
          >
            {language('PropertiesListCard.contact_agent')}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ backgroundColor: '#e5e7eb' }}
            className="w-full bg-white border py-2 rounded-full cursor-pointer transition"
          >
            {language('PropertiesListCard.view_details')}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}
