'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import PropertyCard from '@/components/buyer/PropertyCard/PropertyCard'
import { useProperties } from '@/app/admin/dashboard/properties-pending-approval/(Hooks)/useProperties'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import Button from '@/components/ui/CustomComponent/Button/Button'
import { PropertiesDto } from './(Dto)/propertiesDto'
import { deleteMethod, postMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'
import Pagination from '@/components/ui/CustomComponent/Paginations/Pagination'
import CustomLoader from '@/components/ui/CustomComponent/Loader/CustomLoader'
import { ResponseDTO } from '@/components/dto/response_dto'
import ApproveOrRejectPropertyModal from '@/components/ui/CustomComponent/Modal/ApproveOrReject/ApproveOrRejectModal'
import SkeletonLoader from '@/components/ui/CustomComponent/SkeletonLoader/SkeletonLoader'
import toast from 'react-hot-toast'

const PAGE_SIZE = 10

const PropertiesPage = () => {
  const t = useTranslations()
  const { user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('pending')
  const [currentPage, setCurrentPage] = useState(1)
  const [favoritedProperties, setFavoritedProperties] = useState<Set<string>>(new Set())
  const [pendingActionPropertyId, setPendingActionPropertyId] = useState<string | null>(null)
  const [modalAction, setModalAction] = useState<string>('')
  const [selectedProperty, setSelectedProperty] = useState<PropertiesDto | null>(null)
  const [comment, setComment] = useState('')
  const [rejectReason, setRejectReason] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Map UI tabs to API approval_status values
  const approvalStatus = activeTab === 'pending' ? 'UNDER_REVIEW' : activeTab === 'rejected' ? 'REJECTED' : undefined

  const { properties, total, isLoading, error, mutateProperties, handlePropertyAction } = useProperties({
    page: currentPage,
    limit: PAGE_SIZE,
    approvalStatus,
  })

  const tabs = useMemo(
    () => [
      { key: 'pending', label: 'Pending' },
      { key: 'rejected', label: 'Rejected' },
    ],
    [],
  )

  const totalItems = total ?? 0
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE))
  const isEmpty = totalItems === 0

  const openModal = (property: PropertiesDto, action: 'approve' | 'reject') => {
    setSelectedProperty(property)
    setModalAction(action)
    setComment('')
    setRejectReason('')
    setIsModalOpen(true)
  }

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
    setModalAction('')
    setSelectedProperty(null)
  }, [])

  const changePage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)))

  const { pendingCount, rejectedCount } = useMemo(() => {
    const pending = properties?.filter(p => p.approval_status === 'UNDER_REVIEW').length || 0
    const rejected = properties?.filter(p => p.approval_status === 'REJECTED').length || 0
    return { pendingCount: pending, rejectedCount: rejected }
  }, [properties])
  const isEmptyTab = (activeTab === 'pending' ? pendingCount : rejectedCount) === 0

  const handleFavorite = async (propertyId: string) => {
    try {
      const response: ResponseDTO = await postMethod(appEndpoints.toggleFavorite, { entity_type: 'property', entity_id: propertyId })
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

  if (isLoading) {
    return (
      <div className="p-10 grid gap-6 md:grid-cols xl:grid-cols">
        {Array.from({ length: PAGE_SIZE }).map((_, index) => (
          <SkeletonLoader key={`property-skeleton-${index}`} />
        ))}
      </div>
    )
  }
  if (error) return <div className="p-6 text-red-600">Failed to load properties.</div>

  return (
    <div className="w-full p-10">
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 pb-3 flex flex-wrap gap-2">
        {tabs.map(tab => {
          const isActive = tab.key === activeTab
          return (
            <Button
              key={tab.key}
              onClick={() => {
                // When switching tabs, reset pagination to first page so results start from page 1
                setActiveTab(tab.key)
                setCurrentPage(1)
              }}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition focus:ring-2 focus:ring-offset-2 ${
                isActive ? 'border-[#7B1E1E] bg-[#7B1E1E] text-white' : 'border-gray-200 text-gray-700 hover:text-[#7B1E1E]'
              }`}
            >
              {tab.label === 'Pending' ? `Pending (${pendingCount ?? '...'})` : `Rejected (${rejectedCount ?? '...'})`}
            </Button>
          )
        })}
      </div>

      {/* Info Text */}
      <div className="text-sm text-gray-600 mb-4 text-center">
        {isEmpty ? (
          'No properties found.'
        ) : isEmptyTab ? (
          'No properties found in this tab.'
        ) : (
          <span className="text-left block">
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, totalItems)} of {totalItems}
          </span>
        )}
      </div>

      {/* Property List */}
      {isEmpty ? (
        <div className="rounded-md border border-dashed border-gray-200 bg-white p-12 text-center text-gray-500">No properties available.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols xl:grid-cols">
          {properties
            ?.filter(p => {
              if (activeTab === 'pending') return p.approval_status === 'UNDER_REVIEW'
              if (activeTab === 'rejected') return p.approval_status === 'REJECTED'
              return true
            })
            .map((property, i) =>
              isLoading ? (
                <SkeletonLoader key={`property-skeleton-${i}`} />
              ) : (
                <PropertyCard
                  key={property.id ?? i}
                  {...property}
                  language={t}
                  primaryActionLabel="Approve"
                  secondaryActionLabel="Reject"
                  thirdActionLabel="View Details"
                  onPrimaryAction={() => openModal(property, 'approve')}
                  onSecondaryAction={() => openModal(property, 'reject')}
                  onThirdAction={() => router.push(`/propertyDetails/${property.id}`)}
                  primaryActionDisabled={pendingActionPropertyId === property.id}
                  secondaryActionDisabled={pendingActionPropertyId === property.id}
                  thirdActionDisabled={pendingActionPropertyId === property.id}
                  handleFavorite={handleFavorite}
                  handleShare={handleShare}
                  isUserFavorited={property.is_user_favorite}
                />
              ),
            )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination totalItems={totalItems} itemsPerPage={PAGE_SIZE} currentPage={currentPage} onPageChange={changePage} />
        </div>
      )}

      {/* Modal */}
      <ApproveOrRejectPropertyModal
        approveOrRejectModalOpen={isModalOpen}
        setApproveOrRejectModalOpen={setIsModalOpen}
        approveOrRejectReason={modalAction}
        userId={user?.id || ''}
        property={selectedProperty}
        propertyRefresh={mutateProperties}
      />
    </div>
  )
}

export default PropertiesPage
