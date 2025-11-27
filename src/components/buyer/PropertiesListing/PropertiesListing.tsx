'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useProperties } from '@/app/(seller)/properties/(hooks)/useProperties'
import PropertyCard from '../PropertyCard/PropertyCard'
import FlatCard from '../FlatCard/FlatCard'
import FilterBar from '../FilterBar/FilterBar'
import AgentCard from '../Agency/AgentCard/AgentCard'
import BuilderCard from '../Builders/BuilderCard/BuilderCard'
import { useTranslations } from 'next-intl'
import { postMethod, deleteMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'
import Pagination from '@/components/ui/CustomComponent/Paginations/Pagination'
import SkeletonLoader from '@/components/ui/CustomComponent/SkeletonLoader/SkeletonLoader'
import useAgentCompanyProfile from './(hooks)/useAgentCompanyProfile'

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
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  console.log('params 75', params)

  const { properties, handleEdit, handleDelete, total, error, isLoadingProperties, mutateProperties, handlePropertyAction } = useProperties({
    page,
    limit,
    approval_status: 'APPROVED',
  })

  const { agentCompanyProfileData, agentCompanyProfileFetchErr, agentCompanyProfileFetchLoader, agentCompanyProfileRefresh } =
    useAgentCompanyProfile()

  console.log('agentCompanyProfileData', agentCompanyProfileData)

  console.log('properties', properties)

  const totalItems =
    params === 'explore_by_category'
      ? total ?? 0
      : params === 'agency'
      ? agentCompanyProfileData?.length ?? 0
      : params === 'builder'
      ? BuildersPropertiesList.length
      : 0
  const totalPages = Math.max(1, Math.ceil(totalItems / limit))
  const isEmpty = totalItems === 0

  const changePage = (page: number) => setPage(Math.max(1, Math.min(page, totalPages)))

  const handleFavorite = async (propertyId: string) => {
    try {
      const response = await postMethod(appEndpoints.toggleFavorite, { entity_type: 'property', entity_id: propertyId })
      mutateProperties()
    } catch (err) {
      console.error('Error updating favorite:', err)
    }
  }

  console.log('isLoading', isLoadingProperties, agentCompanyProfileFetchLoader)

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
          {params === 'explore_by_category' && (
            <>
              {isLoadingProperties
                ? Array.from({ length: limit }).map((_, index) => <SkeletonLoader key={`property-skeleton-${index}`} />)
                : properties.map((property, index) => (
                    <PropertyCard
                      key={property.id ?? index}
                      {...property}
                      language={t}
                      primaryActionLabel="View Details"
                      onPrimaryAction={() => router.push(`/propertyDetails/${property.id}`)}
                      handleFavorite={handleFavorite}
                      handleShare={() => console.log('Share', property.id)}
                      isUserFavorited={property.is_user_favorite}
                    />
                  ))}
            </>
          )}

          {params === 'agency' && (
            <>
              {agentCompanyProfileFetchLoader
                ? Array.from({ length: limit }).map((_, index) => <SkeletonLoader key={`agency-skeleton-${index}`} />)
                : agentCompanyProfileData?.map((agentProperty, index) => (
                    <AgentCard key={agentProperty.id ?? index} {...agentProperty} language={t} />
                  ))}
            </>
          )}

          {params === 'builder' && (
            <>
              {isLoadingProperties
                ? Array.from({ length: limit }).map((_, index) => <SkeletonLoader key={`builder-skeleton-${index}`} />)
                : BuildersPropertiesList.map((builderProperty, index) => <BuilderCard key={index} {...builderProperty} language={t} />)}
            </>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination totalItems={totalItems} itemsPerPage={limit} currentPage={page} onPageChange={changePage} />
            </div>
          )}
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
