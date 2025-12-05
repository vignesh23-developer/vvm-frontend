'use client'
import { useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSearchProperties } from './hooks/useSearchProperties'
import { postMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'
import SkeletonLoader from '@/components/ui/CustomComponent/SkeletonLoader/SkeletonLoader'
import FilterBar from '@/components/buyer/FilterBar/FilterBar'
import PropertyCard from '@/components/buyer/PropertyCard/PropertyCard'
import Pagination from '@/components/ui/CustomComponent/Paginations/Pagination'
import FlatCard from '@/components/buyer/FlatCard/FlatCard'

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

const PropertiesListPage = () => {
  const t = useTranslations()
  const searchParams = useSearchParams()
  const params = {
    location: decodeURIComponent(searchParams.get('location') || ''),
    listingType: decodeURIComponent(searchParams.get('listingType') || ''),
    type: decodeURIComponent(searchParams.get('type') || ''),
    budget: decodeURIComponent(searchParams.get('budget') || ''),
  }
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  console.log('params 75', params)

  const { properties, handleEdit, handleDelete, total, error, isLoadingProperties, mutateProperties, handlePropertyAction } = useSearchProperties({
    page,
    limit,
    location: params.location,
    listingType: params.listingType,
    type: params.type,
    budget: params.budget,
  })

  const totalNumber = Number(total ?? 0)
  const totalPages = Math.max(1, Math.ceil(totalNumber / limit))

  const changePage = (page: number) => setPage(Math.max(1, Math.min(page, totalPages)))

  const handleFavorite = async (propertyId: string) => {
    try {
      const response = await postMethod(appEndpoints.toggleFavorite, { entity_type: 'property', entity_id: propertyId })
      mutateProperties()
    } catch (err) {
      console.error('Error updating favorite:', err)
    }
  }

  const handleShare = useCallback(() => {
    // if (typeof window !== 'undefined') {
    //   navigator?.clipboard?.writeText(window.location.href)
    //   toast.success('Link copied to clipboard')
    // }
    console.log('Share clicked')
  }, [])

  console.log('PropertiesListPage render:', { properties, total, isLoadingProperties, error })

  return (
    <div className="min-h-screen bg-[#F0F0F0]">
      {/* Filter Bar */}
      <FilterBar params={'explore_by_category'} language={t} />

      {/* Heading */}
      <div className="px-4 sm:px-6 py-4">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
          {total} Results - Properties for Sale in{' '}
          <span className="text-yellow-600">{params.location.slice(0, 1).toUpperCase() + params.location.slice(1)}</span>
        </h1>
      </div>

      {/* Layout */}
      <div className="flex flex-col lg:flex-row gap-6 px-4 sm:px-6 pb-8">
        {/* Left Section - Properties */}
        <div className="flex-1 space-y-6">
          {/* Property Cards */}

          {isLoadingProperties ? (
            Array.from({ length: limit }).map((_, index) => <SkeletonLoader key={`property-skeleton-${index}`} />)
          ) : (properties ?? []).length === 0 ? (
            <p className="text-gray-600 text-center">No properties found in {params.location}</p>
          ) : (
            (properties ?? []).map((property: any, index: number) => (
              <PropertyCard
                key={property.id ?? index}
                {...property}
                language={t}
                primaryActionLabel="View Details"
                onPrimaryAction={() => router.push(`/propertyDetails/${property.id}`)}
                handleFavorite={handleFavorite}
                handleShare={handleShare}
                isUserFavorited={property.is_user_favorite}
              />
            ))
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination totalItems={total} itemsPerPage={limit} currentPage={page} onPageChange={changePage} />
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

export default PropertiesListPage
