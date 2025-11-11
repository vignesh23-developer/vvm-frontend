'use client'

import { useState } from 'react'
import PropertyCard from '../PropertyCard/PropertyCard'
import FlatCard from '../FlatCard/FlatCard'
import FilterBar from '../FilterBar/FilterBar'
import AgentCard from '../Agency/AgentCard/AgentCard'
import BuilderCard from '../Builders/BuilderCard/BuilderCard'
import { useTranslations } from 'next-intl'
import SkeletonLoader from '@/components/ui/CustomComponent/SkeletonLoader/SkeletonLoader'

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
    description: '4BHK A Type corner villa for sale in Sterling Villagrande with all amenities',
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
    description: 'Spacious 3BHK villa with premium facilities and modern design',
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
    description: '4BHK A Type corner villa for sale in Sterling Villagrande with all amenities',
    agent: 'Rich Source Realty',
    operatingSince: '2009',
    agentName: 'Shankar',
    agentAddress: 'MG Road,Bangalore',
  },
  {
    image: '/agent.png',
    title: '4 BHK Villa for Sale in Whitefield',
    area: '4000 sqft',
    status: 'Ready to Move',
    transaction: 'Resale',
    facing: 'East Facing Properties',
    description: '4BHK A Type corner villa for sale in Sterling Villagrande with all amenities',
    agent: 'Rich Source Realty',
    operatingSince: '2009',
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
    description: '4BHK A Type corner villa for sale in Sterling Villagrande with all amenities',
    agent: 'Rich Source Realty',
    builderName: 'Shankar',
    agentAddress: 'MG Road,Bangalore',
  },
  {
    image: '/builder.png',
    title: '4 BHK Villa for Sale in Whitefield',
    area: '4000 sqft',
    status: 'Ready to Move',
    transaction: 'Resale',
    facing: 'East Facing Properties',
    description: '4BHK A Type corner villa for sale in Sterling Villagrande with all amenities',
    agent: 'Rich Source Realty',
    builderName: 'Shankar',
    agentAddress: 'MG Road,Bangalore',
  },
]

const PropertiesListing = ({ params }: { params: string }) => {
  const t = useTranslations()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 2
  const totalPages = Math.ceil(properties.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentProperties = properties.slice(startIndex, startIndex + itemsPerPage)
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="min-h-screen bg-[#F0F0F0]">
      {/* Filter Bar */}
      <FilterBar params={params} language={t} />

      {/* Heading */}
      <div className="px-4 sm:px-6 py-4">
        {params === 'explore_by_category' ? (
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
            10 Results - Properties for Sale in <span className="text-yellow-600">Chennai</span>
          </h1>
        ) : params === 'agency' ? (
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Agents in Bangalore Who Can Help You</h1>
        ) : params === 'builder' ? (
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Builders in Chennai</h1>
        ) : null}
      </div>

      {/* Layout */}
      <div className="flex flex-col lg:flex-row gap-6 px-4 sm:px-6 pb-8">
        {/* Left Section - Properties */}
        <div className="flex-1 space-y-6">
          {params === 'explore_by_category'
            ? currentProperties.map((property, index) =>
                isLoading ? (
                  <SkeletonLoader key={index} />
                ) : (
                  // <PropertyCard
                  //   id={''}
                  //   property_category_id={''}
                  //   price_unit={''}
                  //   property_size={''}
                  //   property_size_unit={''}
                  //   listing_type={''}
                  //   door_number={''}
                  //   street_name={''}
                  //   address_line={''}
                  //   city={''}
                  //   district={''}
                  //   state={''}
                  //   postal_code={''}
                  //   country={''}
                  //   latitude={''}
                  //   longitude={''}
                  //   owner_id={''}
                  //   agent_id={''}
                  //   approval_status={''}
                  //   is_published={false}
                  //   is_verified={false}
                  //   is_premium={false}
                  //   is_featured={false}
                  //   is_active={false}
                  //   slug={null}
                  //   meta_description={null}
                  //   meta_keywords={null}
                  //   view_count={0}
                  //   favorite_count={0}
                  //   contact_count={0}
                  //   created_at={''}
                  //   updated_at={''}
                  //   published_at={null}
                  //   approved_at={null}
                  //   media={[]}
                  //   key={index}
                  //   {...property}
                  //   language={t}
                  // />
                  <h1>Upcoming Page</h1>
                ),
              )
            : params === 'agency'
            ? AgentPropertiesList.map((agentProperty, index) =>
                isLoading ? <SkeletonLoader key={index} /> : <AgentCard key={index} {...agentProperty} language={t} />,
              )
            : params === 'builder'
            ? BuildersPropertiesList.map((BuilderProperty, index) =>
                isLoading ? <SkeletonLoader key={index} /> : <BuilderCard key={index} {...BuilderProperty} language={t} />,
              )
            : null}

          {/* Pagination */}
          <div className="flex flex-wrap justify-center items-center gap-2 mt-6">
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              {t('PropertiesListCard.previous')}
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-black text-white' : 'hover:bg-gray-200'}`}
              >
                {i + 1}
              </button>
            ))}

            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              {t('PropertiesListCard.next')}
            </button>
          </div>
        </div>

        {/* Right Section - Flats */}
        <div className="w-full lg:w-64 space-y-6">
          {flats.map((flat, index) => (
            <FlatCard key={index} {...flat} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default PropertiesListing
