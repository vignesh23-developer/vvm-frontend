'use-client'

import { Heart, Share } from 'lucide-react'
import Image from 'next/image'
import Stats from '../../Stats/Stats'

interface BuilderCardProps {
  image: string
  title: string
  area: string
  status: string
  transaction: string
  facing: string
  description: string
  agent: string
  builderName: string
  agentAddress: string
  language: any
}

export default function BuilderCard({
  image,
  title,
  area,
  status,
  transaction,
  facing,
  description,
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

  return (
    <div className="flex flex-col lg:flex-row bg-white rounded-2xl shadow-md overflow-hidden w-full">
      {/* Left Section */}
      <div className="flex flex-col lg:flex-row gap-4 p-4 flex-1">
        {/* Image + Builder Info */}
        <div className="flex flex-col items-start">
          <Image
            src={image}
            alt={title}
            width={250}
            height={150}
            className="h-40 w-full sm:w-[250px] object-cover rounded-lg hover:scale-105 transition"
          />
          <p className="text-sm font-bold text-gray-700 mt-2">
            {language('builder_name')}: {builderName}
          </p>
        </div>

        {/* Details */}
        <div className="flex flex-col justify-between flex-1">
          {/* Title + Icons */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold">
                  {language('agent')}: {agent}
                </h2>
                <span className="text-[#747474] text-sm">₹ 1.19Cr Onwards</span>
              </div>
              <span className="text-xs text-gray-500">{agentAddress}</span>
            </div>
            <div className="flex gap-3 text-gray-500">
              <Heart
                size={18}
                className="cursor-pointer hover:text-red-500 transition"
              />
              <Share
                size={18}
                className="cursor-pointer hover:text-blue-500 transition"
              />
            </div>
          </div>

          {/* Stats Row */}
          <div className="mt-4">
            <Stats stats={stats} />
          </div>

          {/* Deals in */}
          <div className="mt-4">
            <p className="text-gray-700 text-sm">
              <span className="font-medium">Deals in:</span>{' '}
              <span className="text-gray-500">
                Rent/Lease, Pre-launch, Original Booking, Resale, Others
              </span>
            </p>
          </div>

          {/* Operates in */}
          <div className="mt-2">
            <p className="text-gray-700 text-sm">
              <span className="font-medium">Operates in:</span>{' '}
              <span className="text-gray-500">
                Kanakapura Road, RBI Layout, Doddakallasandra, Kar...
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex flex-col justify-center items-center lg:items-end bg-[#ECECEC] p-4 min-w-full lg:min-w-[200px]">
        <div className="flex flex-col gap-3 w-full mt-4">
          <button className="w-full bg-black text-white py-2 rounded-full cursor-pointer hover:bg-gray-800 transition">
            {language('contact_agent')}
          </button>
          <button className="w-full bg-white border py-2 rounded-full cursor-pointer hover:bg-gray-200 transition">
            {language('view_details')}
          </button>
        </div>
      </div>
    </div>
  )
}
