'use-client'

import { Heart, Share, Ruler, Building2, Home, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

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
  return (
    <div className="flex flex-col lg:flex-row bg-white rounded-2xl shadow-md overflow-hidden w-full">
      {/* Left Section */}
      <Link href={'/propertyDetails'} className="flex-1">
        <div className="flex flex-col lg:flex-row gap-4 p-3 flex-1">
          {/* Image + Agent */}
          <div className="flex flex-col items-start w-full sm:w-auto">
            <Image
              src={image}
              alt={title}
              width={250}
              height={150}
              className="w-full sm:w-[250px] h-40 object-cover rounded-md hover:scale-105 transition"
            />
            {/* Agent Info */}
            <p className="text-sm text-gray-700 mt-2 ml-1 sm:ml-2">
              {language?.('agent')}: {agent} <br />
              <span className="text-xs text-gray-500">
                {language?.('operating_since')}: {operatingSince}
              </span>
            </p>
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between flex-1 w-full">
            {/* Title + Icons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className="text-[#747474] font-medium underline">
                  {subtitle}
                </p>
              </div>
              <div className="flex gap-3 text-gray-500 shrink-0">
                <Heart size={18} />
                <Share size={18} />
              </div>
            </div>

            {/* Tags */}
            <div className="mt-3 w-full bg-[#F5F5F5] rounded-md flex flex-col sm:flex-row justify-between divide-y sm:divide-y-0 sm:divide-x divide-gray-200 text-sm">
              {/* Carpet Area */}
              <div className="flex items-center gap-2 px-4 py-3 flex-1">
                <Ruler size={18} className="shrink-0" />
                <div>
                  <div className="text-[11px] uppercase text-gray-500 font-semibold tracking-wide">
                    {language?.('carpet_area')}
                  </div>
                  <div className="text-[14px] text-gray-800">{area}</div>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2 px-4 py-3 flex-1">
                <Building2 size={18} className="shrink-0" />
                <div>
                  <div className="text-[11px] uppercase text-gray-500 font-semibold tracking-wide">
                    {language?.('status')}
                  </div>
                  <div className="text-[14px] font-bold text-gray-900">
                    {status}
                  </div>
                </div>
              </div>

              {/* Transaction */}
              <div className="flex items-center gap-2 px-4 py-3 flex-1">
                <Home size={18} className="shrink-0" />
                <div>
                  <div className="text-[11px] uppercase text-gray-500 font-semibold tracking-wide">
                    {language?.('transaction')}
                  </div>
                  <div className="text-[14px] font-bold text-gray-700 flex items-center gap-1">
                    {transaction}
                    <ChevronDown size={16} className="text-gray-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="mt-3 text-sm text-gray-600">
              <span className="text-green-600">●</span> {facing}
            </p>
            <p className="text-sm text-gray-500 mt-1 line-clamp-3 sm:line-clamp-none">
              {description}
            </p>
          </div>
        </div>
      </Link>

      {/* Right Section */}
      <div className="flex flex-col justify-between bg-[#ECECEC] p-4 w-full lg:w-[240px]">
        {/* Price */}
        <div className="text-left lg:text-right">
          <h3 className="text-xl font-bold">{price}</h3>
          <p className="text-sm text-gray-500">{pricePerSqft}</p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 w-full mt-4">
          <button className="w-full bg-black text-white py-2 rounded-full cursor-pointer hover:bg-gray-800 transition">
            {language?.('contact_agent')}
          </button>
          <button className="w-full bg-white border py-2 rounded-full cursor-pointer hover:bg-gray-200 transition">
            {language?.('get_phone_number')}
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">
            {language?.('check_affordability')}
          </p>
        </div>
      </div>
    </div>
  )
}
