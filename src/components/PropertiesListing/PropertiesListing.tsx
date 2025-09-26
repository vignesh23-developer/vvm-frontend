'use client'

import { useState } from 'react'
import PropertyCard from '../PropertyCard/PropertyCard'
import FlatCard from '../FlatCard/FlatCard'
import FilterBar from '../FilterBar/FilterBar'
import AgentCard from '../Agency/AgentCard/AgentCard'
import BuilderCard from '../Builders/BuilderCard/BuilderCard'
import { useTranslations } from 'next-intl'

const flats = [
  {
    title: '2 BHK Flat',
    location: 'Navalur, Chennai',
    price: '₹ 9.10 Cr',
    owner: 'Dev Harish',
    image: '/flat.png',
  },
  {
    title: '3 BHK Flat',
    location: 'OMR, Chennai',
    price: '₹ 7.50 Cr',
    owner: 'Priya Sharma',
    image: '/flat1.png',
  },
  {
    title: '2 BHK Flat',
    location: 'Tambaram, Chennai',
    price: '₹ 5.20 Cr',
    owner: 'Ravi Kumar',
    image: '/flat.png',
  },
]

const properties = [
  {
    image: '/villa.png',
    title: '4 BHK Villa for Sale in Whitefield',
    subtitle: 'Sterling Villa Grande',
    area: '4000 sqft',
    status: 'Ready to Move',
    transaction: 'Resale',
    facing: 'East Facing Properties',
    description:
      '4BHK A Type corner villa for sale in Sterling Villagrande with all amenities',
    agent: 'Rich Source Realty',
    operatingSince: '2009',
    price: '₹ 9.10 Cr',
    pricePerSqft: '₹ 19,465 per sqft',
  },
  {
    image: '/villa.png',
    title: '3 BHK Villa for Sale in Bangalore',
    subtitle: 'Prestige Villa Grande',
    area: '3200 sqft',
    status: 'Under Construction',
    transaction: 'New Booking',
    facing: 'North Facing Properties',
    description:
      'Spacious 3BHK villa with premium facilities and modern design',
    agent: 'Prime Estates',
    operatingSince: '2015',
    price: '₹ 7.80 Cr',
    pricePerSqft: '₹ 18,000 per sqft',
  },
  {
    image: '/villa.png',
    title: '3 BHK Villa for Sale in Bangalore',
    subtitle: 'Prestige Villa Grande',
    area: '3200 sqft',
    status: 'Under Construction',
    transaction: 'New Booking',
    facing: 'North Facing Properties',
    description:
      'Spacious 3BHK villa with premium facilities and modern design',
    agent: 'Prime Estates',
    operatingSince: '2015',
    price: '₹ 7.80 Cr',
    pricePerSqft: '₹ 18,000 per sqft',
  },
]

const AgentPropertiesList = [
  {
    image: '/agent.png',
    title: '4 BHK Villa for Sale in Whitefield',
    area: '4000 sqft',
    status: 'Ready to Move',
    transaction: 'Resale',
    facing: 'East Facing Properties',
    description:
      '4BHK A Type corner villa for sale in Sterling Villagrande with all amenities',
    agent: 'Rich Source Realty',
    operatingSince: '2009',
    agentName: 'Shankar',
    agentAddress: 'MG Road,Bangalore',
  },
  {
    image: '/agent.png',
    title: '3 BHK Villa for Sale in Bangalore',
    area: '3200 sqft',
    status: 'Under Construction',
    transaction: 'New Booking',
    facing: 'North Facing Properties',
    description:
      'Spacious 3BHK villa with premium facilities and modern design',
    agent: 'Prime Estates',
    operatingSince: '2015',
    agentName: 'Shankar',
    agentAddress: 'MG Road,Bangalore',
  },
  {
    image: '/agent.png',
    title: '3 BHK Villa for Sale in Bangalore',
    area: '3200 sqft',
    status: 'Under Construction',
    transaction: 'New Booking',
    facing: 'North Facing Properties',
    description:
      'Spacious 3BHK villa with premium facilities and modern design',
    agent: 'Prime Estates',
    operatingSince: '2015',
    agentName: 'Shankar',
    agentAddress: 'MG Road,Bangalore',
  },
]

const BuildersPropertiesList = [
  {
    image: '/builder.png',
    title: '4 BHK Villa for Sale in Whitefield',
    area: '4000 sqft',
    status: 'Ready to Move',
    transaction: 'Resale',
    facing: 'East Facing Properties',
    description:
      '4BHK A Type corner villa for sale in Sterling Villagrande with all amenities',
    agent: 'Rich Source Realty',
    builderName: 'Shankar',
    agentAddress: 'MG Road,Bangalore',
  },
  {
    image: '/builder.png',
    title: '3 BHK Villa for Sale in Bangalore',
    area: '3200 sqft',
    status: 'Under Construction',
    transaction: 'New Booking',
    facing: 'North Facing Properties',
    description:
      'Spacious 3BHK villa with premium facilities and modern design',
    agent: 'Prime Estates',
    builderName: 'Shankar',
    agentAddress: 'MG Road,Bangalore',
  },
  {
    image: '/builder.png',
    title: '3 BHK Villa for Sale in Bangalore',
    area: '3200 sqft',
    status: 'Under Construction',
    transaction: 'New Booking',
    facing: 'North Facing Properties',
    description:
      'Spacious 3BHK villa with premium facilities and modern design',
    agent: 'Prime Estates',
    builderName: 'Shankar',
    agentAddress: 'MG Road,Bangalore',
  },
]

const PropertiesListing = ({ params }: { params: string }) => {
  const t = useTranslations('PropertiesListCard')
  const filter = useTranslations('PropertiesFilter')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 2 // how many cards per page
  // Pagination logic
  const totalPages = Math.ceil(properties.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentProperties = properties.slice(
    startIndex,
    startIndex + itemsPerPage,
  )

  return (
    <div className="min-h-screen bg-[#F0F0F0]">
      {/* Filter Bar */}
      <FilterBar params={params} language={filter} />

      {/* Heading */}
      <div className="px-6 py-4">
        {params === 'explore_by_category' ? (
          <h1 className="text-xl font-semibold text-gray-800">
            10 Results - Properties for Sale in{' '}
            <span className="text-yellow-600">Chennai</span>
          </h1>
        ) : params === 'agency' ? (
          <h1 className="text-xl font-semibold text-gray-800">
            Agents in Bangalore Who Can Help You
          </h1>
        ) : params === 'builder' ? (
          <h1 className="text-xl font-semibold text-gray-800">
            Builders in Chennai
          </h1>
        ) : null}
      </div>

      {/* Layout */}
      <div className="flex gap-6 px-6 pb-8">
        {/* Left Section - Properties */}
        <div className="flex-1 space-y-6">
          {params === 'explore_by_category'
            ? properties.map((property, index) => (
                <PropertyCard key={index} {...property} language={t} />
              ))
            : params === 'agency'
            ? AgentPropertiesList.map((agentProperty, index) => (
                <AgentCard key={index} {...agentProperty} language={t} />
              ))
            : params === 'builder'
            ? BuildersPropertiesList.map((BuilderProperty, index) => (
                <BuilderCard key={index} {...BuilderProperty} language={t} />
              ))
            : null}

          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              {t('previous')}
            </button>

            {/* Page numbers */}
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded ${
                  currentPage === i + 1
                    ? 'bg-black text-white'
                    : 'hover:bg-gray-200'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              onClick={() =>
                setCurrentPage(prev => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              {t('next')}
            </button>
          </div>
        </div>

        {/* Right Section - Flats */}
        <div className="w-60 space-y-6">
          {flats.map((flat, index) => (
            <FlatCard key={index} {...flat} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default PropertiesListing
