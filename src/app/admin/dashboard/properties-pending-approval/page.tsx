'use client'

import { useCallback, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useProperties, usePropertyApprovalCounts } from '@/app/admin/dashboard/properties-pending-approval/(Hooks)/useProperties'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import Button from '@/components/ui/CustomComponent/Button/Button'
import { PropertiesDto } from './(Dto)/propertiesDto'
import { postMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'
import Pagination from '@/components/ui/CustomComponent/Paginations/Pagination'
import { ResponseDTO } from '@/components/dto/response_dto'
import ApproveOrRejectPropertyModal from '@/components/ui/CustomComponent/Modal/ApproveOrReject/ApproveOrRejectModal'
import SkeletonLoader from '@/components/ui/CustomComponent/SkeletonLoader/SkeletonLoader'
import PropertyOrAdsApproveRejectCard from '@/components/buyer/PropertyOrAdsApproveRejectCard/PropertyOrAdsCard'

const PAGE_SIZE = 10

type ApprovalTab = 'pending' | 'accepted' | 'rejected'

const PropertiesPage = () => {
  const t = useTranslations()
  const { user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<ApprovalTab>('pending')
  const [currentPage, setCurrentPage] = useState(1)
  const [pendingActionPropertyId, setPendingActionPropertyId] = useState<string | null>(null)
  const [modalAction, setModalAction] = useState<string>('')
  const [selectedProperty, setSelectedProperty] = useState<PropertiesDto | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const approvalStatus =
    activeTab === 'pending' ? 'UNDER_REVIEW' : activeTab === 'accepted' ? 'APPROVED' : activeTab === 'rejected' ? 'REJECTED' : undefined

  const { properties, total, isLoading, error, mutateProperties } = useProperties({
    page: currentPage,
    limit: PAGE_SIZE,
    approvalStatus,
  })

  const { pendingCount, rejectedCount, acceptedCount, mutateCounts } = usePropertyApprovalCounts()

  const refreshAll = useCallback(async () => {
    await mutateProperties()
    await mutateCounts()
  }, [mutateProperties, mutateCounts])

  const tabs = useMemo(
    () => [
      { key: 'pending' as const, label: 'Pending', count: pendingCount },
      { key: 'accepted' as const, label: 'Accepted', count: acceptedCount },
      { key: 'rejected' as const, label: 'Rejected', count: rejectedCount },
    ],
    [pendingCount, acceptedCount, rejectedCount],
  )

  const totalItems = total ?? 0
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE))
  const isEmpty = totalItems === 0

  const openModal = (property: PropertiesDto, action: 'approve' | 'reject') => {
    setSelectedProperty(property)
    setModalAction(action)
    setIsModalOpen(true)
  }

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
    setModalAction('')
    setSelectedProperty(null)
  }, [])

  const changePage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)))

  const handleFavorite = async (propertyId: string) => {
    try {
      await postMethod(appEndpoints.toggleFavorite, { entity_type: 'property', entity_id: propertyId })
      await refreshAll()
    } catch (err) {
      console.error('Error updating favorite:', err)
    }
  }

  const handleShare = useCallback(() => {
    console.log('Share clicked')
  }, [])

  const handleEdit = useCallback(
    (propertyId: string) => {
      router.push(`/properties-registration/${propertyId}`)
    },
    [router],
  )

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
                setActiveTab(tab.key)
                setCurrentPage(1)
              }}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition focus:ring-2 focus:ring-offset-2 ${
                isActive ? 'border-[#2a1407] bg-[#2a1407] text-white' : 'border-gray-200 text-gray-700 hover:text-[#2a1407]'
              }`}
            >
              {tab.label} ({tab.count ?? '...'})
            </Button>
          )
        })}
      </div>

      {/* Info Text */}
      <div className="text-sm text-gray-600 mb-4 text-center">
        {isEmpty ? (
          'No properties found.'
        ) : (
          <span className="text-left block">
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, totalItems)} of {totalItems}
          </span>
        )}
      </div>

      {/* Property List */}
      {isEmpty ? (
        <div className="rounded-md border border-dashed border-gray-200 bg-white p-12 text-center text-gray-500">
          No {activeTab} properties available.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols xl:grid-cols">
          {properties.map((property, i) => (
            <PropertyOrAdsApproveRejectCard
              key={property.id ?? i}
              {...property}
              language={t}
              media={property?.media}
              primaryActionLabel={activeTab === 'pending' ? 'Approve' : undefined}
              secondaryActionLabel={activeTab === 'pending' ? 'Reject' : undefined}
              thirdActionLabel="View Details"
              editActionLabel="Edit Property"
              onPrimaryAction={activeTab === 'pending' ? () => openModal(property, 'approve') : undefined}
              onSecondaryAction={activeTab === 'pending' ? () => openModal(property, 'reject') : undefined}
              onThirdAction={() => router.push(`/propertyDetails/${property.id}`)}
              onEditAction={() => handleEdit(property.id)}
              primaryActionDisabled={pendingActionPropertyId === property.id}
              secondaryActionDisabled={pendingActionPropertyId === property.id}
              thirdActionDisabled={pendingActionPropertyId === property.id}
              editActionDisabled={pendingActionPropertyId === property.id}
              handleFavorite={handleFavorite}
              handleShare={handleShare}
              isUserFavorited={property.is_user_favorite}
              isPropertyOrAds="property"
            />
          ))}
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
        propertyRefresh={refreshAll}
      />
    </div>
  )
}

export default PropertiesPage
