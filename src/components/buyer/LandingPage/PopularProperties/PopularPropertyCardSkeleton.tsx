import { motion } from 'framer-motion'

export default function PopularPropertyCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full mx-auto rounded-2xl overflow-hidden shadow-md bg-white flex flex-col"
    >
      {/* Image Skeleton */}
      <div className="relative w-full h-56 sm:h-64 bg-gray-200 animate-pulse" />

      {/* Content */}
      <div className="p-3 sm:p-5 bg-[#D9D9D9] flex flex-col flex-grow">
        {/* Address Skeleton */}
        <div className="h-4 w-2/3 bg-gray-300 rounded animate-pulse mb-3" />

        {/* Listing Type + Size Skeleton */}
        <div className="flex items-center justify-between mb-3">
          <div className="h-3 w-20 bg-gray-300 rounded animate-pulse" />
          <div className="h-3 w-20 bg-gray-300 rounded animate-pulse" />
        </div>

        {/* Price + Button Skeleton */}
        <div className="flex justify-between items-center mt-auto">
          <div className="h-8 w-20 bg-gray-300 rounded-md animate-pulse" />
          <div className="h-5 w-16 bg-gray-300 rounded animate-pulse" />
        </div>
      </div>
    </motion.div>
  )
}
