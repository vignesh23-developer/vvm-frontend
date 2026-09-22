'use client'

import React from 'react'
import { motion, Variants } from 'framer-motion'

const ExplorePropertiesSkeleton = () => {
  const variants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }
  return (
    <motion.div variants={variants} className="bg-white rounded-2xl shadow-md transition overflow-hidden flex flex-col animate-pulse">
      {/* Top Content */}
      <div className="p-6 flex-1">
        {/* District */}
        <div className="h-5 w-32 bg-gray-300 rounded mb-3"></div>

        {/* Price Range */}
        <div className="h-4 w-40 bg-gray-200 rounded mb-4"></div>

        {/* Property Count */}
        <div className="flex items-center gap-2 mb-3">
          <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </div>

        {/* Agents Count */}
        <div className="flex items-center gap-2 mb-3">
          <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="h-[120px] bg-gray-200 shadow-md relative flex flex-col items-start justify-end">
        {/* Circle Avatar */}
        <div className="absolute -top-6 right-1/2 transform -translate-x-1/2 w-20 h-20 bg-gray-300 rounded-full shadow-md"></div>
      </div>
    </motion.div>
  )
}

export default ExplorePropertiesSkeleton
