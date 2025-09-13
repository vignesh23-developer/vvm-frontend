import { Heart, Share } from 'lucide-react'

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
}: BuilderCardProps) {
  return (
    <div className="flex bg-white rounded-2xl shadow-md overflow-hidden">
      {/* Left Section */}
      <div className="flex flex-col lg:flex-row gap-4 p-3 flex-1">
        {/* Image */}
        <div className="flex flex-col items-start">
          <img
            src={image}
            alt={title}
            className="h-40 object-cover rounded-lg"
          />
          {/* Agent Info */}
          <p className="text-sm font-bold text-black-600 mt-2 ml-2">
            Builders Name: {builderName} <br />
          </p>
        </div>

        {/* Details */}
        <div className="flex flex-col justify-between flex-1">
          {/* Title + Icons */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Agent: {agent}</h2>
                <span className="text-[#747474] text-sm">₹ 1.19Cr Onwards</span>
              </div>

              <span className="text-xs text-gray-500">{agentAddress}</span>
            </div>
            <div className="flex gap-3 text-gray-500">
              <Heart size={18} />
              <Share size={18} />
            </div>
          </div>

          {/* Stats Row */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-6 py-2">
            <div className="text-center sm:text-left border-r pr-3">
              <p className="text-2xl font-bold">40</p>
              <p className="text-sm font-medium text-gray-700">
                Properties <br /> For Sale
              </p>
            </div>
            <div className="text-center sm:text-left border-r pr-3">
              <p className="text-2xl font-bold">15</p>
              <p className="text-sm font-medium text-gray-700">
                Properties <br /> For Rent
              </p>
            </div>
            <div className="text-center sm:text-left border-r pr-3">
              <p className="text-2xl font-bold">2500</p>
              <p className="text-sm font-medium text-gray-700">
                Deals <br /> Closed
              </p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-2xl font-bold">5</p>
              <p className="text-sm font-medium text-gray-700">
                Team <br /> Members
              </p>
            </div>
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
      <div className="flex flex-col justify-center items-end bg-[#ECECEC] p-4 min-w-[200px]">
        {/* Buttons */}
        <div className="flex flex-col gap-4 w-full mt-4">
          <button className="w-full bg-black text-white py-2 rounded-full cursor-pointer hover:bg-gray-800 transition">
            Contact Agent
          </button>
          <button className="w-full bg-white border py-2 rounded-full cursor-pointer hover:bg-gray-200 transition">
            View Details
          </button>
        </div>
      </div>
    </div>
  )
}
