'use client'

import { Heart, Share, Ruler, Building2, Home, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, Variants } from 'framer-motion'

interface PropertyCardProps {
  image: string
  title: string
  subtitle: string
  area: string
  status: string
  transaction: string
  facing: string
  description: string
  agent: string
  operatingSince: string
  price: string
  pricePerSqft: string
  language?: any
}

export default function PropertyCard({
  image,
  title,
  subtitle,
  area,
  status,
  transaction,
  facing,
  description,
  agent,
  operatingSince,
  price,
  pricePerSqft,
  language,
}: PropertyCardProps) {
  // Animation variants
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
    hover: { scale: 1.02, transition: { duration: 0.3 } },
  }

  const imageVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.08 },
  }

  const iconHover = {
    hover: { scale: 1.2, color: '#f59e0b', transition: { duration: 0.2 } }, // amber-500
  }

  const buttonHover = {
    hover: { y: -3, transition: { duration: 0.2 } },
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="flex flex-col lg:flex-row bg-white rounded-2xl shadow-md overflow-hidden w-full hover:shadow-lg transition-all duration-300"
    >
      {/* Left Section */}
      <Link href={'/propertyDetails'} className="flex-1">
        <div className="flex flex-col lg:flex-row gap-4 p-3 flex-1">
          {/* Image + Agent */}
          <motion.div
            className="flex flex-col items-start w-full sm:w-auto overflow-hidden rounded-md"
            variants={imageVariants}
            initial="rest"
            whileHover="hover"
            animate="rest"
          >
            <motion.div className="overflow-hidden rounded-md">
              <motion.div variants={imageVariants}>
                <Image
                  src={image}
                  alt={title}
                  width={250}
                  height={150}
                  className="w-full sm:w-[250px] h-40 object-cover rounded-md transition-transform duration-500"
                />
              </motion.div>
            </motion.div>

            {/* Agent Info */}
            <motion.p
              className="text-sm text-gray-700 mt-2 ml-1 sm:ml-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {language?.('PropertiesListCard.agent')}: {agent}
              <br />
              <span className="text-xs text-gray-500">
                {language?.('PropertiesListCard.operating_since')}:{' '}
                {operatingSince}
              </span>
            </motion.p>
          </motion.div>

          {/* Details */}
          <div className="flex flex-col justify-between flex-1 w-full">
            {/* Title + Icons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <motion.h2
                  className="text-lg font-semibold"
                  whileHover={{ color: '#111827' }}
                >
                  {title}
                </motion.h2>
                <p className="text-[#747474] font-medium underline">
                  {subtitle}
                </p>
              </div>

              {/* Action icons */}
              <div className="flex gap-3 text-gray-500 shrink-0">
                <motion.div variants={iconHover} whileHover="hover">
                  <Heart size={18} />
                </motion.div>
                <motion.div variants={iconHover} whileHover="hover">
                  <Share size={18} />
                </motion.div>
              </div>
            </div>

            {/* Tags */}
            <motion.div
              className="mt-3 w-full bg-[#F5F5F5] rounded-md flex flex-col sm:flex-row justify-between divide-y sm:divide-y-0 sm:divide-x divide-gray-200 text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Carpet Area */}
              <div className="flex items-center gap-2 px-4 py-3 flex-1">
                <Ruler size={18} className="shrink-0 text-gray-600" />
                <div>
                  <div className="text-[11px] uppercase text-gray-500 font-semibold tracking-wide">
                    {language?.('PropertiesListCard.carpet_area')}
                  </div>
                  <div className="text-[14px] text-gray-800">{area}</div>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2 px-4 py-3 flex-1">
                <Building2 size={18} className="shrink-0 text-gray-600" />
                <div>
                  <div className="text-[11px] uppercase text-gray-500 font-semibold tracking-wide">
                    {language?.('PropertiesListCard.status')}
                  </div>
                  <div className="text-[14px] font-bold text-gray-900">
                    {status}
                  </div>
                </div>
              </div>

              {/* Transaction */}
              <div className="flex items-center gap-2 px-4 py-3 flex-1">
                <Home size={18} className="shrink-0 text-gray-600" />
                <div>
                  <div className="text-[11px] uppercase text-gray-500 font-semibold tracking-wide">
                    {language?.('PropertiesListCard.transaction')}
                  </div>
                  <div className="text-[14px] font-bold text-gray-700 flex items-center gap-1">
                    {transaction}
                    <ChevronDown size={16} className="text-gray-500" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.p
              className="mt-3 text-sm text-gray-600"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <span className="text-green-600">●</span> {facing}
            </motion.p>
            <p className="text-sm text-gray-500 mt-1 line-clamp-3 sm:line-clamp-none">
              {description}
            </p>
          </div>
        </div>
      </Link>

      {/* Right Section */}
      <div className="flex flex-col justify-between bg-[#ECECEC] p-4 w-full lg:w-[240px]">
        {/* Price */}
        <motion.div
          className="text-left lg:text-right"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-bold">{price}</h3>
          <p className="text-sm text-gray-500">{pricePerSqft}</p>
        </motion.div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 w-full mt-4">
          <motion.button
            variants={buttonHover}
            whileHover="hover"
            className="w-full bg-black text-white py-2 rounded-full cursor-pointer hover:bg-gray-800 transition"
          >
            {language?.('PropertiesListCard.contact_agent')}
          </motion.button>

          <motion.button
            variants={buttonHover}
            whileHover="hover"
            className="w-full bg-white border py-2 rounded-full cursor-pointer hover:bg-gray-200 transition"
          >
            {language?.('PropertiesListCard.get_phone_number')}
          </motion.button>

          <motion.p
            className="text-xs text-gray-500 text-center mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {language?.('PropertiesListCard.check_affordability')}
          </motion.p>
        </div>
      </div>
    </motion.div>
  )
}
