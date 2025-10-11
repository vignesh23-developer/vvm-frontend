'use client'

import Image from 'next/image'
import { useState } from 'react'

interface FlatCardProps {
  title: string
  location: string
  price: string
  owner: string
  image: string
}

export default function FlatCard({
  title,
  location,
  price,
  owner,
  image,
}: FlatCardProps) {
  const [isLoading, setIsLoading] = useState(true)
  return (
    <>
      {isLoading ? (
        <div className="w-full max-w-sm rounded-2xl bg-white shadow-md overflow-hidden flex flex-col animate-pulse">
          {/* Image Skeleton */}
          <div className="relative w-full aspect-[4/3] mx-auto mt-1 rounded-lg overflow-hidden bg-gray-200" />

          {/* Details Skeleton */}
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>

            <div className="mt-3">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/4" />
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-sm rounded-2xl bg-white shadow-md overflow-hidden flex flex-col">
          {/* Image */}
          <div className="relative w-full aspect-[4/3] mx-auto mt-1 rounded-lg overflow-hidden">
            <Image
              src={image}
              alt={title}
              fill
              className="p-2 hover:scale-105 transition-transform duration-300"
              priority
            />
          </div>

          {/* Details */}
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-semibold line-clamp-1">
                {title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-1">{location}</p>
            </div>

            <div className="mt-3">
              <p className="text-lg sm:text-xl font-bold text-gray-900">
                {price}
              </p>
              <p className="text-xs sm:text-sm text-gray-500">Owner {owner}</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
