import { Heart, Share } from 'lucide-react'
import Stats from '../../Stats/Stats'
import Image from 'next/image'

interface AgentCardProps {
  image: string
  title: string
  area: string
  status: string
  transaction: string
  facing: string
  description: string
  agent: string
  agentName: string
  agentAddress: string
  operatingSince: string
  language: any
}

export default function AgentCard({
  image,
  title,
  area,
  status,
  transaction,
  facing,
  description,
  agent,
  agentAddress,
  agentName,
  operatingSince,
  language,
}: AgentCardProps) {
  const stats = [
    { value: '40', label: 'Properties\nFor Sale' },
    { value: '15', label: 'Properties\nFor Rent' },
    { value: '2500', label: 'Deals\nClosed' },
    { value: '5', label: 'Team\nMembers' },
  ]
  return (
    <div className="flex bg-white rounded-2xl shadow-md overflow-hidden">
      {/* Left Section */}
      <div className="flex flex-col lg:flex-row gap-4 p-3 flex-1">
        {/* Image */}
        <div className="flex flex-col items-start">
          <Image
            src={image}
            alt={title}
            width={250}
            height={150}
            className="h-40 object-cover hover:scale-105 transition"
          />
          {/* Agent Info */}
          <p className="text-sm font-bold text-black-600 mt-2 ml-2">
            {language('agent_name')}: {agentName} <br />
            <span className="text-xs text-gray-500">{agentAddress}</span>
          </p>
        </div>

        {/* Details */}
        <div className="flex flex-col justify-between flex-1">
          {/* Title + Icons */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold">
                {language('agent')}: {agent}
              </h2>
              <p className="text-[#747474] font-medium">
                {language('operating_since')}: {operatingSince}
              </p>
            </div>
            <div className="flex gap-3 text-gray-500">
              <Heart size={18} />
              <Share size={18} />
            </div>
          </div>

          {/* Stats Row */}
          <Stats stats={stats} />

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
      <div className="flex flex-col justify-center items-end bg-[#ECECEC] p-4 min-w-[200px]">
        {/* Buttons */}
        <div className="flex flex-col gap-4 w-full mt-4">
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
