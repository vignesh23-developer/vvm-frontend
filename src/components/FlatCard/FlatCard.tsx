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
    <div className="w-[252px] h-[400px] rounded-2xl bg-white shadow-md overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative w-[234px] h-[217px] item-center mx-auto mt-2 rounded-lg overflow-hidden">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>

      {/* Details */}
      <div className="flex-1 p-4 flex flex-col justify-around">
        <div>
          <h3 className="text-lg font-semibold line-clamp-1">{title}</h3>
          <p className="text-sm text-gray-600 line-clamp-1">{location}</p>
        </div>

        <div className="mt-3">
          <p className="text-xl font-bold text-gray-900">{price}</p>
          <p className="text-sm text-gray-500">Owner {owner}</p>
        </div>
      </div>
    </div>
  )
}
