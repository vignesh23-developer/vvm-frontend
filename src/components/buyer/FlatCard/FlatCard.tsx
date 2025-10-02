'use client'

import Image from 'next/image'

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
  return (
    <div className="w-full max-w-sm rounded-2xl bg-white shadow-md overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative w-full aspect-[4/3] mx-auto mt-2 rounded-lg overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
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
          <p className="text-lg sm:text-xl font-bold text-gray-900">{price}</p>
          <p className="text-xs sm:text-sm text-gray-500">Owner {owner}</p>
        </div>
      </div>
    </div>
  )
}
